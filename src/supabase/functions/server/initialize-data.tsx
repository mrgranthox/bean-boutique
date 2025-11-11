import * as kv from "./kv_store.tsx";

// Coffee products data
const coffeeProducts = [
  {
    id: 'coffee-ethiopian-yirgacheffe',
    name: 'Ethiopian Yirgacheffe',
    category: 'coffee',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Bright and floral single-origin coffee with notes of citrus and tea',
    roastLevel: 'Light',
    origin: 'Ethiopia',
    processingMethod: 'Washed',
    flavorNotes: ['Citrus', 'Tea', 'Floral'],
    rating: 4.8,
    inStock: true,
    stockQuantity: 45,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coffee-guatemalan-antigua',
    name: 'Guatemalan Antigua',
    category: 'coffee',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGFudGlndWF8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Full-bodied coffee with chocolate and spice notes',
    roastLevel: 'Medium',
    origin: 'Guatemala',
    processingMethod: 'Washed',
    flavorNotes: ['Chocolate', 'Spice', 'Full-bodied'],
    rating: 4.6,
    inStock: true,
    stockQuantity: 32,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coffee-colombian-supremo',
    name: 'Colombian Supremo',
    category: 'coffee',
    price: 21.99,
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGNvbG9tYmlhbnxlbnwxfHx8fDE3NTU4MTg1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Well-balanced coffee with caramel sweetness and nutty undertones',
    roastLevel: 'Medium',
    origin: 'Colombia',
    processingMethod: 'Washed',
    flavorNotes: ['Balanced', 'Caramel', 'Nutty'],
    rating: 4.5,
    inStock: true,
    stockQuantity: 28,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coffee-brazilian-santos',
    name: 'Brazilian Santos',
    category: 'coffee',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGJyYXppbGlhbnxlbnwxfHx8fDE3NTU4MTg1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Smooth and mild coffee perfect for everyday drinking',
    roastLevel: 'Medium',
    origin: 'Brazil',
    processingMethod: 'Semi-washed',
    flavorNotes: ['Smooth', 'Mild', 'Everyday'],
    rating: 4.3,
    inStock: true,
    stockQuantity: 22,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coffee-kenyan-aa',
    name: 'Kenyan AA',
    category: 'coffee',
    price: 26.99,
    image: 'https://images.unsplash.com/photo-1545565578-1d6a4e2b2b1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGtlbnlhbnxlbnwxfHx8fDE3NTU4MTg1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Wine-like acidity with black currant and tomato notes',
    roastLevel: 'Light',
    origin: 'Kenya',
    processingMethod: 'Washed',
    flavorNotes: ['Wine-like', 'Acidic', 'Black-currant'],
    rating: 4.7,
    inStock: true,
    stockQuantity: 18,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coffee-house-blend',
    name: 'Bean Boutique House Blend',
    category: 'coffee',
    price: 23.99,
    image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGJsZW5kfGVufDF8fHx8MTc1NTgxODUwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Our signature blend combining beans from three continents',
    roastLevel: 'Medium-Dark',
    origin: 'Blend',
    processingMethod: 'Mixed',
    flavorNotes: ['Signature', 'Blend', 'Balanced'],
    rating: 4.9,
    inStock: true,
    stockQuantity: 35,
    featured: true,
    createdAt: new Date().toISOString()
  }
];

