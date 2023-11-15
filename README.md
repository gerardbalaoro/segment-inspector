
<div align="center">
<img src="src/assets/img/icon.svg" alt="logo" height="80"/>
<h1> Twilio Segment<br/>Developer Tools Extension</h1>

![](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-round&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Vite-646CFF?style=flat-round&logo=vite&logoColor=white)
![GitHub action badge](https://github.com/gerardbalaoro/segment-inspector/actions/workflows/build.yml/badge.svg)


A browser extension for debugging Twilio Segment events

</div>

## Installation

1. Download the [latest release](https://github.com/gerardbalaoro/segment-inspector/releases/latest).
2. Extract the **zip** archive to your disk.
3. Install the unpackaged extension.
    - **Chrome / Edge / Chromium:**
        - Go to `chrome://extensions`.
        - Enable **Developer Mode**.
        - Click **Load Unpacked** and navigate to where you extracted the **zip** archive.

## Development

This project uses `pnpm` as a package manager. 
You may install it globally using `npm`.

```sh
npm install -g pnpm
```

1. Install project dependencies.
    ```
    pnpm install
    ```
2. Create a development build and install it on your browser.
   Hot module replacement is enabled and the project will rebuild
   on any changes.
    ```
    pnpm run dev
    ```
   If you modified the manifest configuration file.
   Please re-run the command and reload the extension.

