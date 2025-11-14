"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Progress } from "./progress";
import { RatingDisplay } from "./rating-display";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Filter,
  MoreHorizontal,
  Verified,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "./utils";

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
  onReviewHelpful?: (reviewId: string, helpful: boolean) => Promise<void>;
  onReplyClick?: (reviewId: string) => void;
}

const generateMockReviews = (productId: string, count: number): Review[] => {
  const customers = [
    {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612a5f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Emma Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral",
    },
    {
      name: "David Park",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Lisa Thompson",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral",
    },
  ];

  const reviewTemplates = [
    {
      title: "Excellent quality!",
      content:
        "This has exceeded my expectations. The build quality is fantastic and it performs exactly as advertised.",
      rating: 5,
    },
    {
      title: "Great value for money",
      content:
        "Really pleased with this purchase. Good quality and great customer service from Bean Boutique.",
      rating: 4,
    },
    {
      title: "Perfect for daily use",
      content:
        "Using this every day and it has made such a difference to my coffee routine. Highly recommended!",
      rating: 5,
    },
    {
      title: "Solid product",
      content:
        "Does what it says on the tin. Good build quality and arrived quickly.",
      rating: 4,
    },
    {
      title: "Love it!",
      content:
        "This has completely transformed my coffee experience. Worth every penny!",
      rating: 5,
    },
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
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      verified: Math.random() > 0.3,
      helpful: Math.floor(Math.random() * 20),
      notHelpful: Math.floor(Math.random() * 3),
      location: [
        "New York, NY",
        "Los Angeles, CA",
        "Chicago, IL",
        "Seattle, WA",
        "Portland, OR",
      ][Math.floor(Math.random() * 5)],
    };
  });
};

