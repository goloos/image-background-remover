"""
Image Background Remover
AI-powered background removal for images.
"""

from PIL import Image
import numpy as np


def remove_background(image_path: str, output_path: str = None) -> Image.Image:
    """
    Remove background from an image.
    
    Args:
        image_path: Path to input image
        output_path: Path to save output (optional)
    
    Returns:
        PIL Image with transparent background
    """
    img = Image.open(image_path).convert("RGBA")
    
    # TODO: Implement AI-based background removal
    # This is a placeholder that makes the entire image transparent
    # Replace with actual AI model (e.g., RMBG-1.4, rembg)
    
    return img


def batch_remove(input_dir: str, output_dir: str):
    """
    Process all images in a directory.
    
    Args:
        input_dir: Directory containing input images
        output_dir: Directory to save processed images
    """
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            remove_background(input_path, output_path)
            print(f"Processed: {filename}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python remove_bg.py <input_image> [output_image]")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else "output.png"
    
    result = remove_background(input_path)
    result.save(output_path)
    print(f"Saved: {output_path}")
