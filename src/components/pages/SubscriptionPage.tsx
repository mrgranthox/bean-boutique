import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Check,
  Coffee,
  Package,
  Star,
  Truck,
  Calendar,
  Settings,
  Loader2,
  CreditCard,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSubscriptionPlans,
  createSubscription,
  type SubscriptionPlan,
} from "../../utils/database-service";
import { useAuth, useCart } from "../../App";
import type { Page } from "../../App";

interface SubscriptionPageProps {
  onPageChange: (page: Page) => void;
}

export function SubscriptionPage({ onPageChange }: SubscriptionPageProps) {
  const { addSubscriptionToCart } = useCart();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  // Prefill email when user is signed in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await getSubscriptionPlans();

      if (error) {
        throw error;
      }

      setPlans(data);
      console.log("✅ Loaded", data);
    } catch (error) {
      console.error("❌ Error loading subscription plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) return;

    try {
      setProcessingPayment(true);

      // Validate form
      if (!email || !cardNumber || !cardExpiry || !cardCvc || !cardName) {
        toast.error("Please fill in all fields");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Check if user is signed in
      if (!user?.id) {
        toast.error("Please sign in to subscribe");
        return;
      }

      // Calculate the final price based on billing period
      const finalPrice =
        billingPeriod === "annual"
          ? Number((selectedPlan.price * 12 * 0.9).toFixed(2))
          : selectedPlan.price;

      // Simulate payment processing (replace with actual payment API like Stripe)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Replace with actual payment processing
      // const paymentResult = await processPayment({
      //   amount: finalPrice,
      //   cardNumber,
      //   cardExpiry,
      //   cardCvc,
      //   cardName,
      //   email,
      // });

      // if (!paymentResult.success) {
      //   throw new Error("Payment failed");
      // }

      // Create subscription in database
      const frequencyMap: Record<string, "monthly" | "quarterly" | "yearly"> = {
        monthly: "monthly",
        annual: "yearly", // map "annual" to "yearly"
        quarterly: "quarterly",
      };

      const { data: subscriptionData, error: subscriptionError } =
        await createSubscription(user.id, {
          id: selectedPlan.id,
          name: selectedPlan.name,
          price: selectedPlan.price,
          interval: frequencyMap[billingPeriod], // mapped to valid frequency
          quantity: selectedPlan.coffee_quantity, // default quantity
        });

      if (subscriptionError) {
        throw new Error("Failed to create subscription");
      }

      if (subscriptionError) {
        throw new Error("Failed to create subscription");
      }

      // subscriptionData now contains the inserted subscription row
      toast.success("Subscription successfully created!");
      console.log("✅ Subscription created:", subscriptionData);

      toast.success("Subscription activated!", {
        description: `You've successfully subscribed to ${selectedPlan.name}`,
        duration: 5000,
      });

      // Reset form and close modal
      setShowCheckoutModal(false);
      resetForm();

      // Optionally redirect to account page to view subscription
      setTimeout(() => {
        onPageChange("account");
      }, 2000);
    } catch (error) {
      console.error("Error processing subscription:", error);
      toast.error("Payment failed", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your payment details and try again",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const resetForm = () => {
    if (!user?.email) {
      setEmail("");
    }
    setCardNumber("");
    setCardExpiry("");
    setCvc("");
    setCardName("");
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const getPlanPrice = (plan: SubscriptionPlan) => {
    if (billingPeriod === "annual") {
      return (plan.price * 12 * 0.9).toFixed(2); // 10% discount for annual
    }
    return plan.price.toFixed(2);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl mb-6">Coffee Subscriptions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Never run out of your favorite coffee. Choose a plan that fits your
            lifestyle and get freshly roasted beans delivered to your door.
          </p>
        </section>

        {/* Billing Period Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border p-1 bg-muted/30">
            <Button
              variant={billingPeriod === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === "annual" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingPeriod("annual")}
            >
              Annual
              <Badge variant="secondary" className="ml-2">
                Save 10%
              </Badge>
            </Button>
          </div>
        </div>

        {/* Subscription Plans */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : plans.length === 0 ? (
          <Card className="p-12 text-center">
            <Coffee className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl mb-2">No Subscription Plans Available</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for our subscription offerings!
            </p>
            <Button onClick={() => onPageChange("home")}>
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
                    <Star className="h-3 w-3 inline mr-1" />
                    Most Popular
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-12">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl">${getPlanPrice(plan)}</span>
                    <span className="text-muted-foreground">
                      /{billingPeriod === "annual" ? "year" : "month"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Features</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.delivery_frequency && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Truck className="h-4 w-4 text-primary" />
                        <span className="font-medium">Delivery:</span>
                        <span className="text-muted-foreground">
                          {plan.delivery_frequency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="font-medium">Bag Size:</span>
                        <span className="text-muted-foreground">
                          {plan.bag_size}
                        </span>
                      </div>
                    </div>
                  )}

                  {plan.customization_options &&
                    plan.customization_options.length > 0 && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <Settings className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            Customization Options
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {plan.customization_options.map((option, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  <Button
                    className="w-full mt-6"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan)}
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <section className="grid md:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <Coffee className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium mb-2">Fresh Roasted</h3>
              <p className="text-sm text-muted-foreground">
                Roasted to order and shipped within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium mb-2">Fully Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Choose your roast, grind, and flavor preferences
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium mb-2">Flexible Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Pause, skip, or cancel anytime
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On all subscription orders
              </p>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade or downgrade your subscription plan at
                  any time. Changes will take effect on your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  How does shipping work?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All subscription orders ship for free via USPS Priority Mail.
                  You'll receive tracking information as soon as your order
                  ships.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I pause my subscription?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Absolutely! You can pause your subscription for up to 3 months
                  or skip individual deliveries without losing your plan
                  benefits.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  What if I don't like the coffee?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We offer a 100% satisfaction guarantee. If you're not happy
                  with your coffee, we'll replace it or refund you—no questions
                  asked.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-muted/30 rounded-lg p-12">
          <h2 className="text-3xl mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our customer service team is here to help you find the perfect
            subscription plan.
          </p>
          <Button size="lg" onClick={() => onPageChange("contact")}>
            Contact Us
          </Button>
        </section>
      </div>

      {/* Checkout Modal */}
      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <>
                  {selectedPlan.name} - ${getPlanPrice(selectedPlan)}/
                  {billingPeriod === "annual" ? "year" : "month"}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCheckout} className="space-y-4 mt-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!user?.email}
                required
              />
              {user && (
                <p className="text-xs text-muted-foreground">
                  Using your account email
                </p>
              )}
            </div>

            {/* Card Name */}
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    if (formatted.replace(/\s/g, "").length <= 16) {
                      setCardNumber(formatted);
                    }
                  }}
                  maxLength={19}
                  required
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Expiry Date</Label>
                <Input
                  id="cardExpiry"
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => {
                    const formatted = formatExpiry(e.target.value);
                    if (formatted.replace(/\D/g, "").length <= 4) {
                      setCardExpiry(formatted);
                    }
                  }}
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  id="cardCvc"
                  type="text"
                  placeholder="123"
                  value={cardCvc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 4) {
                      setCvc(value);
                    }
                  }}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <Lock className="h-4 w-4 flex-shrink-0" />
              <span>Your payment information is encrypted and secure</span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={processingPayment}
            >
              {processingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Subscribe Now - ${selectedPlan && getPlanPrice(selectedPlan)}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By subscribing, you agree to our terms and conditions. You can
              cancel anytime.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
