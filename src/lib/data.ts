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

export const ENCYCLOPEDIA_ARTICLES: EncyclopediaArticle[] = [
  {
    id: '1',
    slug: 'blight-disease',
    title: 'Blight Disease',
    category: 'Disease',
    description: 'Blight is a rapid and complete chlorosis, browning, then death of plant tissues such as leaves, flowers, twigs, or stems.',
    symptoms: ['Dark, water-soaked spots on leaves', 'White mold on the underside of leaves', 'Fruit develops dark, sunken areas'],
    prevention: ['Ensure good air circulation', 'Water at the base of plants', 'Rotate crops annually'],
    treatment: ['Remove and destroy infected plants', 'Apply copper-based fungicides', 'Use blight-resistant varieties'],
    imageId: 'blight-disease'
  },
  {
    id: '2',
    slug: 'powdery-mildew',
    title: 'Powdery Mildew',
    category: 'Disease',
    description: 'A fungal disease that affects a wide range of plants, characterized by white powdery spots on the leaves and stems.',
    symptoms: ['White, powdery spots on leaves and stems', 'Yellowing of leaves', 'Distorted or stunted growth'],
    prevention: ['Plant in sunny locations', 'Provide good air circulation', 'Avoid over-fertilizing with nitrogen'],
    treatment: ['Spray with a mixture of milk and water (1:10 ratio)', 'Apply neem oil or horticultural oil', 'Use sulfur or potassium bicarbonate fungicides'],
    imageId: 'powdery-mildew'
  },
  {
    id: '3',
    slug: 'aphids-infestation',
    title: 'Aphids Infestation',
    category: 'Pest',
    description: 'Aphids are small, sap-sucking insects that can cause significant damage to plants by stunting growth and spreading diseases.',
    symptoms: ['Clusters of small insects on new growth', 'Yellow, curled, or misshapen leaves', 'Sticky "honeydew" substance on leaves'],
    prevention: ['Encourage natural predators like ladybugs', 'Inspect plants regularly', 'Use reflective mulch to deter them'],
    treatment: ['Spray with a strong jet of water', 'Apply insecticidal soap', 'Introduce beneficial insects like lacewings'],
    imageId: 'aphids-infestation'
  },
  {
    id: '4',
    slug: 'rust-fungus',
    title: 'Rust Fungus',
    category: 'Disease',
    description: 'Rust is a fungal disease that creates reddish-orange pustules on plant leaves, weakening the plant over time.',
    symptoms: ['Orange, yellow, or brown powdery pustules on leaves', 'Stunted plant growth', 'Premature leaf drop'],
    prevention: ['Water soil, not leaves', 'Ensure proper spacing for air flow', 'Clean up fallen debris at the end of the season'],
    treatment: ['Remove and destroy infected leaves', 'Apply sulfur or copper-based fungicides', 'Rotate crops to avoid reinfection'],
    imageId: 'rust-fungus'
  },
  {
    id: '5',
    slug: 'caterpillar-damage',
    title: 'Caterpillar Damage',
    category: 'Pest',
    description: 'Various species of caterpillars feed on plant leaves, flowers, and fruits, causing widespread damage if not controlled.',
    symptoms: ['Holes chewed in leaves', 'Skeletonized leaves (only veins remain)', 'Visible caterpillars or their droppings (frass)'],
    prevention: ['Use row covers on young plants', 'Encourage birds and predatory insects', 'Check undersides of leaves for eggs'],
    treatment: ['Hand-pick caterpillars off plants', 'Apply Bacillus thuringiensis (Bt), a natural pesticide', 'Use neem oil sprays'],
    imageId: 'caterpillar-damage'
  },
  {
    id: '6',
    slug: 'bacterial-spot',
    title: 'Bacterial Spot',
    category: 'Disease',
    description: 'A common disease in warm, humid climates, affecting peppers and tomatoes by causing spots on leaves and fruit.',
    symptoms: ['Small, water-soaked spots on leaves that turn dark and greasy', 'Raised, scab-like spots on fruit', 'Yellowing and dropping of leaves'],
    prevention: ['Use disease-free seeds', 'Rotate crops with non-susceptible plants', 'Avoid working with plants when they are wet'],
    treatment: ['Apply copper-based bactericides', 'Remove infected plants to prevent spread', 'Improve air circulation'],
    imageId: 'bacterial-spot'
  }
];
