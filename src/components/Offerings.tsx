import { Coffee, Users, Calendar, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { toast } from "sonner";

const offerings = [
  {
    icon: Coffee,
    title: "Premium Coffee",
    description:
      "Handcrafted beverages made from the finest beans, sourced directly from sustainable farms around the world.",
    image:
      "https://images.unsplash.com/photo-1531441802565-2948024f1b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydHxlbnwxfHx8fDE3NTU4NjgzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Beautiful latte art on a coffee cup",
  },
  {
    icon: Users,
    title: "Community Space",
    description:
      "A warm, welcoming environment perfect for meetings, studying, or simply enjoying quality time with friends.",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1ODMzMDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Coffee shop interior with people socializing",
  },
  {
    icon: Calendar,
    title: "Coffee Events",
    description:
      "Join our regular coffee tastings, brewing workshops, and barista training sessions to deepen your coffee knowledge.",
    image:
      "https://images.unsplash.com/photo-1586848384751-aa8f7ee302c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nfGVufDF8fHx8MTc1NTg2ODM4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Coffee brewing demonstration at a workshop",
  },
  {
    icon: Award,
    title: "Roasted Beans",
    description:
      "Take home our award-winning coffee beans, roasted fresh daily in small batches for maximum flavor and freshness.",
    image:
      "https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzU1ODE4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Freshly roasted coffee beans",
  },
];

export function Offerings() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const handleAddToCart = (title: string) => {
    setLoadingStates((prev) => ({ ...prev, [title]: true }));

    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [title]: false }));
      toast.success(`${title} added to cart!`, {
        description: "View your cart to proceed to checkout",
      });
    }, 1000);
  };

  return (
    <section id="offerings" className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-medium mb-4">Our Offerings</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            Discover what makes Brew & Bean your perfect coffee destination
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {offerings.map((offering) => {
            const Icon = offering.icon;
            const isLoading = loadingStates[offering.title];

            return (
              <Card
                key={offering.title}
                className="text-center hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <CardHeader className="flex-none">
                  <div className="mx-auto mb-4 h-48 w-full overflow-hidden rounded-lg">
                    <ImageWithFallback
                      src={offering.image}
                      alt={offering.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-medium">
                    {offering.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <CardDescription className="mb-6 font-normal leading-relaxed text-left">
                    {offering.description}
                  </CardDescription>
                  <Button
                    className="w-full font-medium"
                    onClick={() => handleAddToCart(offering.title)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
