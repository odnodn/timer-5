import { copyFile } from 'node:fs/promises';

// Copy index.html to 404.html for client-side routing support
await copyFile('dist/index.html', 'dist/404.html');
console.log('404.html created for client-side routing');
