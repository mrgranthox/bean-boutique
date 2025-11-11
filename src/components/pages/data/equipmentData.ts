export interface Equipment {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
  bestseller?: boolean;
  new?: boolean;
  specifications: string[];
  dimensions?: string;
  weight?: string;
  warranty?: string;
  material?: string;
  capacity?: string;
  powerRequirement?: string;
  tags?: string[];
}

export const equipment: Equipment[] = [
  //   {
  //     id: 'eq-1',
  //     name: 'Precision Burr Grinder',
  //     price: 349.99,
  //     image: "https://images.unsplash.com/photo-1573066380308-24ff4c273dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBncmluZGVyJTIwbWFudWFsfGVufDF8fHx8MTc1NTg2ODgzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Professional-grade burr grinder for consistent grind size and optimal extraction. Features precision grinding for all brewing methods.',
  //     category: 'Grinders',
  //     brand: 'Bean Boutique Pro',
  //     rating: 4.8,
  //     reviewCount: 324,
  //     inStock: true,
  //     featured: true,
  //     bestseller: true,
  //     specifications: ['40mm ceramic burrs', '18 grind settings', '250g hopper capacity', '2-year warranty'],
  //     dimensions: '12" x 8" x 16"',
  //     weight: '15 lbs',
  //     warranty: '2 years',
  //     material: 'Stainless steel and ceramic',
  //     powerRequirement: '110V, 150W',
  //     tags: ['professional', 'consistent', 'durable']
  //   },
  //   {
  //     id: 'eq-2',
  //     name: 'Pour Over Dripper Set',
  //     price: 79.99,
  //     image: "https://images.unsplash.com/photo-1621744895572-da8dde3c425a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwcG91ciUyMG92ZXJ8ZW58MXx8fHwxNzU1Nzk2NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Complete pour over set including V60 dripper, filters, and glass carafe. Perfect for brewing single-origin coffees.',
  //     category: 'Brewing Equipment',
  //     brand: 'Hario',
  //     rating: 4.7,
  //     reviewCount: 256,
  //     inStock: true,
  //     featured: true,
  //     specifications: ['Ceramic dripper', 'Glass carafe 600ml', 'Includes 40 filters', 'Easy to clean'],
  //     dimensions: '6" x 6" x 8"',
  //     weight: '1.5 lbs',
  //     warranty: '1 year',
  //     material: 'Ceramic and borosilicate glass',
  //     capacity: '600ml',
  //     tags: ['manual', 'clean', 'precision']
  //   },
  //   {
  //     id: 'eq-3',
  //     name: 'French Press Classic',
  //     price: 45.99,
  //     image: "https://images.unsplash.com/photo-1611564178817-e3c6ac33bf71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBmcmVuY2glMjBwcmVzc3xlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Traditional French press with borosilicate glass and stainless steel frame. Delivers full-bodied, rich coffee.',
  //     category: 'Brewing Equipment',
  //     brand: 'Bodum',
  //     rating: 4.5,
  //     reviewCount: 189,
  //     inStock: true,
  //     specifications: ['Borosilicate glass', '1000ml capacity', 'Stainless steel frame', 'Dishwasher safe'],
  //     dimensions: '5" x 5" x 9"',
  //     weight: '2 lbs',
  //     warranty: '2 years',
  //     material: 'Borosilicate glass and stainless steel',
  //     capacity: '1000ml',
  //     tags: ['traditional', 'full-bodied', 'easy']
  //   },
  //   {
  //     id: 'eq-4',
  //     name: 'Espresso Machine Deluxe',
  //     price: 899.99,
  //     salePrice: 749.99,
  //     image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhlc3ByZXNzbyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Semi-automatic espresso machine with built-in grinder and milk frother. Professional-grade performance for home baristas.',
  //     category: 'Espresso Machines',
  //     brand: 'Breville',
  //     rating: 4.9,
  //     reviewCount: 412,
  //     inStock: true,
  //     featured: true,
  //     specifications: ['15 bar pump pressure', '54mm portafilter', 'Built-in grinder', 'Steam wand'],
  //     dimensions: '14" x 16" x 16"',
  //     weight: '35 lbs',
  //     warranty: '2 years',
  //     material: 'Stainless steel',
  //     powerRequirement: '110V, 1600W',
  //     tags: ['professional', 'automatic', 'premium']
  //   },
  //   {
  //     id: 'eq-5',
  //     name: 'Digital Scale with Timer',
  //     price: 34.99,
  //     image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzY2FsZSUyMGRpZ2l0YWx8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Precision coffee scale with built-in timer for perfect brewing ratios. Essential tool for consistent coffee brewing.',
  //     category: 'Scales & Timers',
  //     brand: 'Bean Boutique Pro',
  //     rating: 4.6,
  //     reviewCount: 198,
  //     inStock: true,
  //     bestseller: true,
  //     specifications: ['0.1g precision', 'Built-in timer', '2kg capacity', 'Rechargeable battery'],
  //     dimensions: '8" x 6" x 1"',
  //     weight: '2.5 lbs',
  //     warranty: '1 year',
  //     material: 'Tempered glass and ABS plastic',
  //     tags: ['precision', 'timer', 'rechargeable']
  //   },
  //   {
  //     id: 'eq-6',
  //     name: 'Aeropress Complete Kit',
  //     price: 59.99,
  //     image: "https://images.unsplash.com/photo-1587734195503-904fca47e0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJvcHJlc3MlMjBjb2ZmZWV8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Innovative brewing device that combines immersion and pressure brewing. Perfect for travel and quick, clean brewing.',
  //     category: 'Brewing Equipment',
  //     brand: 'AeroPress',
  //     rating: 4.8,
  //     reviewCount: 345,
  //     inStock: true,
  //     specifications: ['Includes 350 filters', 'Travel-friendly', 'Fast brewing', 'Easy cleanup'],
  //     dimensions: '4" x 4" x 10"',
  //     weight: '0.7 lbs',
  //     warranty: '1 year',
  //     material: 'BPA-free polypropylene',
  //     tags: ['portable', 'fast', 'innovative']
  //   },
  //   {
  //     id: 'eq-7',
  //     name: 'Gooseneck Kettle Electric',
  //     price: 89.99,
  //     image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXR0bGUlMjBnb29zZW5lY2t8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Precision pour kettle with temperature control for optimal brewing. Perfect for pour over and other manual brewing methods.',
  //     category: 'Kettles',
  //     brand: 'Fellow',
  //     rating: 4.7,
  //     reviewCount: 278,
  //     inStock: true,
  //     specifications: ['Temperature control 140-212°F', '1L capacity', 'Hold function', 'Quick heating'],
  //     dimensions: '11" x 7" x 8"',
  //     weight: '3 lbs',
  //     warranty: '1 year',
  //     material: 'Stainless steel',
  //     capacity: '1L',
  //     powerRequirement: '110V, 1200W',
  //     tags: ['precision', 'temperature-control', 'pour-over']
  //   },
  //   {
  //     id: 'eq-8',
  //     name: 'Cold Brew Maker',
  //     price: 49.99,
  //     image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwYnJldyUyMG1ha2VyfGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Slow-drip cold brew maker for smooth, concentrated coffee. Perfect for making cold brew at home with professional results.',
  //     category: 'Cold Brew',
  //     brand: 'OXO',
  //     rating: 4.4,
  //     reviewCount: 167,
  //     inStock: true,
  //     specifications: ['32oz capacity', 'Slow-drip system', 'Glass carafe', 'Adjustable drip rate'],
  //     dimensions: '5" x 5" x 17"',
  //     weight: '2.5 lbs',
  //     warranty: '1 year',
  //     material: 'Borosilicate glass and BPA-free plastic',
  //     capacity: '32oz',
  //     tags: ['cold-brew', 'slow-drip', 'concentrated']
  //   },
  //   {
  //     id: 'eq-9',
  //     name: 'Milk Frother Handheld',
  //     price: 19.99,
  //     image: "https://images.unsplash.com/photo-1610889556528-6ea3e1031e6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwZnJvdGhlciUyMGhhbmRoZWxkfGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Battery-powered milk frother for perfect cappuccinos and lattes. Compact and easy to use for home coffee drinks.',
  //     category: 'Accessories',
  //     brand: 'Bean Boutique Pro',
  //     rating: 4.3,
  //     reviewCount: 156,
  //     inStock: true,
  //     specifications: ['Battery powered', 'Stainless steel whisk', 'Easy to clean', 'Compact design'],
  //     dimensions: '1" x 1" x 8"',
  //     weight: '0.3 lbs',
  //     warranty: '1 year',
  //     material: 'Stainless steel and ABS plastic',
  //     tags: ['portable', 'battery', 'frothing']
  //   },
  //   {
  //     id: 'eq-10',
  //     name: 'Coffee Storage Canister',
  //     price: 24.99,
  //     image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzdG9yYWdlJTIwY2FuaXN0ZXJ8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Airtight storage canister to keep your coffee beans fresh. Features innovative valve system to remove oxygen.',
  //     category: 'Storage',
  //     brand: 'Airscape',
  //     rating: 4.5,
  //     reviewCount: 234,
  //     inStock: true,
  //     specifications: ['Airtight seal', '1lb capacity', 'Stainless steel', 'UV protection'],
  //     dimensions: '4" x 4" x 7"',
  //     weight: '1.2 lbs',
  //     warranty: '5 years',
  //     material: 'Food-grade stainless steel',
  //     capacity: '1lb beans',
  //     tags: ['storage', 'airtight', 'freshness']
  //   },
  //   {
  //     id: 'eq-11',
  //     name: 'Professional Tamper',
  //     price: 64.99,
  //     image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW1wZXIlMjBlc3ByZXNzb3xlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Precision tamper for consistent espresso extraction. Professional-grade tool for serious home baristas.',
  //     category: 'Espresso Tools',
  //     brand: 'Reg Barber',
  //     rating: 4.9,
  //     reviewCount: 187,
  //     inStock: true,
  //     specifications: ['58mm diameter', 'Stainless steel base', 'Ergonomic handle', 'Professional grade'],
  //     dimensions: '2.3" x 2.3" x 4"',
  //     weight: '1.5 lbs',
  //     warranty: 'Lifetime',
  //     material: 'Stainless steel and hardwood',
  //     tags: ['professional', 'precision', 'espresso']
  //   },
  //   {
  //     id: 'eq-12',
  //     name: 'Portable Espresso Maker',
  //     price: 129.99,
  //     image: "https://images.unsplash.com/photo-1587734195503-904fca47e0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJvcHJlc3MlMjBjb2ZmZWV8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Manual espresso maker perfect for travel and camping. No electricity needed, just hot water and ground coffee.',
  //     category: 'Portable',
  //     brand: 'Wacaco',
  //     rating: 4.6,
  //     reviewCount: 298,
  //     inStock: true,
  //     new: true,
  //     specifications: ['Manual operation', 'Compact design', 'No electricity needed', 'Easy to use'],
  //     dimensions: '2" x 2" x 8"',
  //     weight: '1 lb',
  //     warranty: '2 years',
  //     material: 'BPA-free plastic and stainless steel',
  //     tags: ['portable', 'manual', 'travel']
  //   },
  //   {
  //     id: 'eq-13',
  //     name: 'Coffee Cupping Set',
  //     price: 89.99,
  //     image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXBwaW5nJTIwc2V0fGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Professional cupping set for tasting and evaluating coffee. Everything needed for proper coffee cupping sessions.',
  //     category: 'Tasting',
  //     brand: 'Bean Boutique Pro',
  //     rating: 4.7,
  //     reviewCount: 156,
  //     inStock: true,
  //     specifications: ['6 cupping bowls', 'Cupping spoons', 'Tasting wheel', 'Score sheets'],
  //     dimensions: '12" x 8" x 4"',
  //     weight: '3 lbs',
  //     warranty: '2 years',
  //     material: 'Ceramic and stainless steel',
  //     tags: ['professional', 'tasting', 'cupping']
  //   },
  //   {
  //     id: 'eq-14',
  //     name: 'Insulated Travel Mug',
  //     price: 24.99,
  //     image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtdWclMjB0cmF2ZWx8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Double-wall insulated mug keeps coffee hot for hours. Perfect for commuting and long workdays.',
  //     category: 'Drinkware',
  //     brand: 'Yeti',
  //     rating: 4.8,
  //     reviewCount: 423,
  //     inStock: true,
  //     bestseller: true,
  //     specifications: ['20oz capacity', '6+ hour heat retention', 'Leak-proof lid', 'Dishwasher safe'],
  //     dimensions: '3.5" x 3.5" x 8"',
  //     weight: '1.2 lbs',
  //     warranty: '5 years',
  //     material: 'Stainless steel',
  //     capacity: '20oz',
  //     tags: ['insulated', 'travel', 'leak-proof']
  //   },
  //   {
  //     id: 'eq-15',
  //     name: 'Siphon Coffee Maker',
  //     price: 179.99,
  //     image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaXBob24lMjBjb2ZmZWUlMjBtYWtlcnxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Theatrical vacuum coffee maker for unique brewing experience. Creates clean, complex coffee with visual drama.',
  //     category: 'Specialty Brewing',
  //     brand: 'Hario',
  //     rating: 4.6,
  //     reviewCount: 89,
  //     inStock: false,
  //     specifications: ['5-cup capacity', 'Borosilicate glass', 'Alcohol burner included', 'Filter papers included'],
  //     dimensions: '8" x 8" x 15"',
  //     weight: '4 lbs',
  //     warranty: '1 year',
  //     material: 'Borosilicate glass and metal',
  //     capacity: '5 cups',
  //     tags: ['theatrical', 'vacuum', 'specialty']
  //   },
  //   // Additional equipment to expand the catalog
  //   {
  //     id: 'eq-16',
  //     name: 'Ceramic Pour Over V60',
  //     price: 32.99,
  //     image: "https://images.unsplash.com/photo-1621744895572-da8dde3c425a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwcG91ciUyMG92ZXJ8ZW58MXx8fHwxNzU1Nzk2NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Classic V60 ceramic dripper for precise pour over brewing. The gold standard for manual coffee brewing.',
  //     category: 'Brewing Equipment',
  //     brand: 'Hario',
  //     rating: 4.6,
  //     reviewCount: 312,
  //     inStock: true,
  //     specifications: ['Size 02', 'Ceramic construction', 'Spiral ribs', 'Heat retention'],
  //     dimensions: '4.6" x 4.6" x 3.8"',
  //     weight: '0.8 lbs',
  //     warranty: '1 year',
  //     material: 'Ceramic',
  //     tags: ['classic', 'ceramic', 'precision']
  //   },
  //   {
  //     id: 'eq-17',
  //     name: 'Espresso Cleaning Kit',
  //     price: 39.99,
  //     image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW1wZXIlMjBlc3ByZXNzb3xlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Complete cleaning kit for espresso machines. Keep your machine running perfectly with regular maintenance.',
  //     category: 'Maintenance',
  //     brand: 'Urnex',
  //     rating: 4.4,
  //     reviewCount: 145,
  //     inStock: true,
  //     specifications: ['Descaling solution', 'Cleaning tablets', 'Group head brush', 'Microfiber cloths'],
  //     dimensions: '8" x 6" x 3"',
  //     weight: '2 lbs',
  //     warranty: 'N/A',
  //     material: 'Various cleaning supplies',
  //     tags: ['maintenance', 'cleaning', 'care']
  //   },
  //   {
  //     id: 'eq-18',
  //     name: 'Wooden Coffee Scoop',
  //     price: 12.99,
  //     image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzdG9yYWdlJTIwY2FuaXN0ZXJ8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     description: 'Handcrafted wooden coffee scoop for measuring coffee beans. Beautiful and functional kitchen accessory.',
  //     category: 'Accessories',
  //     brand: 'Bean Boutique Pro',
  //     rating: 4.2,
  //     reviewCount: 78,
  //     inStock: true,
  //     specifications: ['1 tablespoon capacity', 'Handcrafted wood', 'Food-safe finish', 'Ergonomic handle'],
  //     dimensions: '6" x 1" x 1"',
  //     weight: '0.2 lbs',
  //     warranty: '1 year',
  //     material: 'Hardwood',
  //     tags: ['handcrafted', 'natural', 'measuring']
  //   }
];

// Helper functions for equipment data

export const getEquipmentById = (id: string): Equipment | undefined => {
  return equipment.find((e) => e.id === id);
};

export const getEquipmentByCategory = (category: string): Equipment[] => {
  return equipment.filter((e) => e.category === category);
};

export const getFeaturedEquipment = (): Equipment[] => {
  return equipment.filter((e) => e.featured);
};

export const getBestSellerEquipment = (): Equipment[] => {
  return equipment.filter((e) => e.bestseller);
};

export const getNewEquipment = (): Equipment[] => {
  return equipment.filter((e) => e.new);
};

export const getEquipmentOnSale = (): Equipment[] => {
  return equipment.filter((e) => e.salePrice);
};

export const getEquipmentCategories = (): string[] => {
  return Array.from(new Set(equipment.map((e) => e.category))).sort();
};

export const getEquipmentBrands = (): string[] => {
  return Array.from(new Set(equipment.map((e) => e.brand))).sort();
};
