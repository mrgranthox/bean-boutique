import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Progress } from './progress';
import { RatingDisplay } from './rating-display';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ThumbsUp, ThumbsDown, MessageCircle, Filter, MoreHorizontal, Verified } from 'lucide-react';
import { cn } from './utils';

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  images?: string[];
  variant?: string;
  location?: string;
}

interface ReviewsSectionProps {
  productId?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  ratingDistribution?: { [key: number]: number };
  className?: string;
}

// Generate mock reviews for demo purposes
const generateMockReviews = (productId: string, count: number): Review[] => {
  const customers = [
    { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612a5f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral' },
    { name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral' },
    { name: 'Emma Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral' },
    { name: 'David Park', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral' },
    { name: 'Lisa Thompson', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral' }
  ];

  const reviewTemplates = [
    { title: 'Excellent quality!', content: 'This has exceeded my expectations. The build quality is fantastic and it performs exactly as advertised.', rating: 5 },
    { title: 'Great value for money', content: 'Really pleased with this purchase. Good quality and great customer service from Bean Boutique.', rating: 4 },
    { title: 'Perfect for daily use', content: 'Using this every day and it has made such a difference to my coffee routine. Highly recommended!', rating: 5 },
    { title: 'Solid product', content: 'Does what it says on the tin. Good build quality and arrived quickly.', rating: 4 },
    { title: 'Love it!', content: 'This has completely transformed my coffee experience. Worth every penny!', rating: 5 }
  ];

  return Array.from({ length: count }, (_, index) => {
    const customer = customers[index % customers.length];
    const template = reviewTemplates[index % reviewTemplates.length];
    
    return {
      id: `${productId}-review-${index + 1}`,
      customerName: customer.name,
      customerAvatar: customer.avatar,
      rating: template.rating,
      title: template.title,
      content: template.content,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      verified: Math.random() > 0.3,
      helpful: Math.floor(Math.random() * 20),
      notHelpful: Math.floor(Math.random() * 3),
      location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Seattle, WA', 'Portland, OR'][Math.floor(Math.random() * 5)]
    };
  });
};

export function ReviewsSection({
  productId = '',
  rating = 4.5,
  reviewCount = 0,
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  className
}: ReviewsSectionProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful'>('newest');
  const [showAll, setShowAll] = useState(false);

  // Use provided data or generate mock data
  const finalReviews = reviews || (productId ? generateMockReviews(productId, Math.min(reviewCount, 8)) : []);
  const finalAverageRating = averageRating || rating;
  const finalTotalReviews = totalReviews || reviewCount;
  const finalRatingDistribution = ratingDistribution || {
    5: Math.floor(finalTotalReviews * 0.6),
    4: Math.floor(finalTotalReviews * 0.25),
    3: Math.floor(finalTotalReviews * 0.1),
    2: Math.floor(finalTotalReviews * 0.03),
    1: Math.floor(finalTotalReviews * 0.02)
  };

  const displayedReviews = showAll ? finalReviews : finalReviews.slice(0, 5);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {finalAverageRating.toFixed(1)}
              </div>
              <RatingDisplay rating={finalAverageRating} size="lg" showNumber={false} className="justify-center mb-2" />
              <p className="text-sm text-muted-foreground">
                Based on {finalTotalReviews.toLocaleString()} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = finalRatingDistribution[stars] || 0;
                const percentage = finalTotalReviews > 0 ? (count / finalTotalReviews) * 100 : 0;
                
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm">{stars}</span>
                      <span className="text-yellow-400">⭐</span>
                    </div>
                    <Progress value={percentage} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-12">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by rating:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRating === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRating(null)}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={selectedRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRating(rating)}
                >
                  {rating} ⭐
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.customerAvatar} />
                  <AvatarFallback>{getInitials(review.customerName)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{review.customerName}</h4>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Verified className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <RatingDisplay rating={review.rating} size="sm" showNumber={false} />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.date)}
                        </span>
                        {review.location && (
                          <span className="text-sm text-muted-foreground">
                            📍 {review.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h5 className="font-medium mb-2">{review.title}</h5>
                    <p className="text-muted-foreground">{review.content}</p>
                    {review.variant && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-medium">Variant:</span> {review.variant}
                      </p>
                    )}
                  </div>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((image, index) => (
                        <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Not helpful ({review.notHelpful})
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {!showAll && finalReviews.length > 5 && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            Show All {finalReviews.length} Reviews
          </Button>
        </div>
      )}
    </div>
  );
}