export interface Manifest extends chrome.runtime.ManifestV3 {
  icon: {
    source: string;
    sizes: number[];
  };
}

class ManifestParser {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static convertManifestToString(manifest: Manifest): string {
    if (process.env.__FIREFOX__) {
      manifest = this.convertToFirefoxCompatibleManifest(manifest);
    } else if (manifest.browser_specific_settings) {
      delete manifest.browser_specific_settings;
    }
    return JSON.stringify(manifest, null, 2);
  }

  static convertToFirefoxCompatibleManifest(manifest: Manifest) {
    const manifestCopy = {
      ...manifest,
    } as { [key: string]: unknown };

    if (manifest.background) {
      manifestCopy.background = {
        scripts: [manifest.background?.service_worker],
        type: 'module',
      };
    }

    if (manifest.options_page) {
      manifestCopy.options_ui = {
        page: manifest.options_page,
        browser_style: false,
      };
      delete manifestCopy.options_page;
    }

    manifestCopy.content_security_policy = {
      extension_pages: "script-src 'self'; object-src 'self'",
    };

    return manifestCopy as Manifest;
  }
}

export default ManifestParser;
