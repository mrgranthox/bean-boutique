import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      toast.success("Successfully subscribed!", {
        description:
          "Welcome to the Brew & Bean family. Check your email for a welcome offer!",
      });
      setEmail("");
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <section className="py-24 bg-primary/5">
        <div className="container px-4 mx-auto">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-700 font-medium">
                You're All Set!
              </CardTitle>
              <CardDescription className="font-normal leading-relaxed">
                Thank you for subscribing. You'll receive our latest updates and
                special offers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-primary/5">
      <div className="container px-4 mx-auto">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-medium">Stay Connected</CardTitle>
            <CardDescription className="font-normal leading-relaxed">
              Subscribe to our newsletter for exclusive offers, new menu items,
              and coffee tips.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full font-normal"
                aria-label="Email address for newsletter subscription"
              />
              <Button
                type="submit"
                className="w-full font-medium"
                disabled={isLoading || !email}
              >
                {isLoading ? "Subscribing..." : "Sign Up"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center font-normal leading-relaxed">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
