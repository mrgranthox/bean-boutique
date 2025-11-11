import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { RatingDisplay } from "../../ui/rating-display";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { ShoppingCart, Heart, Share2, Info, Eye } from "lucide-react";
import { cn } from "../../ui/utils";
import { useCart } from "../../../App";
import { toast } from "sonner";
import type { Coffee } from "../data/coffeeData";

interface CoffeeCardProps {
  coffee: Coffee;
  onSelect: (id: string) => void;
  compact?: boolean;
}

export function CoffeeCard({
  coffee,
  onSelect,
  compact = false,
}: CoffeeCardProps) {
  const { addToCart } = useCart();

  const currentPrice = coffee.salePrice || coffee.price;
  const originalPrice = coffee.salePrice ? coffee.price : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const success = await addToCart(coffee.id, 1);
      if (success) {
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: coffee.name,
          text: coffee.description,
          url: `${window.location.origin}#product-${coffee.id}`,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}#product-${coffee.id}`
      );
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Added to wishlist");
  };

  if (compact) {
    return (
      <Card
        className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
        onClick={() => onSelect(coffee.id)}
      >
        <div className="aspect-square relative">
          <ImageWithFallback
            src={coffee.image}
            alt={coffee.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {coffee.salePrice && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">
              {discount}% OFF
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h4 className="font-medium mb-1 truncate">{coffee.name}</h4>
          <div className="flex items-center gap-1 mb-2">
            <RatingDisplay rating={coffee.rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({coffee.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">${currentPrice.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div
        className="aspect-square relative cursor-pointer"
        onClick={() => onSelect(coffee.id)}
      >
        <ImageWithFallback
          src={coffee.image}
          alt={coffee.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {coffee.bestSeller && (
            <Badge variant="default" className="text-xs">
              Best Seller
            </Badge>
          )}
          {coffee.new && <Badge className="bg-green-600 text-xs">New</Badge>}
          {coffee.featured && (
            <Badge className="bg-blue-600 text-xs">Featured</Badge>
          )}
          {coffee.salePrice && (
            <Badge variant="destructive" className="text-xs">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white/90"
            onClick={handleWishlist}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white/90"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Certifications */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex flex-wrap gap-1">
            {coffee.isOrganic && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-50 text-green-700 border-green-200"
              >
                Organic
              </Badge>
            )}
            {coffee.isFairTrade && (
              <Badge
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                Fair Trade
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(coffee.id);
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!coffee.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {coffee.origin}
          </Badge>
          <div className="flex items-center gap-1">
            <RatingDisplay rating={coffee.rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({coffee.reviewCount})
            </span>
          </div>
        </div>

        <h3
          className={cn(
            "font-medium mb-1 truncate cursor-pointer hover:text-primary"
          )}
          onClick={() => onSelect(coffee.id)}
        >
          {coffee.name}
        </h3>
        <p className={cn("text-sm text-muted-foreground mb-2 line-clamp-2")}>
          {coffee.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {(coffee.tastingNotes || coffee.flavorNotes || [])
            .slice(0, 3)
            .map((note) => (
              <Badge key={note} variant="outline" className="text-xs">
                {note}
              </Badge>
            ))}
          {(coffee.tastingNotes || coffee.flavorNotes || []).length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{(coffee.tastingNotes || coffee.flavorNotes || []).length - 3}{" "}
              more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-primary">
              ${currentPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm line-through text-muted-foreground">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-xs">
              {coffee.roastLevel}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            size="sm"
            onClick={handleAddToCart}
            disabled={!coffee.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {coffee.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(coffee.id);
            }}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock status */}
        <div className="mt-2 flex justify-end">
          {coffee.inStock ? (
            <Badge
              variant="outline"
              className="text-xs text-green-600 border-green-200"
            >
              In Stock
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
