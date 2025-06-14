const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load .env file
const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found!');
  process.exit(1);
}

// Read .env file
const envConfig = require('dotenv').parse(fs.readFileSync(envPath));

// Update Android manifest
const androidManifestPath = path.resolve(__dirname, '../android/app/src/main/AndroidManifest.xml');
let androidManifest = fs.readFileSync(androidManifestPath, 'utf8');
androidManifest = androidManifest.replace(
  /android:value="\${GOOGLE_MAPS_API_KEY}"/,
  `android:value="${envConfig.GOOGLE_MAPS_API_KEY}"`
);
fs.writeFileSync(androidManifestPath, androidManifest);

// Update iOS Info.plist
const iosInfoPlistPath = path.resolve(__dirname, '../ios/myapp/Info.plist');
let iosInfoPlist = fs.readFileSync(iosInfoPlistPath, 'utf8');
iosInfoPlist = iosInfoPlist.replace(
  /<string>\$\(GOOGLE_MAPS_API_KEY\)<\/string>/,
  `<string>${envConfig.GOOGLE_MAPS_API_KEY}</string>`
);
fs.writeFileSync(iosInfoPlistPath, iosInfoPlist);

console.log('Environment variables loaded successfully!'); 