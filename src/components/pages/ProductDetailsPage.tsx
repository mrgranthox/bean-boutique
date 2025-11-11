import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { RatingDisplay } from "../ui/rating-display";
import { ReviewsSection } from "../ui/reviews-section";
import { useCart } from "../../App";
import { toast } from "sonner";
import {
  getProductById,
  getProducts,
  type Product,
} from "../../utils/database-service";
import type { Page } from "../../App";

interface ProductDetailsPageProps {
  onPageChange: (
    page: Page,
    productId?: string,
    category?: "coffee" | "equipment"
  ) => void;
  productId?: string;
  category?: "coffee" | "equipment";
}

export function ProductDetailsPage({
  onPageChange,
  productId,
  category,
}: ProductDetailsPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("12oz bag");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
    setQuantity(1);
    setSelectedVariant("12oz bag");
  }, [productId]);

  const loadProduct = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("🔍 Loading product details:", productId);

      // Fetch product details
      const { data: productData, error: productError } = await getProductById(
        productId
      );

      if (productError || !productData) {
        console.error("Error loading product:", productError);
        toast.error("Failed to load product details");
        setProduct(null);
        return;
      }

      setProduct(productData);
      console.log("✅ Product loaded:", productData);

      // Fetch related products (same category)
      const { data: relatedData } = await getProducts({
        category: productData.category,
        limit: 4,
      });

      // Filter out current product
      const filtered = relatedData
        .filter((p) => p.id !== productId)
        .slice(0, 4);
      setRelatedProducts(filtered);
    } catch (error) {
      console.error("Exception loading product:", error);
      toast.error("Failed to load product");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      // Determine the actual price (use sale_price if available)
      const actualPrice =
        product.sale_price && product.sale_price > 0
          ? product.sale_price
          : product.price;

      const cartItem = {
        id: product.id,
        name: product.name,
        price: actualPrice,
        image: product.image_url,
        category: product.category,
        variant: product.category === "coffee" ? selectedVariant : undefined,
        description: product.description,
      };

      const success = await addToCart(cartItem.id, quantity);

      if (success) {
        toast.success(
          `Added ${quantity} ${quantity > 1 ? "items" : "item"} to cart!`
        );
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleShare = async () => {
    if (!product) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl mb-4">Product not found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Button onClick={() => onPageChange("home")}>Return to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice =
    product.sale_price && product.sale_price > 0
      ? product.sale_price
      : product.price;
  const originalPrice =
    product.sale_price &&
    product.sale_price > 0 &&
    product.sale_price < product.price
      ? product.price
      : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const isInStock = product.stock > 0;
  const isCoffee = product.category === "coffee";

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange("home")}
            className="p-0 h-auto"
          >
            Home
          </Button>
          <span>/</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(isCoffee ? "coffee" : "equipment")}
            className="p-0 h-auto"
          >
            {isCoffee ? "Coffee Selection" : "Brewing Equipment"}
          </Button>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onPageChange(isCoffee ? "coffee" : "equipment")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {isCoffee ? "Coffee Selection" : "Equipment"}
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <ImageWithFallback
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-full"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  {discount}% OFF
                </Badge>
              )}
              {product.featured && (
                <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
                  Featured
                </Badge>
              )}
              {!isInStock && (
                <Badge className="absolute bottom-4 left-4 bg-gray-600 text-white">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <RatingDisplay rating={product.rating || 4.5} />
                <span className="text-sm text-muted-foreground">
                  {product.review_count || 0} reviews
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl text-primary">
                  ${currentPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>

              {/* Coffee-specific info */}
              {isCoffee && (
                <div className="space-y-3 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.origin && (
                      <Badge variant="secondary">
                        Origin: {product.origin}
                      </Badge>
                    )}
                    {product.roast_level && (
                      <Badge variant="secondary">
                        Roast: {product.roast_level}
                      </Badge>
                    )}
                    {product.processing_method && (
                      <Badge variant="secondary">
                        Process: {product.processing_method}
                      </Badge>
                    )}
                  </div>
                  {product.flavor_notes && product.flavor_notes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.flavor_notes.map((note, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {note}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Equipment-specific info */}
              {!isCoffee && (
                <div className="space-y-3 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.brand && (
                      <Badge variant="secondary">Brand: {product.brand}</Badge>
                    )}
                    {product.type && (
                      <Badge variant="secondary">Type: {product.type}</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Variant Selection (for coffee) */}
              {isCoffee && (
                <div className="space-y-3 mb-6">
                  <label className="text-sm">Size:</label>
                  <div className="flex gap-2">
                    {["12oz bag", "1lb bag", "2lb bag", "5lb bag"].map(
                      (variant) => (
                        <Button
                          key={variant}
                          variant={
                            selectedVariant === variant ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedVariant(variant)}
                        >
                          {variant}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Stock status */}
              <div className="mb-4">
                {isInStock ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span>In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm">Quantity:</label>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={decrementQuantity}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="h-10 w-12 flex items-center justify-center border-x">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={incrementQuantity}
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1"
                    disabled={!isInStock}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isInStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlist}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? "fill-current text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>2-year warranty included</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p>{product.description}</p>

                    {isCoffee && (
                      <div className="space-y-4">
                        <Separator />
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="mb-3">Origin Information</h3>
                            <div className="space-y-2 text-sm">
                              {product.origin && (
                                <p>
                                  <strong>Country:</strong> {product.origin}
                                </p>
                              )}
                              {product.altitude && (
                                <p>
                                  <strong>Altitude:</strong> {product.altitude}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="mb-3">Processing</h3>
                            <div className="space-y-2 text-sm">
                              {product.processing_method && (
                                <p>
                                  <strong>Method:</strong>{" "}
                                  {product.processing_method}
                                </p>
                              )}
                              {product.roast_level && (
                                <p>
                                  <strong>Roast Level:</strong>{" "}
                                  {product.roast_level}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isCoffee && (
                      <div className="space-y-4">
                        <Separator />
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="mb-3">Product Information</h3>
                            <div className="space-y-2 text-sm">
                              {product.brand && (
                                <p>
                                  <strong>Brand:</strong> {product.brand}
                                </p>
                              )}
                              {product.model && (
                                <p>
                                  <strong>Model:</strong> {product.model}
                                </p>
                              )}
                              {product.type && (
                                <p>
                                  <strong>Type:</strong> {product.type}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {isCoffee && (
                    <div className="space-y-4">
                      <h3>Coffee Specifications</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          {product.origin && (
                            <div className="flex justify-between">
                              <span>Origin:</span>
                              <span>{product.origin}</span>
                            </div>
                          )}
                          {product.roast_level && (
                            <div className="flex justify-between">
                              <span>Roast Level:</span>
                              <span>{product.roast_level}</span>
                            </div>
                          )}
                          {product.processing_method && (
                            <div className="flex justify-between">
                              <span>Processing Method:</span>
                              <span>{product.processing_method}</span>
                            </div>
                          )}
                          {product.altitude && (
                            <div className="flex justify-between">
                              <span>Altitude:</span>
                              <span>{product.altitude}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <span>{product.rating || 4.5}/5.0</span>
                          </div>
                        </div>
                      </div>
                      {product.flavor_notes &&
                        product.flavor_notes.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="mb-2">Flavor Notes</h4>
                              <div className="flex flex-wrap gap-2">
                                {product.flavor_notes.map((note, index) => (
                                  <Badge key={index} variant="outline">
                                    {note}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                  )}

                  {!isCoffee && (
                    <div className="space-y-4">
                      <h3>Equipment Specifications</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          {product.brand && (
                            <div className="flex justify-between">
                              <span>Brand:</span>
                              <span>{product.brand}</span>
                            </div>
                          )}
                          {product.model && (
                            <div className="flex justify-between">
                              <span>Model:</span>
                              <span>{product.model}</span>
                            </div>
                          )}
                          {product.type && (
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <span>{product.type}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <span>{product.rating || 4.5}/5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewsSection
                productId={product.id}
                rating={product.rating || 4.5}
                reviewCount={product.review_count || 0}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() =>
                    onPageChange(
                      "product-details",
                      relatedProduct.id,
                      relatedProduct.category as "coffee" | "equipment"
                    )
                  }
                >
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={relatedProduct.image_url}
                      alt={relatedProduct.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <RatingDisplay
                        rating={relatedProduct.rating || 4.5}
                        size="sm"
                      />
                      <span className="text-xs text-muted-foreground">
                        ({relatedProduct.review_count || 0})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">
                        $
                        {(relatedProduct.sale_price &&
                        relatedProduct.sale_price > 0
                          ? relatedProduct.sale_price
                          : relatedProduct.price
                        ).toFixed(2)}
                      </span>
                      {relatedProduct.sale_price &&
                        relatedProduct.sale_price > 0 &&
                        relatedProduct.sale_price < relatedProduct.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${relatedProduct.price.toFixed(2)}
                          </span>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
