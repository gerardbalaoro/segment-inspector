
<div align="center">
<img src="src/assets/img/icon.svg" alt="logo" height="80"/>
<h1> Twilio Segment<br/>Developer Tools Extension</h1>

![](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-round&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Vite-646CFF?style=flat-round&logo=vite&logoColor=white)
![GitHub action badge](https://github.com/gerardbalaoro/segment-inspector/actions/workflows/build-zip.yml/badge.svg)


> A browser extension for debugging Twilio Segment events

</div>

## Development

1. Clone this repository.
2. Change `name` and `description` in package.json => **Auto synchronize with manifest**
3. Install pnpm globally: `npm install -g pnpm` (check your node version >= 16.6, recommended >= 18)
4. Run `pnpm install` 

## Installation

### For Chrome

1. Run:
    - Dev: `pnpm dev` or `npm run dev`
    - Prod: `pnpm build` or `npm run build`
2. Open in browser - `chrome://extensions`
3. Check - `Developer mode`
4. Find and Click - `Load unpacked extension`
5. Select - `dist` folder

### For Firefox

1. Run:
    - Dev: `pnpm dev:firefox` or `npm run dev:firefox`
    - Prod: `pnpm build:firefox` or `npm run build:firefox`
2. Open in browser - `about:debugging#/runtime/this-firefox`
3. Find and Click - `Load Temporary Add-on...`
4. Select - `manifest.json` from `dist` folder

> Remember in firefox you add plugin in temporary mode, that's mean it's disappear after close browser, you must do it again, on next launch.

