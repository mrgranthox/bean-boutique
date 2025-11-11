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
import {
  Check,
  Coffee,
  Package,
  Star,
  Truck,
  Calendar,
  Settings,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSubscriptionPlans,
  type SubscriptionPlan,
} from "../../utils/database-service";
import { useCart } from "../../App";
import type { Page } from "../../App";

interface SubscriptionPageProps {
  onPageChange: (page: Page) => void;
}

export function SubscriptionPage({ onPageChange }: SubscriptionPageProps) {
  const { addToCart } = useCart();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

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

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      setSelectedPlan(plan.id);

      // Calculate the final price based on billing period
      const finalPrice =
        billingPeriod === "annual"
          ? Number((plan.price * 12 * 0.9).toFixed(2))
          : plan.price;

      // Create a subscription product object to add to cart
      const subscriptionProduct = {
        id: `subscription-${plan.id}-${billingPeriod}`,
        name: `${plan.name} Subscription`,
        description: `${plan.description} - ${
          billingPeriod === "annual" ? "Annual" : "Monthly"
        } billing`,
        price: finalPrice,
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400",
        category: "Subscription",
      };

      // Add to cart
      const success = await addToCart(subscriptionProduct.id, 1);

      if (success) {
        toast.success("Subscription added to cart!", {
          description: "You can now proceed to checkout",
          duration: 3000,
        });
      } else {
        setSelectedPlan(null);
        toast.error("Failed to add subscription to cart");
      }
    } catch (error) {
      console.error("Error adding subscription to cart:", error);
      setSelectedPlan(null);
      toast.error("Failed to add subscription to cart");
    }
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
                    disabled={selectedPlan === plan.id}
                  >
                    {selectedPlan === plan.id
                      ? "Added to Cart!"
                      : "Choose Plan"}
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
    </div>
  );
}
