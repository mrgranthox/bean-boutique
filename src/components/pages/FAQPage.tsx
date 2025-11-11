import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Search, HelpCircle, Coffee, Wrench, Truck, CreditCard, RotateCcw, Shield, MessageCircle } from 'lucide-react';
import { Pagination } from '../ui/pagination-custom';
import type { Page } from '../../App';

interface FAQPageProps {
  onPageChange: (page: Page) => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
}

const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is the difference between light, medium, and dark roast coffee?',
    answer: 'Light roast coffee is roasted for the shortest time and has the highest acidity, with bright, floral, and fruity notes. The beans retain most of their original flavors from the growing region. Medium roast offers a balance between acidity and body, with caramelized sugars creating a sweeter taste while maintaining some origin characteristics. Dark roast coffee is roasted the longest, resulting in a bold, smoky flavor with low acidity and a heavier body. The roasting process flavors dominate over the origin characteristics.',
    category: 'Coffee Basics',
    tags: ['roast', 'coffee', 'flavor', 'brewing'],
    helpful: 89
  },
  {
    id: 'faq-2',
    question: 'How should I store my coffee beans?',
    answer: 'Store your coffee beans in an airtight container in a cool, dry place away from direct sunlight. Avoid storing coffee in the refrigerator or freezer as moisture can damage the beans. Use your coffee within 2-4 weeks of the roast date for optimal freshness. If you buy coffee in large quantities, portion it into smaller airtight containers to minimize air exposure. Never store coffee near strong odors as coffee beans can absorb surrounding smells.',
    category: 'Coffee Care',
    tags: ['storage', 'freshness', 'beans', 'airtight'],
    helpful: 76
  },
  {
    id: 'faq-3',
    question: 'What grind size should I use for different brewing methods?',
    answer: 'Grind size significantly affects extraction and flavor:\n\n• Extra coarse: Cold brew\n• Coarse: French press, percolator\n• Medium-coarse: Chemex, Clever dripper\n• Medium: Drip coffee makers, pour-over (V60)\n• Medium-fine: Aeropress, siphon\n• Fine: Espresso, Moka pot\n• Extra fine: Turkish coffee\n\nThe general rule is: the longer the brewing time, the coarser the grind. Shorter brewing times require finer grinds for proper extraction.',
    category: 'Brewing',
    tags: ['grind', 'brewing', 'extraction', 'method'],
    helpful: 103
  },
  {
    id: 'faq-4',
    question: 'How do I clean my coffee grinder?',
    answer: 'Regular cleaning is essential for maintaining your grinder:\n\n1. Daily: Empty the hopper and wipe exterior with a damp cloth\n2. Weekly: Remove and wash the hopper and grounds container with warm soapy water\n3. Monthly: Use grinder cleaning tablets or rice to clean the burrs. Run the cleaner through, then run coffee beans to remove any residue\n4. Deep clean: Every 3-6 months, disassemble according to manufacturer instructions and clean all components\n\nNever use water directly on the grinding mechanism unless specified by the manufacturer.',
    category: 'Equipment Care',
    tags: ['grinder', 'cleaning', 'maintenance', 'burrs'],
    helpful: 67
  },
  {
    id: 'faq-5',
    question: 'What is the ideal coffee-to-water ratio?',
    answer: 'The golden ratio for coffee brewing is 1:15 to 1:17 (coffee to water). This means:\n\n• 1 gram of coffee to 15-17 grams of water\n• Approximately 1-2 tablespoons of coffee per 6 oz of water\n• For a standard 8-cup pot: 4-6 tablespoons of coffee\n\nStart with 1:16 and adjust to taste. Use more coffee (1:15) for stronger brew, less (1:17) for milder. Always measure by weight for consistency, as coffee bean density varies.',
    category: 'Brewing',
    tags: ['ratio', 'brewing', 'measurement', 'strength'],
    helpful: 92
  },
  {
    id: 'faq-6',
    question: 'Do you offer free shipping?',
    answer: 'Yes! We offer free standard shipping on all orders over $50 within the continental United States. Orders under $50 have a flat shipping rate of $5.99. We also offer expedited shipping options:\n\n• Express (2-3 business days): $12.99\n• Overnight (1 business day): $24.99\n\nInternational shipping is available with rates calculated at checkout based on destination and weight.',
    category: 'Shipping',
    tags: ['shipping', 'free', 'delivery', 'international'],
    helpful: 54
  },
  {
    id: 'faq-7',
    question: 'What payment method do you accept?',
    answer: 'We accept all major payment methods:\n\n• Credit cards: Visa, Mastercard, American Express, Discover\n• Digital wallets: PayPal, Apple Pay, Google Pay\n• Buy now, pay later: Klarna, Afterpay\n• Gift cards and store credit\n\nAll transactions are processed securely using SSL encryption. We do not store your payment information on our servers.',
    category: 'Payment',
    tags: ['payment', 'credit card', 'paypal', 'security'],
    helpful: 43
  },
  {
    id: 'faq-8',
    question: 'What is your return policy?',
    answer: 'We want you to be completely satisfied with your purchase. Our return policy includes:\n\n• 30-day return window from delivery date\n• Items must be unused and in original packaging\n• Coffee returns accepted only if damaged or defective\n• Free return shipping for defective items\n• Return processing takes 5-7 business days\n• Refunds issued to original payment method\n\nTo initiate a return, contact our customer service team or use our online return portal.',
    category: 'Returns',
    tags: ['return', 'refund', 'policy', 'satisfaction'],
    helpful: 38
  },
  {
    id: 'faq-9',
    question: 'How often do you roast your coffee?',
    answer: 'We roast our coffee in small batches throughout the week to ensure maximum freshness. Most of our coffee is roasted within 48 hours of shipping. Each bag includes a roast date so you know exactly when your coffee was roasted. We recommend using coffee within 2-4 weeks of the roast date for optimal flavor, though it remains good for up to 6 weeks when stored properly.',
    category: 'Coffee Quality',
    tags: ['roasting', 'freshness', 'quality', 'roast date'],
    helpful: 71
  },
  {
    id: 'faq-10',
    question: 'Can I cancel or modify my subscription?',
    answer: 'Absolutely! You have full control over your subscription:\n\n• Skip deliveries anytime before the next shipment\n• Change frequency (weekly, bi-weekly, monthly)\n• Modify coffee selections\n• Update quantity or grind preferences\n• Pause subscription for up to 3 months\n• Cancel anytime with no fees\n\nChanges must be made at least 2 days before your next scheduled delivery. Access your subscription management portal through your account dashboard.',
    category: 'Subscriptions',
    tags: ['subscription', 'cancel', 'modify', 'delivery'],
    helpful: 62
  },
  {
    id: 'faq-11',
    question: 'Do you source your coffee ethically?',
    answer: 'Yes, ethical sourcing is core to our mission. We:\n\n• Work directly with coffee farmers when possible\n• Pay above fair trade prices\n• Support sustainable farming practices\n• Invest in coffee farming communities\n• Provide transparency about our supply chain\n• Partner with certified organic and fair trade cooperatives\n\nWe believe great coffee starts with supporting the people who grow it. Each coffee includes information about its origin and the farmers who produced it.',
    category: 'Sourcing',
    tags: ['ethical', 'fair trade', 'sustainable', 'farmers'],
    helpful: 85
  },
  {
    id: 'faq-12',
    question: 'How do I troubleshoot my espresso machine?',
    answer: 'Common espresso machine issues and solutions:\n\n• Weak espresso: Try a finer grind, increase dose, or check water temperature\n• Sour taste: Use finer grind or increase extraction time\n• Bitter taste: Use coarser grind or decrease dose\n• No crema: Ensure fresh beans (within 2 weeks), proper grind, and adequate dose\n• Machine not heating: Check power, water level, and descaling schedule\n• Poor steam: Regular cleaning of steam wand and descaling\n\nFor persistent issues, consult your machine manual or contact our technical support team.',
    category: 'Equipment Troubleshooting',
    tags: ['espresso', 'troubleshooting', 'machine', 'brewing'],
    helpful: 56
  }
];

