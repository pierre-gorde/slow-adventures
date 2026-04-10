import type { ImageMetadata } from 'astro';

export type MediaItem =
  | { type: 'image'; src: ImageMetadata }
  | { type: 'video'; src: string; poster: string };
