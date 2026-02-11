from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from io import BytesIO
from PIL import Image
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import custom modules
from embeddings import generate_embedding, compute_similarity
from model import load_feature_extractor

app = FastAPI(
    title="UIET Connect AI Service",
    description="AI-powered image matching for Lost & Found system",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
feature_extractor = None

@app.on_event("startup")
async def startup_event():
    """Load the feature extraction model on startup"""
    global feature_extractor
    print("Loading feature extraction model...")
    feature_extractor = load_feature_extractor()
    print("Model loaded successfully!")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "UIET Connect AI Service",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": feature_extractor is not None
    }

class EmbeddingRequest(BaseModel):
    """Request model for embedding generation"""
    item_id: str
    item_type: str  # "lost" or "found"

class MatchRequest(BaseModel):
    """Request model for similarity matching"""
    item_id: str
    item_type: str
    top_k: int = 5
    threshold: float = 0.75

class MatchResult(BaseModel):
    """Match result model"""
    item_id: str
    similarity_score: float
    item_type: str

@app.post("/generate-embedding")
async def generate_embedding_endpoint(
    file: UploadFile = File(...),
    item_id: str = None,
    item_type: str = None
):
    """
    Generate image embedding for a lost/found item
    
    Args:
        file: Image file
        item_id: Unique identifier for the item
        item_type: Type of item ("lost" or "found")
    
    Returns:
        Embedding vector as list
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image
        contents = await file.read()
        image = Image.open(BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Generate embedding
        embedding = generate_embedding(image, feature_extractor)
        
        return {
            "success": True,
            "item_id": item_id,
            "item_type": item_type,
            "embedding": embedding.tolist(),
            "embedding_dim": len(embedding)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {str(e)}")

@app.post("/match-items")
async def match_items_endpoint(
    file: UploadFile = File(...),
    embeddings_db: List[dict] = None
):
    """
    Find similar items by comparing embeddings
    
    Args:
        file: Image file to search for
        embeddings_db: List of existing embeddings with metadata
        
    Returns:
        List of matching items with similarity scores
    """
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(BytesIO(contents))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Generate embedding for query image
        query_embedding = generate_embedding(image, feature_extractor)
        
        # If no embeddings provided, return empty
        if not embeddings_db:
            return {
                "success": True,
                "matches": [],
                "message": "No items to compare against"
            }
        
        # Compute similarities
        matches = []
        for item in embeddings_db:
            stored_embedding = np.array(item.get('embedding', []))
            if len(stored_embedding) == 0:
                continue
            
            similarity = compute_similarity(query_embedding, stored_embedding)
            
            if similarity >= float(os.getenv('SIMILARITY_THRESHOLD', '0.75')):
                matches.append({
                    "item_id": item.get('item_id'),
                    "item_type": item.get('item_type'),
                    "similarity_score": float(similarity),
                    "metadata": item.get('metadata', {})
                })
        
        # Sort by similarity score (descending)
        matches.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        # Return top K matches
        top_k = int(os.getenv('TOP_K_MATCHES', '5'))
        
        return {
            "success": True,
            "matches": matches[:top_k],
            "total_compared": len(embeddings_db)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error matching items: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
