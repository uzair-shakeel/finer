const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');
const QUALITY = 80;

async function optimizeImages() {
  try {
    const files = fs.readdirSync(ASSETS_DIR);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|svg|png|webp)$/i)) {
        const filePath = path.join(ASSETS_DIR, file);
        const stats = fs.statSync(filePath);
        const fileSizeInMB = stats.size / (1024 * 1024);
        
        if (fileSizeInMB > 0.2) {
          console.log(`Optimizing ${file}...`);
          
          const image = sharp(filePath);
          const metadata = await image.metadata();
          
          if (metadata.width > 1920) {
            image.resize(1920, null, { withoutEnlargement: true });
          }
          
          await image
            .webp({ quality: QUALITY })
            .toFile(path.join(ASSETS_DIR, `${path.parse(file).name}.webp`));
            
          console.log(`✓ Optimized ${file}`);
        }
      }
    }
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages(); 