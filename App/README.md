# 3D Heart Visualization - TypeScript Edition

Interactive 3D heart model built with Three.js and TypeScript, featuring a complete Docker-based development environment.

## Features

- **3D Heart Model**: Realistic heart shape with anatomical details including chambers and veins
- **Interactive Controls**: Pan, rotate, and zoom around the heart using your mouse
- **Beautiful Materials**: Realistic textures with transparency and lighting effects
- **Atmospheric Effects**: Floating particles and dynamic lighting for an immersive experience
- **Responsive Design**: Works on all screen sizes and devices
- **Animation**: Gentle rotation and pulsing effects that can be toggled on/off
- **TypeScript**: Full type safety and modern development experience
- **Docker Development**: Complete containerized development environment

## Quick Start with Docker

1. **Start the development environment**:
   ```bash
   docker compose up -d
   ```

2. **Enter the development container**:
   ```bash
   docker compose exec dev sh
   ```

3. **Inside the container, install dependencies, build and run**:
   ```bash
   yarn install 
   yarn build
   yarn dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

5. **Shutdown**:
   Ctrl+C to stop container
   Exit container:
   ```bash
   exit
   ```
   ```bash
   docker compose down
   ```

## Development Scripts

- `yarn dev` - Start development server with watch mode
- `yarn build` - Build production version
- `yarn build:watch` - Watch mode for TypeScript compilation
- `yarn serve` - Serve the built files
- `yarn start` - Build and serve (production mode)
- `yarn type-check` - Run TypeScript type checking
- `yarn clean` - Clean build directory

## Controls

- **Left Click + Drag**: Rotate the heart around its center
- **Right Click + Drag**: Pan the view
- **Scroll Wheel**: Zoom in and out
- **Reset View Button**: Return to the default camera position
- **Toggle Animation Button**: Start/stop the heart's gentle rotation and pulsing

## Project Structure

```
heartTest/
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile             # Docker image definition
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── index.html             # Main HTML file with UI and styling
├── src/
│   ├── heart.ts           # Main TypeScript source code
│   └── assets/
│       └── realistic_human_heart.glb  # 3D heart model
└── dist/                  # Built files (generated)
    ├── heart.js           # Compiled JavaScript
    ├── heart.js.map       # Source maps
    ├── index.html         # Copied HTML
    └── realistic_human_heart.glb  # Copied assets
```

## Technical Details

- **TypeScript 5.3+**: Full type safety with strict configuration
- **Three.js 0.158**: 3D graphics library for WebGL rendering
- **Node.js 18**: Modern JavaScript runtime
- **Yarn**: Fast, reliable package manager
- **Docker**: Containerized development environment
- **Hot Reload**: Automatic recompilation and serving during development

## Development Environment

The project uses Docker for a consistent development environment:

- **Base Image**: Node.js 18 Alpine
- **Package Manager**: Yarn with lockfile support
- **Build System**: TypeScript compiler with watch mode
- **Dev Server**: http-server with CORS support
- **Port Mapping**: 3000 (main app), 8080 (backup)

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

You can easily modify the heart appearance by editing the `src/heart.ts` file:

- **Colors**: Change the `color` property in materials
- **Size**: Adjust the `scale` values
- **Animation Speed**: Modify the rotation and pulse values in the `animate()` function
- **Lighting**: Adjust light positions and intensities in `addLighting()`

## TypeScript Benefits

- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Better IDE support with autocomplete
- **Refactoring**: Safe renaming and restructuring
- **Documentation**: Self-documenting code with type annotations
- **Modern Features**: Latest ECMAScript features with transpilation

## Troubleshooting

### Container Issues
- Make sure Docker is running
- Try `docker compose down && docker compose up -d` to restart
- Check logs with `docker compose logs dev`

### Build Issues
- Clear build cache: `yarn clean && yarn build`
- Check TypeScript errors: `yarn type-check`
- Ensure all dependencies are installed: `yarn install`

### Loading Issues
- Verify the GLB model file is in `src/assets/`
- Check browser console for errors
- Try the fallback heart if model fails to load

## Dependencies

### Runtime Dependencies
- **three**: 3D graphics library

### Development Dependencies
- **@types/three**: TypeScript definitions for Three.js
- **typescript**: TypeScript compiler
- **concurrently**: Run multiple commands simultaneously
- **http-server**: Static file server with CORS support

No additional build tools or bundlers required - the setup uses native ES modules with TypeScript compilation!