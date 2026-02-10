const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://myvpnsecure.ru'; // Change this to your actual domain
const OUTPUT_FILE = 'sitemap.xml';
const IGNORE_DIRS = ['.git', 'css', 'images', 'scripts', 'node_modules'];
const IGNORE_FILES = ['404.html'];

// Priority mapping based on depth or filename
function getPriority(filePath) {
    if (filePath === 'index.html') return '1.0';
    if (filePath === 'sitemap.html') return '0.5';
    if (filePath.endsWith('index.html')) return '0.8'; // Landing pages
    return '0.6'; // Other pages
}

function getChangeFreq(filePath) {
    if (filePath === 'index.html') return 'daily';
    return 'weekly';
}

function scanDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                scanDir(filePath, fileList);
            }
        } else {
            if (path.extname(file) === '.html' && !IGNORE_FILES.includes(file)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

function generateSitemap() {
    console.log('Scanning for HTML files...');
    const rootDir = process.cwd(); // Run from project root
    // Handle running from scripts folder
    const targetDir = rootDir.endsWith('scripts') ? path.join(rootDir, '..') : rootDir;

    // We want to scan the project root (where index.html is)
    // Assuming this script is in /scripts, and we run `node scripts/generate_sitemap.js` from root

    // Adjust logic: scan the directory containing this script's parent
    // or just assume run from root.
    // Let's assume run from root.

    const allFiles = scanDir(targetDir);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const today = new Date().toISOString().split('T')[0];

    allFiles.forEach(absolutePath => {
        // Convert strict path to relative URL path
        let relativePath = path.relative(targetDir, absolutePath).replace(/\\/g, '/');

        // Skip the script itself if it was somehow included (unlikely with .html filter)
        if (relativePath.startsWith('scripts/')) return;

        // Clean URL logic: remove /index.html and ensure trailing slash for directories
        let urlPath = relativePath;
        if (urlPath === 'index.html') {
            urlPath = '';
        } else if (urlPath.endsWith('/index.html')) {
            urlPath = urlPath.replace(/\/index\.html$/, '/');
        }

        const url = `${BASE_URL}/${urlPath}`;
        const priority = getPriority(relativePath);
        const freq = getChangeFreq(relativePath);

        xml += '    <url>\n';
        xml += `        <loc>${url}</loc>\n`;
        xml += `        <lastmod>${today}</lastmod>\n`;
        xml += `        <changefreq>${freq}</changefreq>\n`;
        xml += `        <priority>${priority}</priority>\n`;
        xml += '    </url>\n';
    });

    xml += '</urlset>';

    const outputPath = path.join(targetDir, OUTPUT_FILE);
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap generated at: ${outputPath}`);
    console.log(`Total URLs: ${allFiles.length}`);
}

generateSitemap();
