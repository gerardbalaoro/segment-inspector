import { resolve } from 'path';
import type { PluginOption } from 'vite';

export default function watchRebuild(): PluginOption {
  let root: string | null = null;

  return {
    name: 'watch-rebuild',
    config(config) {
      root = config.root || process.cwd();
    },
    async buildStart() {
      this.addWatchFile(resolve(root, 'manifest.ts'));
      this.addWatchFile(resolve(root, 'vite.config.ts'));
    },
  };
}
