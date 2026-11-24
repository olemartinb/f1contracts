/**
 * Google AdSense settings. Ads stay off until `client` is set.
 *
 * - client: your publisher ID from AdSense → Account → Account information, e.g. "ca-pub-1234567890123456".
 * - slots: ad unit IDs (data-ad-slot) from AdSense → Ads → By ad unit → Display ads. Leave a slot empty to skip
 *   that placement. With only `client` set and Auto ads turned on in AdSense, Google picks placements itself.
 *
 * The build also writes /ads.txt from `client`.
 */
export const adsense = {
  client: 'ca-pub-5080402579240378',
  slots: {
    afterGrid: '',
    afterMarket: '',
    afterFaq: '',
  },
};

export type AdPlacement = keyof typeof adsense.slots;
