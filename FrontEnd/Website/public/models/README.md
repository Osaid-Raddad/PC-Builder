# 3D Models Setup Guide

## How to Add Your 3D Models

To display your 3D GLB models on the home page, follow these steps:

### 1. Place Your Models

Add your 3 GLB model files to the `public/models/` directory with these names:

- `gpu.glb` - Your GPU/Graphics Card model
- `cpu.glb` - Your CPU/Processor model
- `case.glb` - Your PC Case model

### 2. File Requirements

- **Format**: `.glb` or `.gltf` (GLB is preferred as it's a single file)
- **Size**: Keep models under 10MB for optimal loading
- **Optimization**: Use tools like [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline) to compress if needed

### 3. Model Orientation

The models are set to auto-rotate. If your model appears:

- **Too large/small**: Adjust the camera position in `ModelViewer.jsx` (line with `minDistance` and `maxDistance`)
- **Wrong orientation**: You may need to rotate the model in a 3D editor before exporting

### 4. Customization

You can customize each model section in `Home.jsx`:

- **Title**: Change the heading text
- **Description**: Modify the description text
- **Component Name**: Update the badge text
- **Model Path**: Point to different model files

### 5. Adding More Models

To add additional models:

1. Import `ModelViewer` component
2. Add a new div with the `ModelViewer` component
3. Provide the model path and details

Example:

```jsx
<div className="mb-16">
  <ModelViewer
    modelPath="/models/motherboard.glb"
    title="Gaming Motherboard"
    description="High-end board with RGB and overclocking support"
    componentName="Motherboard"
  />
</div>
```

### 6. Finding Free 3D Models

If you need sample models:

- [Sketchfab](https://sketchfab.com/) - Free 3D models (downloadable as GLB)
- [Poly Pizza](https://poly.pizza/) - Free low-poly models
- [CGTrader](https://www.cgtrader.com/) - Mix of free and paid models

### 7. Features

Each 3D viewer includes:

- ✅ Auto-rotation
- ✅ Zoom controls (scroll wheel)
- ✅ Orbit controls (click and drag)
- ✅ Studio lighting environment
- ✅ Loading indicator
- ✅ Responsive design

## Troubleshooting

**Model not appearing?**

- Check console for errors (F12)
- Verify file path is correct
- Ensure model file is in `public/models/`
- Try using a different GLB model to test

**Model looks weird?**

- Try adjusting camera position values
- Check model scale in 3D editor
- Ensure model is exported properly from your 3D software

**Performance issues?**

- Compress/optimize your GLB files
- Reduce polygon count
- Use smaller texture sizes