const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))];

export function FAQPage({ onPageChange }: FAQPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const itemsPerPage = 8;

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFAQs = filteredFAQs.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    
    // Auto-expand all items when searching
    if (value.trim()) {
      const matchingIds = filteredFAQs.map(faq => faq.id);
      setExpandedItems(matchingIds);
    } else {
      setExpandedItems([]);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setCurrentPage(1);
    setExpandedItems([]);
  };

  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value);
  };

  const popularFAQs = faqs
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, 5);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our coffee, equipment, and services. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </section>

        {/* Search and Filters */}
        <section className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search FAQs... (try 'grind size', 'shipping', 'return policy')"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Results Info */}
        {(searchTerm || selectedCategory !== 'All') && (
          <section className="mb-8">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="text-sm text-muted-foreground">
                Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </div>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Clear filters
              </Button>
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main FAQ Content */}
          <div className="lg:col-span-3">
            {paginatedFAQs.length > 0 ? (
              <>
                <Accordion 
                  type="multiple" 
                  value={expandedItems}
                  onValueChange={handleAccordionChange}
                  className="space-y-4"
                >
                  {paginatedFAQs.map((faq) => (
                    <AccordionItem 
                      key={faq.id} 
                      value={faq.id}
                      className="border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <div className="flex flex-col items-start gap-2 pr-4">
                          <div className="font-medium">{faq.question}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {faq.helpful} people found this helpful
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="space-y-4">
                          <p className="text-muted-foreground whitespace-pre-line">
                            {faq.answer}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 pt-2 border-t">
                            <span className="text-sm text-muted-foreground">
                              Was this helpful?
                            </span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                👍 Yes
                              </Button>
                              <Button size="sm" variant="outline">
                                👎 No
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      showInfo={true}
                      totalItems={filteredFAQs.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl mb-4">No FAQs found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any FAQs matching your search. Try different keywords or browse our categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={resetFilters}>
                    View All FAQs
                  </Button>
                  <Button onClick={() => onPageChange('contact')}>
                    Contact Support
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular FAQs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Popular Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularFAQs.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                        setExpandedItems([faq.id]);
                        // Scroll to FAQ
                        setTimeout(() => {
                          const element = document.getElementById(faq.id);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="text-left w-full p-2 rounded hover:bg-muted transition-colors"
                    >
                      <div className="text-sm font-medium line-clamp-2">
                        {faq.question}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        👍 {faq.helpful}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Browse by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => {
                    const categoryIcon = {
                      'Coffee Basics': Coffee,
                      'Brewing': Coffee,
                      'Equipment Care': Wrench,
                      'Shipping': Truck,
                      'Payment': CreditCard,
                      'Returns': RotateCcw,
                      'Subscriptions': Shield
                    }[category] || HelpCircle;
                    
                    const Icon = categoryIcon;
                    const count = faqs.filter(f => f.category === category).length;
                    
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                          setSearchTerm('');
                        }}
                        className="flex items-center justify-between w-full p-2 rounded hover:bg-muted transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{category}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Still Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <Button 
                  onClick={() => onPageChange('contact')} 
                  className="w-full"
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}