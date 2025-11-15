const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying build...')

// Check if dist folder exists
const distPath = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(distPath)) {
  console.error('❌ dist folder not found. Build failed.')
  process.exit(1)
}

// Check if index.html exists
const indexPath = path.join(distPath, 'index.html')
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in dist folder.')
  process.exit(1)
}

// Check if assets exist
const assetsPath = path.join(distPath, 'assets')
if (!fs.existsSync(assetsPath)) {
  console.error('❌ assets folder not found in dist folder.')
  process.exit(1)
}

console.log('✅ Build verification passed!')