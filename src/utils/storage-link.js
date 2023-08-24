import fs from 'fs';
import path from 'path';

const storageUploadsPath = path.resolve(path.join(process.cwd(), 'src', 'storage', 'uploads'));
const publicUploadsPath = path.resolve(path.join(process.cwd(), 'src', 'public', 'uploads'));

export default function SymlinkPublicFolder() {
  if (!fs.existsSync(publicUploadsPath)) {
    fs.symlinkSync(storageUploadsPath, publicUploadsPath, 'dir'); // 'junction' is for Windows, use 'dir' for Linux/Mac
    console.log('Symlink created successfully');
  } else {
    console.log('Symlink already exists');
  }
}
