import torch
import torch.nn as nn
from torchvision import models
import os

def load_feature_extractor(model_name='resnet50'):
    """
    Load a pretrained CNN model for feature extraction
    
    Args:
        model_name: Name of the model ('resnet50', 'resnet18', 'mobilenet')
        
    Returns:
        Feature extraction model
    """
    print(f"Loading {model_name} model...")
    
    # Load pretrained model
    if model_name == 'resnet50':
        model = models.resnet50(pretrained=True)
        # Remove the final classification layer
        feature_extractor = nn.Sequential(*list(model.children())[:-1])
    elif model_name == 'resnet18':
        model = models.resnet18(pretrained=True)
        feature_extractor = nn.Sequential(*list(model.children())[:-1])
    elif model_name == 'mobilenet':
        model = models.mobilenet_v2(pretrained=True)
        feature_extractor = model.features
    else:
        raise ValueError(f"Unknown model: {model_name}")
    
    # Set to evaluation mode
    feature_extractor.eval()
    
    # Move to GPU if available
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    feature_extractor = feature_extractor.to(device)
    
    print(f"Model loaded on device: {device}")
    
    return feature_extractor

def get_embedding_size(model_name='resnet50'):
    """
    Get the embedding size for a given model
    
    Args:
        model_name: Name of the model
        
    Returns:
        Embedding dimension size
    """
    sizes = {
        'resnet50': 2048,
        'resnet18': 512,
        'mobilenet': 1280
    }
    return sizes.get(model_name, 512)

class EmbeddingModel:
    """
    Wrapper class for embedding generation
    """
    def __init__(self, model_name='resnet50'):
        self.model_name = model_name
        self.model = load_feature_extractor(model_name)
        self.embedding_size = get_embedding_size(model_name)
        self.device = next(self.model.parameters()).device
    
    def extract_features(self, image_tensor):
        """
        Extract features from image tensor
        
        Args:
            image_tensor: Preprocessed image tensor
            
        Returns:
            Feature vector
        """
        image_tensor = image_tensor.to(self.device)
        
        with torch.no_grad():
            features = self.model(image_tensor)
            features = features.squeeze()
        
        return features.cpu().numpy()
    
    def __call__(self, image_tensor):
        """Make the class callable"""
        return self.extract_features(image_tensor)
