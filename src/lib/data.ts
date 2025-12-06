import type { EncyclopediaArticle, PreventiveCare } from '@/lib/types';

export const PREVENTIVE_CARE_TIPS: PreventiveCare[] = [
    {
        id: '1',
        crop: 'Tomatoes',
        tips: [
            {
                title: 'Proper Spacing',
                description: 'Plant tomato seedlings at least 24-36 inches apart to ensure good air circulation, which helps prevent fungal diseases like blight.'
            },
            {
                title: 'Consistent Watering',
                description: 'Water deeply and at the base of the plant to avoid wetting the foliage. Inconsistent watering can lead to blossom-end rot.'
            },
            {
                title: 'Mulching',
                description: 'Apply a layer of organic mulch (like straw or wood chips) to conserve moisture, suppress weeds, and prevent soil-borne diseases from splashing onto leaves.'
            }
        ]
    },
    {
        id: '2',
        crop: 'Leafy Greens (Spinach, Lettuce)',
        tips: [
            {
                title: 'Crop Rotation',
                description: 'Avoid planting leafy greens in the same spot year after year to prevent the buildup of soil pests and diseases.'
            },
            {
                title: 'Shade in Hot Weather',
                description: 'Provide partial shade during the hottest parts of the day to prevent bolting (premature flowering) and scorched leaves.'
            },
            {
                title: 'Monitor for Pests',
                description: 'Regularly check for aphids and cabbage worms. Hand-pick larger pests or use insecticidal soap for smaller ones.'
            }
        ]
    },
    {
        id: '3',
        crop: 'Peppers & Eggplants',
        tips: [
            {
                title: 'Support and Staking',
                description: 'Provide stakes or cages to support the plants as they grow heavy with fruit. This keeps fruit off the ground and improves air circulation.'
            },
            {
                title: 'Fertilize Appropriately',
                description: 'Use a balanced, low-nitrogen fertilizer. Too much nitrogen can encourage lush foliage at the expense of fruit production.'
            },
            {
                title: 'Watch for Bacterial Spot',
                description: 'Avoid working with plants when they are wet to prevent the spread of bacterial diseases. Use copper-based sprays as a preventive measure if needed.'
            }
        ]
    }
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}
