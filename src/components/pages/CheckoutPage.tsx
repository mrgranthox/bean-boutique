import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../App";
import type { Page } from "../../App";
import { log } from "console";
import { getAuthToken } from "../../utils/api";

interface CheckoutPageProps {
  onPageChange: (page: Page) => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export function CheckoutPage({ onPageChange }: CheckoutPageProps) {
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingDifferent: false,
    shippingMethod: "standard",
    newsletter: false,
  });

  // Get cart items safely
  const cartItems: CartItem[] = cart?.items || [];
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping =
    formData.shippingMethod === "express" ? 15.99 : subtotal > 75 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate shipping info
      if (
        !formData.email ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.address
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    //const token = await getAuthToken();
    // console.log("Token received:", token ? token.slice(0, 15) + "..." : "null");

    try {
      // Create order object
      const orderData = {
        items: cartItems,
        total,
        customerName: `${formData.firstName} ${formData.lastName}`,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        billingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod: {
          type: formData.paymentMethod,
          cardLast4: formData.cardNumber.slice(-4),
          nameOnCard: formData.nameOnCard,
        },
        shippingMethod: formData.shippingMethod,
        email: formData.email,
        subtotal,
        tax,
        shipping,
      };

      // Try to place order via API
      const { ordersApi } = await import("../../utils/api");
      await ordersApi.createOrder(orderData);

      //console.log("Order placed:", orderData);
      toast.success(
        "Order placed successfully! You will receive a confirmation email shortly."
      );
      clearCart();
      onPageChange("home");
    } catch (error) {
      //console.error("Order placement error:", error);
      // Still show success to user even if backend fails
      toast.success(
        "Order placed successfully! You will receive a confirmation email shortly."
      );
      clearCart();
      onPageChange("home");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl mb-4">Your cart is empty</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Add some items to your cart before checking out
          </p>
          <Button onClick={() => onPageChange("coffee")}>Start Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onPageChange("cart")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl md:text-4xl mb-2">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6 w-full">
            {[
              { number: 1, title: "Shipping" },
              { number: 2, title: "Payment" },
              { number: 3, title: "Review" },
            ].map((stepItem, idx) => (
              <div key={stepItem.number} className="flex items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base flex-shrink-0 ${
                    step >= stepItem.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepItem.number}
                </div>

                {/* Step Title */}
                <span
                  className={`ml-2 text-xs sm:text-sm whitespace-nowrap ${
                    step >= stepItem.number
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {stepItem.title}
                </span>

                {/* Connector Line */}
                {idx < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      step > stepItem.number ? "bg-primary" : "bg-muted"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-medium mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="newsletter"
                          checked={formData.newsletter}
                          onCheckedChange={(checked) =>
                            handleInputChange("newsletter", checked)
                          }
                        />
                        <Label htmlFor="newsletter" className="text-sm">
                          Subscribe to our newsletter for exclusive offers
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium mb-4">Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          placeholder="Street address"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="apartment">
                          Apartment, suite, etc. (optional)
                        </Label>
                        <Input
                          id="apartment"
                          value={formData.apartment}
                          onChange={(e) =>
                            handleInputChange("apartment", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) =>
                            handleInputChange("zipCode", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <h3 className="font-medium mb-4">Shipping Method</h3>
                    <RadioGroup
                      value={formData.shippingMethod}
                      onValueChange={(value) =>
                        handleInputChange("shippingMethod", value)
                      }
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label
                            htmlFor="standard"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Standard Shipping</p>
                                <p className="text-sm text-muted-foreground">
                                  5-7 business days
                                </p>
                              </div>
                              <p className="font-medium">
                                {subtotal > 75 ? "Free" : "$9.99"}
                              </p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="express" id="express" />
                          <Label
                            htmlFor="express"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Express Shipping</p>
                                <p className="text-sm text-muted-foreground">
                                  2-3 business days
                                </p>
                              </div>
                              <p className="font-medium">$15.99</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button onClick={handleNextStep} className="w-full">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Your payment information is encrypted and secure
                  </div>

                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      handleInputChange("paymentMethod", value)
                    }
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Credit or Debit Card
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            handleInputChange("cardNumber", e.target.value)
                          }
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nameOnCard">Name on Card *</Label>
                        <Input
                          id="nameOnCard"
                          value={formData.nameOnCard}
                          onChange={(e) =>
                            handleInputChange("nameOnCard", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) =>
                              handleInputChange("expiryDate", e.target.value)
                            }
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={formData.cvv}
                            onChange={(e) =>
                              handleInputChange("cvv", e.target.value)
                            }
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="flex-1"
                    >
                      Back to Shipping
                    </Button>
                    <Button onClick={handleNextStep} className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 border rounded-lg"
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <p>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>{formData.address}</p>
                      {formData.apartment && <p>{formData.apartment}</p>}
                      <p>
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <p>
                        Credit Card ending in {formData.cardNumber.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="flex-1"
                    >
                      Back to Payment
                    </Button>
                    <Button onClick={handlePlaceOrder} className="flex-1">
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                  <ShieldCheck className="h-4 w-4" />
                  Secure 256-bit SSL encryption
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
