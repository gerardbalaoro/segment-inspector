
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

Get the latest release for your browser from the
[releases page](https://github.com/gerardbalaoro/segment-inspector/releases/latest).
This extension is currently unpublished and would require additional steps to install.

### Chrome / Edge / Chromium

1. Go to `chrome://extensions` or your browser's extensions page.
2. Find the option to enable **Developer Mode**.
3. If you have the **crx** file, drag and drop it to the extensions page.
4. If you have the **zip** file:
    - Extract the archive to your disk.
    - Click **Load Unpacked** and navigate to where you extracted the **zip** archive.

### Firefox

This is only available for **Nightly** and **Developer** editions of Firefox.

1. Go to `about:config` and set the following options to `false`.
    - `xpinstall.signatures.required`
    - `extensions.langpacks.signatures.required`
2. Go to `about:addons` or your browser's add-on page.
3. Click the cogwheel icon and select **Install Add-on from File**.
4. Find and select the **zip** file you have downloaded.

## Development

This project uses `pnpm` as a package manager. 
You may install it globally using `npm`.

```sh
npm install -g pnpm
```

Install project dependencies.
```
pnpm install
```

Create a development build and install it on your browser.
Hot module replacement (HMR) is enabled and the project will rebuild
on any changes.
```
pnpm run dev
```

If you modified the manifest configuration file.
Please re-run the command and reload the extension.

