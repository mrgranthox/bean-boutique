import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Gift, X } from "lucide-react";
import { toast } from "sonner";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Welcome to Bean Boutique!", {
        description: "Your 15% discount code has been sent to your email.",
      });
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">
            Welcome to Bean Boutique!
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign up for our newsletter and get <strong>15% off</strong> your
            first order plus exclusive access to new arrivals and coffee tips.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="mt-2"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !email}
          >
            {isSubmitting ? "Signing Up..." : "Get My 15% Discount"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By signing up, you agree to receive marketing emails from Bean
            Boutique. You can unsubscribe at any time.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
