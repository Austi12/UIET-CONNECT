import numpy as np
import cv2
from PIL import Image
import torch
from torchvision import transforms
from sklearn.metrics.pairwise import cosine_similarity

def preprocess_image(image: Image.Image, target_size=(224, 224)) -> np.ndarray:
    """
    Preprocess image for feature extraction
    
    Args:
        image: PIL Image
        target_size: Target size for resizing
        
    Returns:
        Preprocessed image tensor
    """
    # Define transformations
    transform = transforms.Compose([
        transforms.Resize(target_size),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])
    
    return transform(image).unsqueeze(0)

def generate_embedding(image: Image.Image, model) -> np.ndarray:
    """
    Generate embedding vector for an image using the feature extractor
    
    Args:
        image: PIL Image
        model: Pretrained feature extraction model
        
    Returns:
        Embedding vector as numpy array
    """
    # Preprocess image
    img_tensor = preprocess_image(image)
    
    # Generate embedding
    with torch.no_grad():
        embedding = model(img_tensor)
        embedding = embedding.squeeze().cpu().numpy()
    
    # Normalize embedding
    embedding = embedding / (np.linalg.norm(embedding) + 1e-8)
    
    return embedding

def generate_embedding_opencv(image: Image.Image) -> np.ndarray:
    """
    Alternative: Generate embedding using OpenCV features (ORB)
    Useful if deep learning models are too heavy
    
    Args:
        image: PIL Image
        
    Returns:
        Feature descriptor vector
    """
    # Convert PIL to OpenCV format
    img_array = np.array(image)
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    
    # Resize for consistency
    gray = cv2.resize(gray, (224, 224))
    
    # Extract ORB features
    orb = cv2.ORB_create(nfeatures=500)
    keypoints, descriptors = orb.detectAndCompute(gray, None)
    
    # Create fixed-size descriptor
    if descriptors is not None and len(descriptors) > 0:
        # Average pooling of descriptors
        embedding = np.mean(descriptors, axis=0)
    else:
        # Return zero vector if no features found
        embedding = np.zeros(32)
    
    return embedding

def compute_similarity(embedding1: np.ndarray, embedding2: np.ndarray) -> float:
    """
    Compute cosine similarity between two embeddings
    
    Args:
        embedding1: First embedding vector
        embedding2: Second embedding vector
        
    Returns:
        Similarity score (0 to 1)
    """
    # Reshape for sklearn
    emb1 = embedding1.reshape(1, -1)
    emb2 = embedding2.reshape(1, -1)
    
    # Compute cosine similarity
    similarity = cosine_similarity(emb1, emb2)[0][0]
    
    return float(similarity)

def find_top_matches(
    query_embedding: np.ndarray,
    database_embeddings: list,
    top_k: int = 5,
    threshold: float = 0.75
) -> list:
    """
    Find top K similar embeddings from database
    
    Args:
        query_embedding: Query embedding vector
        database_embeddings: List of tuples (id, embedding, metadata)
        top_k: Number of top matches to return
        threshold: Minimum similarity threshold
        
    Returns:
        List of matches with scores
    """
    matches = []
    
    for item_id, embedding, metadata in database_embeddings:
        similarity = compute_similarity(query_embedding, embedding)
        
        if similarity >= threshold:
            matches.append({
                'item_id': item_id,
                'similarity': similarity,
                'metadata': metadata
            })
    
    # Sort by similarity (descending)
    matches.sort(key=lambda x: x['similarity'], reverse=True)
    
    return matches[:top_k]
