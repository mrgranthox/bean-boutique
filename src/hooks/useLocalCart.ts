import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  added_at: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  updated_at: string;
}

const CART_STORAGE_KEY = "bean_boutique_cart";

// Load cart from localStorage
function loadCartFromStorage(): Cart {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { items: [], total: 0, updated_at: new Date().toISOString() };
}

// Save cart to localStorage
function saveCartToStorage(cart: Cart): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

export function useLocalCart(user: any = null) {
  const [cart, setCart] = useState<Cart>(() => loadCartFromStorage());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist cart to localStorage on change
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Add item to cart
  const addToCart = async (
    productOrId: string | any,
    quantity = 1
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      let productId: string;
      let productName = "Product";
      let productPrice = 0;
      let productImage = "";

      if (typeof productOrId === "object" && productOrId !== null) {
        productId = productOrId.id;
        productName = productOrId.name || productName;
        productPrice = productOrId.price || 0;
        productImage = productOrId.image || "";
      } else if (typeof productOrId === "string") {
        productId = productOrId;
      } else {
        toast.error("Invalid product");
        return false;
      }

      const newItem: CartItem = {
        productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity,
        added_at: new Date().toISOString(),
      };

      // Optimistic update: add immediately
      setCart((prevCart) => {
        const updated = { ...prevCart };
        const existingIndex = updated.items.findIndex(
          (item) => item.productId === productId
        );

        if (existingIndex >= 0) {
          updated.items[existingIndex].quantity += quantity;
          updated.items[existingIndex].added_at = new Date().toISOString();
        } else {
          updated.items.push(newItem);
        }

        updated.total = updated.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        updated.updated_at = new Date().toISOString();
        return updated;
      });

      // If ID only, fetch product info asynchronously
      if (typeof productOrId === "string") {
        const { dataManager } = await import("../utils/data-manager");
        try {
          const response = await dataManager.getProduct(productId);
          if (response.product) {
            setCart((prevCart) => {
              const updated = { ...prevCart };
              const idx = updated.items.findIndex(
                (i) => i.productId === productId
              );
              if (idx >= 0) {
                updated.items[idx].name = response.product.name;
                updated.items[idx].price = response.product.price;
                updated.items[idx].image = response.product.image;
                updated.total = updated.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );
              }
              return updated;
            });
          }
        } catch {
          toast.error("Unable to fetch product info");
        }
      }

      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to add item to cart";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add this inside useLocalCart, alongside addToCart
  const addSubscriptionToCart = async (plan: {
    id: string;
    name: string;
    price: number;
    interval: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      if (!plan || !plan.id) {
        toast.error("Invalid subscription plan");
        return false;
      }

      // Create a unique ID for subscription in cart (prefix to avoid collisions)
      const productId = `sub_${plan.id}`;

      const newItem: CartItem = {
        productId,
        name: `${plan.name} (${plan.interval})`,
        price: plan.price,
        image: "", // Optional: you can set a default subscription image
        quantity: 1,
        added_at: new Date().toISOString(),
      };

      setCart((prevCart) => {
        const updated = { ...prevCart };
        const existingIndex = updated.items.findIndex(
          (item) => item.productId === productId
        );

        if (existingIndex >= 0) {
          updated.items[existingIndex].quantity += 1;
          updated.items[existingIndex].added_at = new Date().toISOString();
        } else {
          updated.items.push(newItem);
        }

        updated.total = updated.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        updated.updated_at = new Date().toISOString();
        return updated;
      });

      toast.success(`Added ${plan.name} to cart`);
      return true;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to add subscription to cart";
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (
    productId: string,
    quantity: number
  ): Promise<boolean> => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return false;
    }

    try {
      setLoading(true);
      setCart((prevCart) => {
        const updated = { ...prevCart };
        const idx = updated.items.findIndex((i) => i.productId === productId);
        if (idx >= 0) {
          updated.items[idx].quantity = quantity;
          updated.items[idx].added_at = new Date().toISOString();
          updated.total = updated.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          updated.updated_at = new Date().toISOString();
        }
        return updated;
      });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update cart";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const removeItem = async (productId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setCart((prevCart) => {
        const updated = { ...prevCart };
        updated.items = updated.items.filter((i) => i.productId !== productId);
        updated.total = updated.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        updated.updated_at = new Date().toISOString();
        return updated;
      });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to remove item";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    const emptyCart: Cart = {
      items: [],
      total: 0,
      updated_at: new Date().toISOString(),
    };
    setCart(emptyCart);
    saveCartToStorage(emptyCart);
  };

  // Refresh cart from localStorage
  const refreshCart = () => {
    const storedCart = loadCartFromStorage();
    setCart(storedCart);
  };

  const cartItemCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return {
    cart,
    cartItemCount,
    loading,
    error,
    addToCart,
    addSubscriptionToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };
}
