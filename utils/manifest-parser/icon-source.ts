import { resolve, relative } from 'path';
import sharp from 'sharp';

export type Icon = {
  size: number;
  filename: string;
};

export type ManifestIcons = {
  [key: string]: string;
};

export type IconOptions = {
  name?: string;
  desaturate?: boolean;
};

export default class IconSource {
  constructor(
    private path: string,
    private sizes: number[] = [16, 32, 48, 128],
  ) {}

  async generate(destination: string, options: IconOptions = {}) {
    const converter = async (size: number): Promise<Icon> => {
      const filename = resolve(destination, `${options.name ?? 'icon'}-${size}.png`);
      const image = sharp(this.path).resize(size, size, {
        kernel: sharp.kernel.nearest,
        fit: 'contain',
      });

      if (options.desaturate) {
        image.grayscale();
      }

      await image.toFile(filename);

      return { size, filename };
    };

    const icons: Icon[] = await Promise.all(this.sizes.map(converter));

    return icons.reduce((icons: ManifestIcons, icon: Icon) => {
      icons[icon.size] = relative(destination, icon.filename);
      return icons;
    }, {});
  }
}
