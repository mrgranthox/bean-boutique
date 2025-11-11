export const ITEMS_PER_PAGE = 12;

export const ORIGINS = ['All', 'Ethiopia', 'Colombia', 'Guatemala', 'Kenya', 'Brazil', 'Costa Rica', 'Blend', 'Jamaica'];

export const ROAST_LEVELS = ['All', 'Light', 'Medium', 'Dark'];

export const PRICE_RANGES = ['All', 'Under $20', '$20-$30', '$30-$50', 'Over $50'];

export const CERTIFICATIONS = ['All', 'Organic', 'Fair Trade', 'Single Origin'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name' },
  { value: 'origin', label: 'Origin' }
];

export const SAMPLE_REVIEWS = [
  {
    id: 'rev-1',
    customerName: 'Sarah Miller',
    rating: 5,
    title: 'Absolutely exceptional coffee!',
    content: 'This Ethiopian Yirgacheffe has completely changed my morning routine. The floral notes are incredible and the brightness is perfectly balanced. Will definitely be ordering again.',
    date: '2024-01-15',
    verified: true,
    helpful: 23,
    notHelpful: 1,
    variant: '12oz whole bean',
    location: 'Seattle, WA'
  },
  {
    id: 'rev-2',
    customerName: 'Mike Johnson',
    rating: 4,
    title: 'Great quality, fast shipping',
    content: 'Really impressed with the quality and freshness. Arrived quickly and the packaging kept the beans in perfect condition.',
    date: '2024-01-12',
    verified: true,
    helpful: 18,
    notHelpful: 0,
    variant: '12oz ground',
    location: 'Portland, OR'
  },
  {
    id: 'rev-3',
    customerName: 'Emma Wilson',
    rating: 5,
    title: 'Perfect for pour over',
    content: 'Excellent choice for pour over brewing. The citrus notes really shine through and the tea-like quality is exactly what I was looking for.',
    date: '2024-01-10',
    verified: true,
    helpful: 15,
    notHelpful: 2,
    variant: '12oz whole bean',
    location: 'San Francisco, CA'
  }
];