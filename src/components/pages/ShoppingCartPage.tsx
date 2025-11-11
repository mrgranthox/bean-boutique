import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../App";
import type { Page } from "../../App";

interface ShoppingCartPageProps {
  onPageChange: (page: Page) => void;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export function ShoppingCartPage({ onPageChange }: ShoppingCartPageProps) {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const cartItems: CartItem[] = cart?.items || [];

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    const success = await updateQuantity(productId, newQuantity);
    if (success) {
      toast.success("Quantity updated");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const success = await removeFromCart(productId);
    if (success) {
      toast.success("Item removed from cart");
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome15") {
      setAppliedPromo("WELCOME15");
      toast.success("Promo code applied! 15% discount");
    } else if (promoCode.toLowerCase() === "coffee10") {
      setAppliedPromo("COFFEE10");
      toast.success("Promo code applied! $10 off");
    } else {
      toast.error("Invalid promo code. Try WELCOME15 or COFFEE10");
    }
    setPromoCode("");
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    toast.success("Promo code removed");
  };

  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 75 ? 0 : 9.99;

  let discount = 0;
  if (appliedPromo === "WELCOME15") {
    discount = subtotal * 0.15;
  } else if (appliedPromo === "COFFEE10") {
    discount = 10;
  }

  const total = subtotal - discount + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl mb-2">Loading your cart...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your items
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl mb-4">Your cart is empty</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Start shopping to add items to your cart
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => onPageChange("coffee")}>
              Shop Coffee
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onPageChange("subscription")}
            >
              Try Subscription
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <Card
                key={`${item.productId}-${index}`}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">Product</Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Suggested Actions */}
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <h3 className="font-medium mb-2">Want to save more?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try our subscription service and save up to 20% on every order
                </p>
                <Button
                  variant="outline"
                  onClick={() => onPageChange("subscription")}
                >
                  View Subscriptions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!appliedPromo}
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={!promoCode || !!appliedPromo}
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded">
                      <span className="text-green-600">
                        ✓ {appliedPromo} applied
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removePromoCode}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  {!appliedPromo && (
                    <p className="text-xs text-muted-foreground">
                      Try codes: WELCOME15 or COFFEE10
                    </p>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                      💡 Add ${(75 - subtotal).toFixed(2)} more for free
                      shipping!
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => onPageChange("checkout")}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onPageChange("coffee")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>

                {/* Trust Signals */}
                <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                  <p>✓ Secure checkout with SSL encryption</p>
                  <p>✓ 30-day satisfaction guarantee</p>
                  <p>✓ Expert customer support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
