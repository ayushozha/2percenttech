export const HOST_PRODUCT_IDS = [
  'hackathon',
  'workshop',
  'panel',
  'keynote',
  'private-dinner',
  'watch-party',
] as const;

export type HostProductId = (typeof HOST_PRODUCT_IDS)[number];