export function ReviewsSection({
  productId = "",
  rating = 4.5,
  reviewCount = 0,
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  className,
  onReviewHelpful,
  onReplyClick,
}: ReviewsSectionProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "helpful">(
    "newest"
  );
  const [page, setPage] = useState(1);
  const [helpfulStates, setHelpfulStates] = useState<
    Record<string, boolean | null>
  >({});
  const [loadingReviewId, setLoadingReviewId] = useState<string | null>(null);

  const pageSize = 8;

  // Use provided data or generate mock data
  const finalReviews =
    reviews ||
    (productId
      ? generateMockReviews(productId, Math.min(reviewCount, 50))
      : []);
  const finalAverageRating = averageRating || rating;
  const finalTotalReviews = totalReviews || reviewCount;
  const finalRatingDistribution = ratingDistribution || {
    5: Math.floor(finalTotalReviews * 0.6),
    4: Math.floor(finalTotalReviews * 0.25),
    3: Math.floor(finalTotalReviews * 0.1),
    2: Math.floor(finalTotalReviews * 0.03),
    1: Math.floor(finalTotalReviews * 0.02),
  };

  // Filter reviews
  const filteredReviews = useMemo(() => {
    let filtered = finalReviews;

    if (selectedRating !== null) {
      filtered = filtered.filter((review) => review.rating === selectedRating);
    }

    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "helpful":
          return b.helpful - a.helpful;
        case "newest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return sorted;
  }, [finalReviews, selectedRating, sortBy]);

  // Paginate reviews
  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, page, pageSize]);

  const totalPages = Math.ceil(filteredReviews.length / pageSize);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleHelpful = useCallback(
    async (reviewId: string, helpful: boolean) => {
      try {
        setLoadingReviewId(reviewId);
        setHelpfulStates((prev) => ({
          ...prev,
          [reviewId]: helpful,
        }));

        if (onReviewHelpful) {
          await onReviewHelpful(reviewId, helpful);
        }
      } catch (error) {
        console.error("Error marking review as helpful:", error);
        setHelpfulStates((prev) => ({
          ...prev,
          [reviewId]: null,
        }));
      } finally {
        setLoadingReviewId(null);
      }
    },
    [onReviewHelpful]
  );

  const handleResetFilters = useCallback(() => {
    setSelectedRating(null);
    setSortBy("newest");
    setPage(1);
  }, []);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Rating Overview */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Overall Rating */}
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold text-primary">
                {finalAverageRating.toFixed(1)}
              </div>
              <RatingDisplay
                rating={finalAverageRating}
                size="lg"
                showNumber={false}
                className="justify-center"
              />
              <p className="text-sm text-muted-foreground">
                Based on {finalTotalReviews.toLocaleString()}{" "}
                {finalTotalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = finalRatingDistribution[stars] || 0;
                const percentage =
                  finalTotalReviews > 0 ? (count / finalTotalReviews) * 100 : 0;

                return (
                  <div key={stars} className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        setSelectedRating(
                          selectedRating === stars ? null : stars
                        );
                        setPage(1);
                      }}
                      className="flex items-center gap-1 w-14 hover:opacity-70 transition-opacity"
                      aria-label={`Filter by ${stars} stars`}
                    >
                      <span className="text-sm font-medium">{stars}</span>
                      <span className="text-yellow-400">⭐</span>
                    </button>
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground w-10 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters & Sort */}
          <div className="pt-6 border-t space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">Filter by rating:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedRating === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedRating(null);
                    setPage(1);
                  }}
                  className="text-xs sm:text-sm"
                >
                  All
                </Button>
                {[5, 4, 3, 2, 1].map((r) => (
                  <Button
                    key={r}
                    variant={selectedRating === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedRating(r);
                      setPage(1);
                    }}
                    className="text-xs sm:text-sm"
                  >
                    {r}⭐
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <span className="text-sm font-medium">Sort by:</span>
              <div className="flex flex-wrap gap-2">
                {(["newest", "oldest", "helpful"] as const).map((sort) => (
                  <Button
                    key={sort}
                    variant={sortBy === sort ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSortBy(sort);
                      setPage(1);
                    }}
                    className="text-xs sm:text-sm capitalize"
                  >
                    {sort}
                  </Button>
                ))}
              </div>
            </div>

            {(selectedRating !== null || sortBy !== "newest") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Reset filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews Count Info */}
      {filteredReviews.length > 0 && (
        <p className="text-sm text-muted-foreground px-1">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, filteredReviews.length)} of{" "}
          {filteredReviews.length}{" "}
          {filteredReviews.length === 1 ? "review" : "reviews"}
        </p>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        {paginatedReviews.length > 0 ? (
          paginatedReviews.map((review) => (
            <Card
              key={review.id}
              className="w-full hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage
                      src={review.customerAvatar}
                      alt={review.customerName}
                    />
                    <AvatarFallback>
                      {getInitials(review.customerName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium truncate">
                            {review.customerName}
                          </h4>
                          {review.verified && (
                            <Badge
                              variant="secondary"
                              className="text-xs flex-shrink-0"
                            >
                              <Verified className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-sm text-muted-foreground">
                          <RatingDisplay
                            rating={review.rating}
                            size="sm"
                            showNumber={false}
                          />
                          <span>{formatDate(review.date)}</span>
                          {review.location && <span>📍 {review.location}</span>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="self-start sm:self-auto"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Review Content */}
                    <div className="space-y-2">
                      <h5 className="font-semibold text-base line-clamp-2">
                        {review.title}
                      </h5>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">
                        {review.content}
                      </p>
                      {review.variant && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          <span className="font-medium">Variant:</span>{" "}
                          {review.variant}
                        </p>
                      )}
                    </div>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {review.images.map((image, index) => (
                          <div
                            key={index}
                            className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
                          >
                            <ImageWithFallback
                              src={image}
                              alt={`Review ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id, true)}
                        disabled={loadingReviewId === review.id}
                        className={cn(
                          "text-xs sm:text-sm",
                          helpfulStates[review.id] === true &&
                            "bg-green-50 text-green-700 hover:bg-green-100"
                        )}
                        aria-pressed={helpfulStates[review.id] === true}
                      >
                        <ThumbsUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Helpful</span>
                        <span className="sm:hidden">({review.helpful})</span>
                        <span className="hidden sm:inline">
                          ({review.helpful})
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id, false)}
                        disabled={loadingReviewId === review.id}
                        className={cn(
                          "text-xs sm:text-sm",
                          helpfulStates[review.id] === false &&
                            "bg-red-50 text-red-700 hover:bg-red-100"
                        )}
                        aria-pressed={helpfulStates[review.id] === false}
                      >
                        <ThumbsDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Not helpful</span>
                        <span className="sm:hidden">({review.notHelpful})</span>
                        <span className="hidden sm:inline">
                          ({review.notHelpful})
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReplyClick?.(review.id)}
                        className="text-xs sm:text-sm"
                      >
                        <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Reply</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No reviews found for the selected filters.
              </p>
              {selectedRating !== null && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
