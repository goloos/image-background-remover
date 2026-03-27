# Image Background Remover

AI-powered image background removal tool.

## Features

- Remove background from images using AI
- Support for common image formats (PNG, JPG, WEBP)
- Batch processing support
- Easy to use API

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
python remove_bg.py input.png output.png
```

## API Example

```python
from image_bg_remover import remove_background

result = remove_background("input.png")
result.save("output.png")
```

## License

MIT
