# Assets Folder

This folder contains static assets that can be accessed directly via URL.

## How to use:

1. **Add images to this folder**: Place your images (png, jpg, svg, etc.) in this directory
2. **Access via URL**: Use the path `/assets/filename.ext` in your code
3. **Example**: If you add `dessert1.png` here, access it via `http://localhost:3001/assets/dessert1.png`

## Examples:

```tsx
// In your React components:
<img src="/assets/dessert1.png" alt="Dessert" />
<img src="/assets/logo.svg" alt="Logo" />

// In CSS:
background-image: url('/assets/hero-bg.jpg');
```

## File Organization:

You can organize with subfolders:
- `/assets/desserts/` - for dessert images
- `/assets/logos/` - for brand assets  
- `/assets/icons/` - for icon files
- `/assets/backgrounds/` - for background images

## Supported formats:
- Images: .png, .jpg, .jpeg, .gif, .svg, .webp
- Videos: .mp4, .webm
- Fonts: .woff, .woff2, .ttf
- Documents: .pdf, .json, .txt