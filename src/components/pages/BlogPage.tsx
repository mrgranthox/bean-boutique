import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Pagination } from '../ui/pagination-custom';
import type { Page } from '../../App';

interface BlogPageProps {
  onPageChange: (page: Page) => void;
}

export function BlogPage({ onPageChange }: BlogPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const itemsPerPage = 6;

  const blogPosts = [
    {
      id: 1,
      title: "The Art of Pour Over: A Beginner's Guide",
      excerpt: "Discover the fundamentals of pour over brewing and how to achieve the perfect extraction every time.",
      author: "Sarah Williams",
      date: "2024-01-15",
      category: "Brewing Guide",
      image: "https://images.unsplash.com/photo-1621744895572-da8dde3c425a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwcG91ciUyMG92ZXJ8ZW58MXx8fHwxNzU1Nzk2NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: true
    },
    {
      id: 2,
      title: "Ethiopian Coffee: A Journey to the Birthplace",
      excerpt: "Explore the rich history and unique flavors of Ethiopian coffee, from ancient legends to modern cultivation.",
      author: "Michael Chen",
      date: "2024-01-10",
      category: "Origin Stories",
      image: "https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: false
    },
    {
      id: 3,
      title: "Sustainable Coffee: Our Commitment to Farmers",
      excerpt: "Learn about our direct trade relationships and how we're working to support coffee farming communities.",
      author: "Sarah Williams",
      date: "2024-01-08",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1505648485-56c725ab9b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBmYXJtJTIwc3VzdGFpbmFibGV8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: false
    },
    {
      id: 4,
      title: "Understanding Coffee Roast Levels",
      excerpt: "From light to dark roasts, understand how roasting affects flavor and choose your perfect cup.",
      author: "Alex Rodriguez",
      date: "2024-01-05",
      category: "Coffee Education",
      image: "https://images.unsplash.com/photo-1523031342620-fa6c0d48c6ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjByb2FzdGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: false
    },
    {
      id: 5,
      title: "Latte Art Masterclass: Tips from Our Baristas",
      excerpt: "Get professional tips on creating beautiful latte art that will impress your friends and customers.",
      author: "Emma Thompson",
      date: "2024-01-03",
      category: "Barista Skills",
      image: "https://images.unsplash.com/photo-1508264282391-44e39cc4b4c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydCUyMGNvZmZlZXxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: false
    },
    {
      id: 6,
      title: "Cold Brew vs Iced Coffee: What's the Difference?",
      excerpt: "Settle the debate once and for all - learn the key differences between cold brew and iced coffee.",
      author: "Michael Chen",
      date: "2024-01-01",
      category: "Brewing Guide",
      image: "https://images.unsplash.com/photo-1544788191-ad3095b5ad0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwYnJldyUyMGNvZmZlZXxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: false
    },
    {
      id: 7,
      title: "The Science of Coffee Extraction",
      excerpt: "Dive deep into the chemistry behind coffee brewing and learn how to optimize your extraction.",
      author: "Dr. Coffee Expert",
      date: "2023-12-28",
      category: "Coffee Education",
      image: "https://images.unsplash.com/photo-1621744895572-da8dde3c425a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwcG91ciUyMG92ZXJ8ZW58MXx8fHwxNzU1Nzk2NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: false
    },
    {
      id: 8,
      title: "Building a Home Coffee Bar",
      excerpt: "Everything you need to know about setting up the perfect coffee station at home.",
      author: "Interior Coffee Designer",
      date: "2023-12-25",
      category: "Coffee Education",
      image: "https://images.unsplash.com/photo-1573066380308-24ff4c273dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBncmluZGVyJTIwbWFudWFsfGVufDF8fHx8MTc1NTg2ODgzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: false
    }
  ];

  const categories = ["All", "Brewing Guide", "Origin Stories", "Sustainability", "Coffee Education", "Barista Skills"];

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  const featuredPost = blogPosts.find(post => post.featured);
  const nonFeaturedPosts = paginatedPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl mb-6">Coffee Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Dive deep into the world of coffee with our expert guides, origin stories, 
            and brewing tips from the Bean Boutique team.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-10"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"} 
                size="sm"
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1); // Reset to first page when changing category
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Results Info */}
        {(searchTerm || selectedCategory !== 'All') && (
          <div className="mb-8 text-center text-muted-foreground">
            Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
        )}

        {/* Featured Post - only show on first page and if no filters */}
        {featuredPost && currentPage === 1 && !searchTerm && selectedCategory === 'All' && (
          <Card className="mb-12 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <ImageWithFallback
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-64 md:h-auto object-cover"
              />
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge className="mb-4 w-fit">Featured</Badge>
                <Badge variant="outline" className="mb-4 w-fit">{featuredPost.category}</Badge>
                <h2 className="text-2xl md:text-3xl mb-4">{featuredPost.title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                </div>
                <Button>
                  Read Full Article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <section>
          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {(currentPage === 1 && !searchTerm && selectedCategory === 'All' ? nonFeaturedPosts : paginatedPosts).map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3">{post.category}</Badge>
                      <h3 className="text-xl mb-3 line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showInfo={true}
                totalItems={filteredPosts.length}
                itemsPerPage={itemsPerPage}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl mb-4">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or category filter.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {/* Newsletter Subscription */}
        <section className="mt-16 text-center bg-muted/30 rounded-lg p-12">
          <h2 className="text-3xl mb-4">Stay Updated</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Subscribe to our newsletter for the latest coffee tips and stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
            />
            <Button>Subscribe</Button>
          </div>
        </section>
      </div>
    </div>
  );
}