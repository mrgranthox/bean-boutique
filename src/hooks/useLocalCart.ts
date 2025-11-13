import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  added_at: string;
}

interface Cart {
  items: CartItem[];
  total: number;
  updated_at: string;
}

const CART_STORAGE_KEY = "bean_boutique_cart";

// Helper function to load cart from localStorage
function loadCartFromStorage(): Cart {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const cart = JSON.parse(stored);
      return cart;
    }
  } catch (error) {
    // console.error('Error loading cart from localStorage:', error);
  }
  return { items: [], total: 0, updated_at: new Date().toISOString() };
}

// Helper function to save cart to localStorage
function saveCartToStorage(cart: Cart): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    // console.error('Error saving cart to localStorage:', error);
  }
}

export function useLocalCart(user: any = null) {
  const [cart, setCart] = useState<Cart>(() => loadCartFromStorage());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Clear cart when user signs out
  useEffect(() => {
    if (!user) {
      // Keep the cart in localStorage even when signed out
      // This allows users to add items before signing in
      //console.log('User signed out, cart persisted in localStorage');
    }
  }, [user]);

  // Add item to cart
  const addToCart = async (
    productOrId: string | any,
    quantity: number = 1
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Extract product details
      let productId: string;
      let productName: string;
      let productPrice: number;
      let productImage: string;

      if (typeof productOrId === "object" && productOrId !== null) {
        // Product object passed
        productId = productOrId.id;
        productName = productOrId.name || "Product";
        productPrice = productOrId.price || 0;
        productImage = productOrId.image || "";
      } else if (typeof productOrId === "string") {
        // Just ID passed - need to fetch product details
        productId = productOrId;

        // Try to get product info from data-manager or show error
        const { dataManager } = await import("../utils/data-manager");
        try {
          const response = await dataManager.getProduct(productId);
          if (response.product) {
            productName = response.product.name;
            productPrice = response.product.price;
            productImage = response.product.image;
          } else {
            throw new Error("Product not found");
          }
        } catch (err) {
          // console.error('Failed to fetch product details:', err);
          toast.error("Unable to add item: Product information not available");
          return false;
        }
      } else {
        //console.error('Invalid product data:', productOrId);
        toast.error("Invalid product");
        return false;
      }

      if (!productId) {
        // console.error('useLocalCart: Invalid product ID:', productOrId);
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

      setCart((prevCart) => {
        const updatedCart = { ...prevCart };
        const existingIndex = updatedCart.items.findIndex(
          (item) => item.productId === productId
        );

        if (existingIndex >= 0) {
          // Update existing item quantity
          updatedCart.items[existingIndex].quantity += quantity;
          updatedCart.items[existingIndex].added_at = new Date().toISOString();
        } else {
          // Add new item
          updatedCart.items.push(newItem);
        }

        // Recalculate total
        updatedCart.total = updatedCart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        updatedCart.updated_at = new Date().toISOString();

        return updatedCart;
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add item to cart";
      setError(errorMessage);
      // console.error('Add to cart error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (
    productId: string,
    quantity: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (quantity < 1) {
        toast.error("Quantity must be at least 1");
        return false;
      }

      setCart((prevCart) => {
        const updatedCart = { ...prevCart };
        const itemIndex = updatedCart.items.findIndex(
          (item) => item.productId === productId
        );

        if (itemIndex >= 0) {
          updatedCart.items[itemIndex].quantity = quantity;
          updatedCart.items[itemIndex].added_at = new Date().toISOString();

          // Recalculate total
          updatedCart.total = updatedCart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          updatedCart.updated_at = new Date().toISOString();
        }

        return updatedCart;
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update cart";
      setError(errorMessage);
      //console.error('Update cart error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      setCart((prevCart) => {
        const updatedCart = { ...prevCart };
        updatedCart.items = updatedCart.items.filter(
          (item) => item.productId !== productId
        );

        // Recalculate total
        updatedCart.total = updatedCart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        updatedCart.updated_at = new Date().toISOString();

        return updatedCart;
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove item";
      setError(errorMessage);
      // console.error('Remove from cart error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = () => {
    const emptyCart = {
      items: [],
      total: 0,
      updated_at: new Date().toISOString(),
    };
    setCart(emptyCart);
    saveCartToStorage(emptyCart);
  };

  // Refresh cart (reload from localStorage)
  const refreshCart = async () => {
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
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };
}