// Equipment products data
const equipmentProducts = [
  {
    id: 'equipment-burr-grinder',
    name: 'Precision Burr Grinder',
    category: 'equipment',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1573066380308-24ff4c273dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBncmluZGVyJTIwbWFudWFsfGVufDF8fHx8MTc1NTg2ODgzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional-grade burr grinder for consistent grind size',
    specifications: {
      'Brand': 'CoffeeTech',
      'Type': 'Burr Grinder',
      'Grind Settings': '40',
      'Capacity': '350g',
      'Motor': '150W',
      'Material': 'Stainless Steel'
    },
    rating: 4.8,
    inStock: true,
    stockQuantity: 12,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'equipment-pour-over-set',
    name: 'Pour Over Dripper Set',
    category: 'equipment',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1621744895572-da8dde3c425a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwcG91ciUyMG92ZXJ8ZW58MXx8fHwxNzU1Nzk2NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Complete pour over set including dripper, filters, and carafe',
    specifications: {
      'Brand': 'BrewMaster',
      'Type': 'Pour Over Set',
      'Material': 'Ceramic & Glass',
      'Capacity': '600ml',
      'Includes': 'Dripper, Carafe, Filters'
    },
    rating: 4.6,
    inStock: true,
    stockQuantity: 25,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'equipment-espresso-machine',
    name: 'Professional Espresso Machine',
    category: 'equipment',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU1ODY4ODMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Semi-automatic espresso machine with milk steaming wand',
    specifications: {
      'Brand': 'EspressoPlus',
      'Type': 'Semi-Automatic Espresso',
      'Boiler': '1.4L Stainless Steel',
      'Pressure': '15 Bar',
      'Features': 'Steam Wand, PID Control'
    },
    rating: 4.9,
    inStock: true,
    stockQuantity: 6,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'equipment-french-press',
    name: 'French Press Coffee Maker',
    category: 'equipment',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBwcmVzcyUyMGNvZmZlZXxlbnwxfHx8fDE3NTU4Njg4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Classic French press for full-bodied coffee brewing',
    specifications: {
      'Brand': 'ClassicBrew',
      'Type': 'French Press',
      'Material': 'Borosilicate Glass',
      'Capacity': '1000ml',
      'Filter': 'Stainless Steel Mesh'
    },
    rating: 4.4,
    inStock: true,
    stockQuantity: 18,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'equipment-coffee-scale',
    name: 'Digital Coffee Scale',
    category: 'equipment',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1607889175222-a3b8ec9ccd8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzY2FsZSUyMGRpZ2l0YWx8ZW58MXx8fHwxNzU1ODY4ODMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Precision scale with timer for perfect coffee ratios',
    specifications: {
      'Brand': 'PrecisionPro',
      'Type': 'Digital Scale',
      'Accuracy': '0.1g',
      'Capacity': '2000g',
      'Features': 'Timer, Auto-off, Tare'
    },
    rating: 4.7,
    inStock: true,
    stockQuantity: 14,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'equipment-cold-brew-maker',
    name: 'Cold Brew Coffee Maker',
    category: 'equipment',
    price: 65.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwYnJldyUyMG1ha2VyfGVufDF8fHx8MTc1NTg2ODgzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Glass cold brew maker for smooth, low-acid coffee',
    specifications: {
      'Brand': 'ColdCraft',
      'Type': 'Cold Brew Maker',
      'Material': 'Borosilicate Glass',
      'Capacity': '1000ml',
      'Filter': 'Fine Mesh Stainless Steel'
    },
    rating: 4.5,
    inStock: true,
    stockQuantity: 20,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

// Events data
const events = [
  {
    id: 'event-latte-art-workshop',
    title: 'Latte Art Workshop',
    description: 'Learn the fundamentals of latte art from our skilled baristas. Perfect for beginners wanting to master milk steaming and pouring techniques.',
    date: '2024-02-15T10:00:00Z',
    endDate: '2024-02-15T12:00:00Z',
    price: 45.00,
    maxAttendees: 12,
    currentAttendees: 8,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydHxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Maria Santos',
    skillLevel: 'Beginner',
    category: 'Workshop',
    tags: ['latte-art', 'barista', 'milk-steaming', 'beginner'],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'event-cupping-session',
    title: 'Coffee Cupping Session',
    description: 'Discover the art of professional coffee tasting. Learn to identify flavor notes, evaluate quality, and develop your palate.',
    date: '2024-02-20T14:00:00Z',
    endDate: '2024-02-20T16:00:00Z',
    price: 35.00,
    maxAttendees: 15,
    currentAttendees: 6,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXBwaW5nJTIwc2V0fGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'David Chen',
    skillLevel: 'All Levels',
    category: 'Tasting',
    tags: ['cupping', 'tasting', 'flavor-notes', 'professional'],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'event-home-brewing-masterclass',
    title: 'Home Brewing Masterclass',
    description: 'Master multiple brewing methods at home. Cover pour-over, French press, AeroPress, and more in this comprehensive session.',
    date: '2024-02-25T11:00:00Z',
    endDate: '2024-02-25T14:00:00Z',
    price: 65.00,
    maxAttendees: 10,
    currentAttendees: 4,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwaG9tZXxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Sarah Williams',
    skillLevel: 'Intermediate',
    category: 'Workshop',
    tags: ['brewing', 'home-brewing', 'multiple-methods', 'masterclass'],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'event-espresso-fundamentals',
    title: 'Espresso Fundamentals',
    description: 'Deep dive into espresso brewing. Learn about grind size, extraction time, pressure, and achieving the perfect shot.',
    date: '2024-03-02T09:00:00Z',
    endDate: '2024-03-02T11:30:00Z',
    price: 55.00,
    maxAttendees: 8,
    currentAttendees: 3,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU1ODY4ODMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Marco Rodriguez',
    skillLevel: 'Beginner',
    category: 'Workshop',
    tags: ['espresso', 'fundamentals', 'extraction', 'pressure'],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'event-coffee-and-food-pairing',
    title: 'Coffee & Food Pairing',
    description: 'Explore how different coffees complement various foods. Learn the principles of flavor pairing and enhance your tasting experience.',
    date: '2024-03-08T15:00:00Z',
    endDate: '2024-03-08T17:00:00Z',
    price: 40.00,
    maxAttendees: 20,
    currentAttendees: 12,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBmb29kJTIwcGFpcmluZ3xlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Emma Thompson',
    skillLevel: 'All Levels',
    category: 'Tasting',
    tags: ['pairing', 'food', 'flavor', 'tasting-experience'],
    featured: false,
    createdAt: new Date().toISOString()
  }
];

// Subscription products data
const subscriptionProducts = [
  {
    id: 'subscription-monthly-house-blend-2',
    name: 'House Blend Subscription',
    category: 'subscription',
    price: 31.98,
    image: 'https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Monthly delivery of House Blend - 2 bags (24oz)',
    specifications: {
      'Frequency': 'Monthly',
      'Quantity': '2 bags (24oz)',
      'Coffee': 'House Blend',
      'Discount': '20%'
    },
    rating: 4.8,
    inStock: true,
    stockQuantity: 999,
    featured: true,
    createdAt: new Date().toISOString()
  }
];

// Offer products data
const offerProducts = [
  {
    id: 'offer-1-item-0',
    name: 'Ethiopian Yirgacheffe',
    category: 'coffee',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Part of Ethiopian Coffee Bundle',
    roastLevel: 'Light',
    origin: 'Ethiopia',
    processingMethod: 'Washed',
    flavorNotes: ['Citrus', 'Tea', 'Floral'],
    rating: 4.8,
    inStock: true,
    stockQuantity: 45,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'offer-1-item-1',
    name: 'Ethiopian Sidamo',
    category: 'coffee',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Part of Ethiopian Coffee Bundle',
    roastLevel: 'Medium',
    origin: 'Ethiopia',
    processingMethod: 'Washed',
    flavorNotes: ['Berry', 'Wine', 'Dark Chocolate'],
    rating: 4.6,
    inStock: true,
    stockQuantity: 30,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'offer-1-item-2',
    name: 'Ethiopian Harrar',
    category: 'coffee',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Part of Ethiopian Coffee Bundle',
    roastLevel: 'Medium-Dark',
    origin: 'Ethiopia',
    processingMethod: 'Natural',
    flavorNotes: ['Fruity', 'Wine-like', 'Mocha'],
    rating: 4.7,
    inStock: true,
    stockQuantity: 25,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'offer-12',
    name: 'Flash Sale - Coffee Storage',
    category: 'equipment',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzdG9yYWdlJTIwY2FuaXN0ZXJ8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium airtight canisters to keep your coffee fresh',
    specifications: {
      'Material': 'Stainless Steel',
      'Capacity': '500g',
      'Seal': 'Airtight',
      'Features': 'Date Tracker, Vacuum Seal'
    },
    rating: 4.5,
    inStock: true,
    stockQuantity: 25,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

// Static data products that appear in various pages
const staticDataProducts = [
  {
    id: 'coffee-1',
    name: 'Ethiopian Yirgacheffe',
    category: 'coffee',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Bright and floral single-origin coffee with exceptional complexity',
    roastLevel: 'Light',
    origin: 'Ethiopia',
    processingMethod: 'Washed',
    flavorNotes: ['Citrus', 'Tea', 'Floral'],
    rating: 4.8,
    inStock: true,
    stockQuantity: 45,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coffee-8',
    name: 'Jamaican Blue Mountain',
    category: 'coffee',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Ultra-premium coffee with unparalleled smoothness and complexity',
    roastLevel: 'Medium',
    origin: 'Jamaica',
    processingMethod: 'Washed',
    flavorNotes: ['Mild', 'Smooth', 'Sweet'],
    rating: 4.9,
    inStock: true,
    stockQuantity: 8,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'eq-1',
    name: 'Precision Burr Grinder',
    category: 'equipment',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1573066380308-24ff4c273dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBncmluZGVyJTIwbWFudWFsfGVufDF8fHx8MTc1NTg2ODgzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional-grade burr grinder for consistent grind size and optimal extraction. Features precision grinding for all brewing methods.',
    specifications: {
      'Brand': 'CoffeeTech',
      'Type': 'Burr Grinder',
      'Grind Settings': '40',
      'Capacity': '350g',
      'Motor': '150W',
      'Material': 'Stainless Steel'
    },
    rating: 4.8,
    inStock: true,
    stockQuantity: 12,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'eq-14',
    name: 'Insulated Travel Mug',
    category: 'equipment',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBtdWclMjB0cmF2ZWx8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Double-wall insulated mug keeps coffee hot for hours. Perfect for commuting and long workdays.',
    specifications: {
      'Material': 'Stainless Steel',
      'Capacity': '450ml',
      'Insulation': 'Double-wall vacuum',
      'Features': 'Leak-proof lid, Non-slip base'
    },
    rating: 4.6,
    inStock: true,
    stockQuantity: 35,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

// Initialize all data
export async function initializeData() {
  try {
    console.log('Initializing Bean Boutique data...');

    // Store coffee products
    for (const product of coffeeProducts) {
      await kv.set(`product:${product.id}`, product);
    }
    console.log(`Stored ${coffeeProducts.length} coffee products`);

    // Store equipment products
    for (const product of equipmentProducts) {
      await kv.set(`product:${product.id}`, product);
    }
    console.log(`Stored ${equipmentProducts.length} equipment products`);

    // Store subscription products
    for (const product of subscriptionProducts) {
      await kv.set(`product:${product.id}`, product);
    }
    console.log(`Stored ${subscriptionProducts.length} subscription products`);

    // Store offer products
    for (const product of offerProducts) {
      await kv.set(`product:${product.id}`, product);
    }
    console.log(`Stored ${offerProducts.length} offer products`);

    // Store static data products (legacy IDs)
    for (const product of staticDataProducts) {
      await kv.set(`product:${product.id}`, product);
    }
    console.log(`Stored ${staticDataProducts.length} static data products`);

    // Store events
    for (const event of events) {
      await kv.set(`event:${event.id}`, event);
    }
    console.log(`Stored ${events.length} events`);

    console.log('Data initialization completed successfully!');
    return { success: true, message: 'Data initialized successfully' };
  } catch (error) {
    console.error('Data initialization error:', error);
    return { success: false, error: error.message };
  }
}