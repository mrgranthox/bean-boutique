import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { auth } from "../utils/supabase/client";
import { useAuth, useCart } from "../App";
import { User, ShoppingCart, TestTube } from "lucide-react";

export function CartDebugHelper() {
  const { user, loading: authLoading } = useAuth();
  const {
    cart,
    cartItemCount,
    addToCart,
    loading: cartLoading,
    error: cartError,
  } = useCart();
  const [testEmail, setTestEmail] = useState("test@beanboutique.com");
  const [testPassword, setTestPassword] = useState("testpassword123");
  const [testing, setTesting] = useState(false);

  const createTestUser = async () => {
    setTesting(true);
    try {
      // Create test user
      const signUpResult = await auth.signUp(
        testEmail,
        testPassword,
        "Test User"
      );
      if (signUpResult.error) {
        // If user already exists, try to sign in
        const signInResult = await auth.signIn(testEmail, testPassword);
        if (signInResult.error) {
          toast.error(
            "Failed to create or sign in test user: " + signInResult.error
          );
          return;
        }
        toast.success("Signed in as test user");
      } else {
        toast.success("Test user created and signed in");
      }
    } catch (error: any) {
      toast.error("Error creating test user: " + error.message);
    } finally {
      setTesting(false);
    }
  };

  const testAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    setTesting(true);
    try {
      // Test adding a coffee product (using a valid ID from coffeeData.ts)
      const success = await addToCart("coffee-1", 1);
      if (success) {
        toast.success("Test item added to cart!");
      } else {
        toast.error("Failed to add test item to cart");
      }
    } catch (error: any) {
      toast.error("Error adding to cart: " + error.message);
    } finally {
      setTesting(false);
    }
  };

  if (authLoading) {
    return (
      <Card className="m-4">
        <CardContent className="p-4">
          <p>Loading authentication...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="m-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <TestTube className="h-5 w-5" />
          Cart Debug Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auth Status */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm">
            {user ? (
              <span className="text-green-600">
                Signed in as: {user.user_metadata?.name || user.email}
              </span>
            ) : (
              <span className="text-red-600">Not signed in</span>
            )}
          </span>
        </div>

        {/* Cart Status */}
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          <span className="text-sm">
            Cart: {cartItemCount} items
            {cartLoading && " (loading...)"}
            {cartError && (
              <span className="text-red-600"> - Error: {cartError}</span>
            )}
          </span>
        </div>

        <Separator />

        {/* Test User Creation */}
        {!user && (
          <div className="space-y-2">
            <Label>Create Test User</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
              />
            </div>
            <Button
              onClick={createTestUser}
              disabled={testing}
              size="sm"
              variant="outline"
            >
              {testing ? "Creating..." : "Create & Sign In Test User"}
            </Button>
          </div>
        )}

        {/* Test Cart */}
        {user && (
          <div className="space-y-2">
            <Label>Test Cart Functionality</Label>
            <Button
              onClick={testAddToCart}
              disabled={testing || cartLoading}
              size="sm"
              variant="outline"
            >
              {testing ? "Adding..." : "Add Test Item to Cart"}
            </Button>
          </div>
        )}

        {/* Cart Contents */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="space-y-2">
            <Label>Cart Contents ({cart.items.length} items)</Label>
            <div className="text-xs space-y-1 bg-white p-2 rounded border">
              {cart.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>
                    Qty: {item.quantity} × ${item.price}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${cart.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          This helper appears only in development to test cart functionality.
          You can remove it once everything is working properly.
        </div>
      </CardContent>
    </Card>
  );
}
