# Event Manager

React application

## 🚀 Tech Stack
- react
- react-native

## 📦 Installation
```bash
npm install
```

## ▶️ Run
```bash
npm run dev
```

## 🛠️ Scripts
- `dev`: EXPO_NO_TELEMETRY=1 expo start --tunnel
- `android`: EXPO_NO_TELEMETRY=1 expo start --android
- `ios`: EXPO_NO_TELEMETRY=1 expo start --ios
- `web`: EXPO_NO_TELEMETRY=1 expo start --web
- `build:web`: expo export -p web && npx workbox generateSW workbox-config.js
- `build:android`: expo prebuild -p android
- `lint`: eslint .
- `readme`: node scripts/generate-readme.js

## 📁 Project Structure
```
src/
components/
pages/
services/
```