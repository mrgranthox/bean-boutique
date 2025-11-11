export interface Event {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  instructor: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  image: string;
  featured?: boolean;
  popular?: boolean;
  rating?: number;
  materials?: string[];
  prerequisites?: string[];
}

export const events: Event[] = [
  //   {
  //     id: 'event-1',
  //     title: 'Introduction to Pour Over Brewing',
  //     description: 'Learn the fundamentals of pour over coffee brewing with our expert baristas',
  //     longDescription: 'Join us for a comprehensive introduction to pour over brewing methods. You\'ll learn about grind size, water temperature, pouring techniques, and timing to create the perfect cup. This hands-on workshop includes tastings of different brewing methods.',
  //     date: '2024-02-15',
  //     time: '10:00 AM',
  //     duration: '2 hours',
  //     location: 'Bean Boutique Main Store',
  //     instructor: 'Sarah Williams',
  //     price: 45.00,
  //     maxParticipants: 12,
  //     currentParticipants: 8,
  //     difficulty: 'Beginner',
  //     category: 'Brewing Workshop',
  //     image: "https://images.unsplash.com/photo-1621744895572-da8dde3c425a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwcG91ciUyMG92ZXJ8ZW58MXx8fHwxNzU1Nzk2NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     featured: true,
  //     rating: 4.9,
  //     materials: ['V60 dripper', 'Filters', 'Coffee samples', 'Tasting notes'],
  //     prerequisites: ['None - perfect for beginners!']
  //   },
  //   {
  //     id: 'event-2',
  //     title: 'Latte Art Masterclass',
  //     description: 'Master the art of creating beautiful designs in your milk-based drinks',
  //     longDescription: 'Elevate your coffee skills with this intensive latte art workshop. Learn milk steaming techniques, pouring methods, and create stunning designs like hearts, rosettas, and swans. Practice with our professional equipment and take home your newfound skills.',
  //     date: '2024-02-18',
  //     time: '2:00 PM',
  //     duration: '3 hours',
  //     location: 'Bean Boutique Training Lab',
  //     instructor: 'Marco Rodriguez',
  //     price: 65.00,
  //     maxParticipants: 8,
  //     currentParticipants: 6,
  //     difficulty: 'Intermediate',
  //     category: 'Barista Skills',
  //     image: "https://images.unsplash.com/photo-1508264282391-44e39cc4b4c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydCUyMGNvZmZlZXxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     popular: true,
  //     rating: 4.8,
  //     materials: ['Espresso machine access', 'Milk', 'Practice cups', 'Technique guide'],
  //     prerequisites: ['Basic espresso knowledge helpful']
  //   },
  //   {
  //     id: 'event-3',
  //     title: 'Coffee Cupping Session',
  //     description: 'Professional coffee tasting to develop your palate and understanding',
  //     longDescription: 'Experience coffee like a professional with our guided cupping session. Learn to identify flavor notes, assess coffee quality, and understand how origin, processing, and roasting affect taste. Sample 6 different single-origin coffees from around the world.',
  //     date: '2024-02-20',
  //     time: '6:00 PM',
  //     duration: '1.5 hours',
  //     location: 'Bean Boutique Cupping Room',
  //     instructor: 'Dr. Coffee Johnson',
  //     price: 35.00,
  //     maxParticipants: 15,
  //     currentParticipants: 12,
  //     difficulty: 'Beginner',
  //     category: 'Tasting',
  //     image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXBwaW5nJTIwc2V0fGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     featured: true,
  //     rating: 4.7,
  //     materials: ['Cupping spoons', '6 coffee samples', 'Tasting wheel', 'Score sheets']
  //   },
  //   {
  //     id: 'event-4',
  //     title: 'Espresso Fundamentals',
  //     description: 'Learn to pull perfect espresso shots like a professional barista',
  //     longDescription: 'Master the art of espresso with this comprehensive workshop. Learn about grind calibration, dose, distribution, tamping, and extraction timing. Practice on professional equipment and understand how to troubleshoot common espresso problems.',
  //     date: '2024-02-22',
  //     time: '11:00 AM',
  //     duration: '2.5 hours',
  //     location: 'Bean Boutique Training Lab',
  //     instructor: 'Emma Thompson',
  //     price: 55.00,
  //     maxParticipants: 10,
  //     currentParticipants: 4,
  //     difficulty: 'Intermediate',
  //     category: 'Barista Skills',
  //     image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhlc3ByZXNzbyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     rating: 4.9,
  //     materials: ['Espresso machine', 'Grinder', 'Scales', 'Practice beans'],
  //     prerequisites: ['Basic coffee knowledge']
  //   },
  //   {
  //     id: 'event-5',
  //     title: 'Cold Brew Workshop',
  //     description: 'Discover the secrets of making smooth, refreshing cold brew coffee',
  //     longDescription: 'Perfect for summer or year-round enjoyment, learn multiple cold brew methods including immersion and slow-drip techniques. Understand grind ratios, steeping times, and flavor extraction. Take home cold brew concentrate and brewing equipment.',
  //     date: '2024-02-25',
  //     time: '1:00 PM',
  //     duration: '2 hours',
  //     location: 'Bean Boutique Main Store',
  //     instructor: 'Alex Martinez',
  //     price: 40.00,
  //     maxParticipants: 14,
  //     currentParticipants: 9,
  //     difficulty: 'Beginner',
  //     category: 'Brewing Workshop',
  //     image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwYnJldyUyMG1ha2VyfGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     rating: 4.6,
  //     materials: ['Cold brew maker', 'Coffee samples', 'Filters', 'Recipe cards']
  //   },
  //   {
  //     id: 'event-6',
  //     title: 'Coffee Origin Exploration: Ethiopia',
  //     description: 'Journey through Ethiopian coffee regions and taste unique flavor profiles',
  //     longDescription: 'Explore the birthplace of coffee with this educational tasting session. Learn about Ethiopian coffee history, growing regions like Yirgacheffe and Sidamo, and processing methods. Taste 4 distinct Ethiopian coffees while learning about their unique characteristics.',
  //     date: '2024-02-28',
  //     time: '7:00 PM',
  //     duration: '1.5 hours',
  //     location: 'Bean Boutique Cupping Room',
  //     instructor: 'Dr. Coffee Johnson',
  //     price: 38.00,
  //     maxParticipants: 16,
  //     currentParticipants: 11,
  //     difficulty: 'Beginner',
  //     category: 'Education',
  //     image: "https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     rating: 4.8,
  //     materials: ['4 Ethiopian coffee samples', 'Cupping materials', 'Origin map', 'Tasting guide']
  //   },
  //   {
  //     id: 'event-7',
  //     title: 'Home Barista Bootcamp',
  //     description: 'Complete training program for aspiring home baristas',
  //     longDescription: 'A comprehensive 4-hour intensive covering everything from bean selection to advanced brewing techniques. Perfect for those wanting to master coffee at home. Includes hands-on practice with multiple brewing methods and equipment.',
  //     date: '2024-03-02',
  //     time: '9:00 AM',
  //     duration: '4 hours',
  //     location: 'Bean Boutique Training Lab',
  //     instructor: 'Sarah Williams & Marco Rodriguez',
  //     price: 95.00,
  //     maxParticipants: 6,
  //     currentParticipants: 3,
  //     difficulty: 'Intermediate',
  //     category: 'Intensive Course',
  //     image: "https://images.unsplash.com/photo-1621744895572-da8dde3c425a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwcG91ciUyMG92ZXJ8ZW58MXx8fHwxNzU1Nzk2NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     rating: 4.9,
  //     materials: ['Multiple brewing devices', 'Take-home kit', 'Recipe book', 'Certificate'],
  //     prerequisites: ['Basic coffee knowledge recommended']
  //   },
  //   {
  //     id: 'event-8',
  //     title: 'French Press Mastery',
  //     description: 'Perfect your French press technique for rich, full-bodied coffee',
  //     longDescription: 'Learn the secrets of French press brewing including grind size, steeping time, and plunging technique. Compare different coffee origins and roast levels to understand how they affect the final cup.',
  //     date: '2024-03-05',
  //     time: '3:00 PM',
  //     duration: '1.5 hours',
  //     location: 'Bean Boutique Main Store',
  //     instructor: 'Alex Martinez',
  //     price: 30.00,
  //     maxParticipants: 12,
  //     currentParticipants: 7,
  //     difficulty: 'Beginner',
  //     category: 'Brewing Workshop',
  //     image: "https://images.unsplash.com/photo-1611564178817-e3c6ac33bf71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBmcmVuY2glMjBwcmVzc3xlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     rating: 4.5,
  //     materials: ['French press', 'Coffee samples', 'Timer', 'Tasting guide']
  //   },
  //   {
  //     id: 'event-9',
  //     title: 'Coffee & Chocolate Pairing',
  //     description: 'Discover perfect combinations of coffee and artisan chocolate',
  //     longDescription: 'Explore how different coffee origins and chocolate types complement each other. Learn about flavor profiles, tasting techniques, and create your own perfect pairings. Features premium single-origin chocolates and coffees.',
  //     date: '2024-03-08',
  //     time: '6:30 PM',
  //     duration: '2 hours',
  //     location: 'Bean Boutique Cupping Room',
  //     instructor: 'Dr. Coffee Johnson',
  //     price: 50.00,
  //     maxParticipants: 14,
  //     currentParticipants: 10,
  //     difficulty: 'Beginner',
  //     category: 'Tasting',
  //     image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXBwaW5nJTIwc2V0fGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     popular: true,
  //     rating: 4.7,
  //     materials: ['5 coffee samples', '5 chocolate varieties', 'Pairing guide', 'Tasting notes']
  //   },
  //   {
  //     id: 'event-10',
  //     title: 'Advanced Espresso Techniques',
  //     description: 'Master advanced espresso skills including pressure profiling and timing',
  //     longDescription: 'Take your espresso skills to the next level with advanced techniques used by competition baristas. Learn pressure profiling, advanced milk texturing, and troubleshooting complex extraction issues.',
  //     date: '2024-03-12',
  //     time: '10:00 AM',
  //     duration: '3 hours',
  //     location: 'Bean Boutique Training Lab',
  //     instructor: 'Marco Rodriguez',
  //     price: 75.00,
  //     maxParticipants: 6,
  //     currentParticipants: 2,
  //     difficulty: 'Advanced',
  //     category: 'Barista Skills',
  //     image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhlc3ByZXNzbyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     rating: 4.9,
  //     materials: ['Professional equipment', 'Competition beans', 'Pressure tools', 'Advanced guides'],
  //     prerequisites: ['Espresso Fundamentals or equivalent experience']
  //   },
  //   {
  //     id: 'event-11',
  //     title: 'Coffee Business Workshop',
  //     description: 'Learn the business side of coffee - from cafe to roastery',
  //     longDescription: 'Comprehensive workshop covering coffee business fundamentals including sourcing, roasting, cafe operations, and marketing. Perfect for aspiring coffee entrepreneurs and existing business owners.',
  //     date: '2024-03-15',
  //     time: '1:00 PM',
  //     duration: '3 hours',
  //     location: 'Bean Boutique Main Store',
  //     instructor: 'Bean Boutique Owners',
  //     price: 60.00,
  //     maxParticipants: 20,
  //     currentParticipants: 15,
  //     difficulty: 'Beginner',
  //     category: 'Business',
  //     image: "https://images.unsplash.com/photo-1646681828239-843f5ed340de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzU1NzYzMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     rating: 4.6,
  //     materials: ['Business plan template', 'Cost calculators', 'Supplier contacts', 'Marketing guide']
  //   },
  //   {
  //     id: 'event-12',
  //     title: 'Weekend Roasting Workshop',
  //     description: 'Learn coffee roasting from green bean to perfect cup',
  //     longDescription: 'Two-day intensive roasting workshop covering green bean selection, roasting profiles, cupping your roasts, and equipment setup. Take home freshly roasted beans and roasting knowledge.',
  //     date: '2024-03-18',
  //     time: '10:00 AM',
  //     duration: '2 days',
  //     location: 'Bean Boutique Roastery',
  //     instructor: 'Head Roaster Team',
  //     price: 150.00,
  //     maxParticipants: 8,
  //     currentParticipants: 5,
  //     difficulty: 'Intermediate',
  //     category: 'Roasting',
  //     image: "https://images.unsplash.com/photo-1523031342620-fa6c0d48c6ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjByb2FzdGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     featured: true,
  //     rating: 4.8,
  //     materials: ['Green beans', 'Roasting equipment', 'Take-home beans', 'Roasting log'],
  //     prerequisites: ['Advanced coffee knowledge recommended']
  //   }
];

export const categories = [
  "All",
  ...Array.from(new Set(events.map((e) => e.category))),
];
export const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
export const dateRanges = [
  "All",
  "This Week",
  "This Month",
  "Next Month",
  "Later",
];
