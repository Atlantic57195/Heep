import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths to files
const packageJsonPath = path.resolve(__dirname, '../package.json');
const tauriConfPath = path.resolve(__dirname, '../src-tauri/tauri.conf.json');
const cargoTomlPath = path.resolve(__dirname, '../src-tauri/Cargo.toml');

// Read current version from package.json (which is already bumped by npm version)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const newVersion = packageJson.version;

console.log(`Bumping version to ${newVersion}...`);

// Update tauri.conf.json
if (fs.existsSync(tauriConfPath)) {
    const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
    tauriConf.version = newVersion;
    fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
    console.log(`Updated tauri.conf.json to ${newVersion}`);
} else {
    console.error('tauri.conf.json not found!');
    process.exit(1);
}

// Update Cargo.toml
if (fs.existsSync(cargoTomlPath)) {
    let cargoToml = fs.readFileSync(cargoTomlPath, 'utf-8');
    // Simple regex replacement for version = "x.y.z" inside [package] block
    // This assumes standard Cargo.toml formatting where [package] is at the top
    const versionRegex = /^version\s*=\s*"[^"]+"/m;
    if (versionRegex.test(cargoToml)) {
        cargoToml = cargoToml.replace(versionRegex, `version = "${newVersion}"`);
        fs.writeFileSync(cargoTomlPath, cargoToml);
        console.log(`Updated Cargo.toml to ${newVersion}`);
    } else {
        console.warn('Could not find version field in Cargo.toml');
    }
} else {
    console.warn('Cargo.toml not found!');
}

console.log('Version bump complete.');
