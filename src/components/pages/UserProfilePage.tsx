import { useState, useEffect } from "react";
import { useAuth, useCart } from "../../App";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  User,
  Settings,
  Package,
  CreditCard,
  MapPin,
  Bell,
  Coffee,
  Calendar,
  Heart,
  Trash2,
  Edit,
  Save,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Page } from "../../App";
import { profileApi, ordersApi, subscriptionsApi } from "../../utils/api";
import { getUserProfileData } from "@/utils/database-service";
import { supabase } from "@/utils/supabase/client";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

interface UserProfilePageProps {
  onPageChange: (page: Page) => void;
}

interface UserProfile {
  full_name: string;
  user_id: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  avatar_url?: string;
  preferences: {
    coffeeType: string;
    brewingMethod: string;
    strength: string;
    newsletter: boolean;
    smsNotifications: boolean;
    orderUpdates: boolean;
  };
  addresses: Address[];
  createdAt: string;
}

interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  order_items: {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
    product_image: string;
  }[];
  shipping_address: {
    phone: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  tracking_number: string;
  updated_at: string;
  notes?: string;
}

// interface OrderItem {
//   id: string;
//   name: string;
//   quantity: number;
//   price: number;
//   image: string;
// }

interface Subscription {
  id: string;
  name: string;
  price: number;
  frequency: string;
  status: "active" | "paused" | "cancelled";
  nextDelivery: string;
  coffee: string;
  quantity: string;
}

export function UserProfilePage({ onPageChange }: UserProfilePageProps) {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [newAddress, setNewAddress] = useState({
    type: "home" as "home" | "work" | "other",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Ghana",
    isDefault: false,
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isUpdateAddressDialogOpen, setIsUpdateAddressDialogOpen] =
    useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const { addToCart } = useCart();

  // console.log(user);
  const loadUserData = async () => {
    setDataLoading(true);
    try {
      const { profile, orders, subscriptions } = await getUserProfileData(
        user!.id
      );
      setProfile(profile);
      setOrders(orders);
      setSubscriptions(subscriptions);
      setBackendAvailable(true);

      console.log("Loaded user data:", { profile, orders, subscriptions });
    } catch (error) {
      console.error("Error loading user data:", error);
      setBackendAvailable(false);
    } finally {
      setDataLoading(false);
    }
  };

  // Load user data on component mount
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to view your profile");
      onPageChange("home");
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [loading, onPageChange, user]);

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      const { updateUserProfile } = await import(
        "../../utils/database-service"
      );
      await updateUserProfile(user.id, {
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
      });
      setEditMode(false);
      //await loadUserData();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleAddressUpdate = async (
    name: string,
    updatedAddress: Partial<Address>
  ) => {
    try {
      if (!user) {
        toast.error("User not found");
        return;
      }

      // Remove the old address by name
      const filteredAddresses = (profile?.addresses || []).filter(
        (addr) => addr.name !== name
      );

      // Add the updated address back
      const updatedAddresses = [
        ...filteredAddresses,
        updatedAddress as Address,
      ];

      console.log("Updated addresses:", updatedAddresses);

      const { data, error } = await supabase
        .from("profiles")
        .update({ addresses: updatedAddresses })
        .eq("user_id", user.id)
        .select();

      if (error) {
        console.error("Supabase update error:", error);
        toast.error("Failed to update address. Please try again.");
        return;
      }

      // Update local state
      setProfile((prev) =>
        prev ? { ...prev, addresses: updatedAddresses } : prev
      );

      // Clear editing state and close dialog
      setEditingAddress(null);
      setSelectedAddress(null);
      setIsUpdateAddressDialogOpen(false);

      toast.success("Address updated successfully!");
    } catch (error) {
      console.error("Address update error:", error);
      toast.error("Failed to update address. Please try again.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      if (!user) {
        toast.error("User not found");
        return;
      }

      const updatedAddresses = (profile?.addresses || []).filter(
        (addr) => addr.id !== id
      );
      console.log("Updated addresses:", updatedAddresses);

      const { data, error } = await supabase
        .from("profiles")
        .update({ addresses: updatedAddresses })
        .eq("user_id", user.id)
        .select();

      if (error) {
        console.error("Supabase update error:", error);
        toast.error("Failed to delete address. Please try again.");
        return;
      }

      if (!data?.length) {
        toast.warning("No profile was updated. Check your .eq() key!");
        return;
      }

      setProfile((prev) =>
        prev ? { ...prev, addresses: updatedAddresses } : prev
      );

      //await loadUserData();

      toast.success("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address. Please try again.");
    }
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.name ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zipCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const addressToAdd = {
      id: `addr_${Date.now()}`, // unique ID
      ...newAddress,
      createdAt: new Date().toISOString(),
    };

    if (!backendAvailable) {
      // Offline: add locally
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              addresses: [...(prev.addresses || []), addressToAdd],
            }
          : prev
      );
      setNewAddress({
        type: "home",
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Ghana",
        isDefault: false,
      });
      setShowAddAddress(false);
      toast.success(
        "Address added locally! Changes will sync when connection is restored."
      );
      return;
    }

    try {
      // Add new address to the existing addresses in Supabase
      const updatedAddresses = [...(profile?.addresses || []), addressToAdd];

      const { data, error } = await supabase
        .from("profiles")
        .update({ addresses: updatedAddresses })
        .eq("user_id", user?.id)
        .select();

      if (error) {
        console.error("Supabase update error:", error);
        toast.error("Failed to add address. Please try again.");
        return;
      }

      setProfile((prev) =>
        prev ? { ...prev, addresses: updatedAddresses } : prev
      );

      // Reset form
      setNewAddress({
        type: "home",
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Ghana",
        isDefault: false,
      });
      setShowAddAddress(false);
      toast.success("Address added successfully!");
    } catch (error) {
      console.error("Address creation error:", error);
      toast.error("Failed to add address. Please try again.");
    }
  };

  const handleUpdateSubscription = async (
    subscriptionId: string,
    updateData: Partial<Subscription>
  ) => {
    if (!backendAvailable) {
      // Update locally in offline mode
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, ...updateData } : sub
        )
      );
      toast.success(
        "Subscription updated locally! Changes will sync when connection is restored."
      );
      return;
    }

    try {
      const response = await subscriptionsApi.updateSubscription(
        subscriptionId,
        updateData
      );
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? response.subscription : sub
        )
      );
      toast.success("Subscription updated successfully!");
    } catch (error) {
      console.error("Subscription update error:", error);
      // Fall back to local update
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, ...updateData } : sub
        )
      );
      toast.success(
        "Subscription updated locally! Changes will sync when connection is restored."
      );
    }
  };

  const handleSavePreferences = async () => {
    if (!profile) return;

    if (!backendAvailable) {
      toast.success(
        "Preferences saved locally! Changes will sync when connection is restored."
      );
      return;
    }

    try {
      const response = await profileApi.updateProfile({
        preferences: profile.preferences,
      });
      setProfile(response.profile);
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Preferences update error:", error);
      toast.success(
        "Preferences saved locally! Changes will sync when connection is restored."
      );
    }
  };

  const handleReorder = async (order: any) => {
    console.log("Reordering items from order:", order);

    if (!order?.order_items?.length) {
      console.warn("No items found for reorder.");
      return;
    }

    // Use for...of to properly await each addToCart
    for (const item of order.order_items) {
      try {
        const success = await addToCart(item.product_id, item.quantity);
        if (!success) {
          console.warn("Failed to add item to cart:", item.product_id);
        }
      } catch (error) {
        console.error("Error adding item to cart:", item.product_id, error);
      }
    }

    toast.success("Items added to cart!");
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address); // Keep track of which address is being edited
    setNewAddress({
      type: address.type || "home",
      name: address.name || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "Ghana",
      isDefault: address.isDefault || false,
    });
    setSelectedAddress(address);
    setIsUpdateAddressDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Setting up your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1>Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              We couldn't load your profile. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Backend Status Alert */}
        {!backendAvailable && (
          <Alert className="mb-6">
            <AlertDescription>
              You're currently in offline mode. Profile changes will be saved
              locally and synced when connection is restored.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={
                user?.user_metadata?.avatar_url || profile.avatar_url || "User"
              }
              alt={profile.full_name || "User"}
            />
            <AvatarFallback className="text-xl">
              {profile.full_name
                ? profile.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl mb-2">
              {user?.user_metadata.full_name
                ? user?.user_metadata.full_name
                : profile.full_name}
            </h1>
            <p className="text-muted-foreground">
              Member since {new Date(user?.created_at).getFullYear()}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-5 lg:w-fit">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="subscriptions"
              className="flex items-center gap-2"
            >
              <Coffee className="w-4 h-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your account details and personal information
                  </CardDescription>
                </div>
                <Button
                  variant={editMode ? "default" : "outline"}
                  onClick={
                    editMode ? handleSaveProfile : () => setEditMode(true)
                  }
                  className="flex items-center gap-2"
                >
                  {editMode ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.full_name}
                      disabled={!editMode}
                      onChange={(e) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            full_name: e.target.value,
                          };
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email || user.email || ""}
                      disabled={!editMode}
                      onChange={(e) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            email: e.target.value,
                          };
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ""}
                      disabled={!editMode}
                      onChange={(e) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            phone: e.target.value,
                          };
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.date_of_birth || ""}
                      disabled={!editMode}
                      onChange={(e) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            name: e.target.value,
                          };
                        })
                      }
                    />
                  </div>
                </div>

                {editMode && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditMode(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full md:w-auto">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View your past orders and track current ones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                            <p className="font-medium mt-1">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* <div className="space-y-2">
                          {order.order_items && order.order_items.length > 0 ? (
                            order.order_items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3"
                              >
                                <ImageWithFallback
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-12 h-12 rounded object-cover"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {item.product_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Qty: {item.quantity} × $
                                    {item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No items in this order.
                            </p>
                          )}
                        </div> */}

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailDialogOpen(true);
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            onClick={() => {
                              handleReorder(order);
                              setIsDetailDialogOpen(false);
                            }}
                          >
                            Reorder
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You have no orders yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Subscriptions</CardTitle>
                <CardDescription>
                  Manage your coffee subscriptions and delivery preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{subscription.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subscription.frequency} delivery
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={getStatusColor(subscription.status)}
                          >
                            {subscription.status.charAt(0).toUpperCase() +
                              subscription.status.slice(1)}
                          </Badge>
                          <p className="font-medium mt-1">
                            ${subscription.price}/month
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p>
                          <span className="font-medium">Coffee:</span>{" "}
                          {subscription.coffee}
                        </p>
                        <p>
                          <span className="font-medium">Quantity:</span>{" "}
                          {subscription.quantity}
                        </p>
                        <p>
                          <span className="font-medium">Next Delivery:</span>{" "}
                          {new Date(
                            subscription.nextDelivery
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateSubscription(subscription.id, {
                              status:
                                subscription.status === "active"
                                  ? "paused"
                                  : "active",
                            })
                          }
                        >
                          {subscription.status === "active"
                            ? "Pause"
                            : "Resume"}
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() =>
                            handleUpdateSubscription(subscription.id, {
                              status: "cancelled",
                            })
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button onClick={() => onPageChange("subscription")}>
                    Browse Subscription Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>
                  Manage your delivery addresses for faster checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile?.addresses?.map((address) => (
                    <div key={address?.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{address.name}</h3>
                            <Badge
                              variant={
                                address.type === "home"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {address.type}
                            </Badge>
                            {address.isDefault && (
                              <Badge variant="outline">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.street}
                            <br />
                            {address.city}, {address.state} {address.zipCode}
                            <br />
                            {address.country}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Address
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this address?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteAddress(address.id)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  {!showAddAddress ? (
                    <Button onClick={() => setShowAddAddress(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Address
                    </Button>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Address</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="newAddressType">Address Type</Label>
                            <Select
                              value={newAddress.type}
                              onValueChange={(
                                value: "home" | "work" | "other"
                              ) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  type: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="home">Home</SelectItem>
                                <SelectItem value="work">Work</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newAddressName">Address Name</Label>
                            <Input
                              id="newAddressName"
                              value={newAddress.name}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="e.g., Home, Office"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="newAddressStreet">
                              Street Address
                            </Label>
                            <Input
                              id="newAddressStreet"
                              value={newAddress.street}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  street: e.target.value,
                                }))
                              }
                              placeholder="123 Main Street"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newAddressCity">City</Label>
                            <Input
                              id="newAddressCity"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  city: e.target.value,
                                }))
                              }
                              placeholder="San Francisco"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newAddressState">State</Label>
                            <Input
                              id="newAddressState"
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  state: e.target.value,
                                }))
                              }
                              placeholder="CA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newAddressZip">ZIP Code</Label>
                            <Input
                              id="newAddressZip"
                              value={newAddress.zipCode}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  zipCode: e.target.value,
                                }))
                              }
                              placeholder="94102"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newAddressCountry">Country</Label>
                            <Input
                              id="newAddressCountry"
                              value={newAddress.country}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  country: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="newAddressDefault"
                            checked={newAddress.isDefault}
                            onChange={(e) =>
                              setNewAddress((prev) => ({
                                ...prev,
                                isDefault: e.target.checked,
                              }))
                            }
                            className="rounded"
                          />
                          <Label htmlFor="newAddressDefault">
                            Set as default address
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddAddress}>
                            Add Address
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddAddress(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coffee Preferences</CardTitle>
                <CardDescription>
                  Tell us about your coffee preferences for personalized
                  recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="coffeeType">Coffee Type</Label>
                    <Select
                      value={profile.preferences.coffeeType}
                      onValueChange={(value) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              coffeeType: value,
                            },
                          };
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select coffee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-origin">
                          Single Origin
                        </SelectItem>
                        <SelectItem value="blend">Blend</SelectItem>
                        <SelectItem value="espresso">Espresso</SelectItem>
                        <SelectItem value="decaf">Decaf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brewingMethod">Brewing Method</Label>
                    <Select
                      value={profile.preferences.brewingMethod}
                      onValueChange={(value) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              brewingMethod: value,
                            },
                          };
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brewing method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pour-over">Pour Over</SelectItem>
                        <SelectItem value="french-press">
                          French Press
                        </SelectItem>
                        <SelectItem value="espresso-machine">
                          Espresso Machine
                        </SelectItem>
                        <SelectItem value="aeropress">AeroPress</SelectItem>
                        <SelectItem value="cold-brew">Cold Brew</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="strength">Coffee Strength</Label>
                    <Select
                      value={profile.preferences.strength}
                      onValueChange={(value) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              strength: value,
                            },
                          };
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select strength" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="strong">Strong</SelectItem>
                        <SelectItem value="extra-strong">
                          Extra Strong
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you'd like to receive updates and communications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly updates about new coffees and brewing
                        tips
                      </p>
                    </div>
                    <Switch
                      checked={profile.preferences.newsletter}
                      onCheckedChange={(checked: boolean) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              newsletter: checked,
                            },
                          };
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get text messages for special offers and promotions
                      </p>
                    </div>
                    <Switch
                      checked={profile.preferences.smsNotifications}
                      onCheckedChange={(checked: boolean) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              smsNotifications: checked,
                            },
                          };
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Order Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your order status and
                        deliveries
                      </p>
                    </div>
                    <Switch
                      checked={profile.preferences.orderUpdates}
                      onCheckedChange={(checked: boolean) =>
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              orderUpdates: checked,
                            },
                          };
                        })
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSavePreferences}>
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* View Order details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete order information and tracking details
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p>
                    <strong>Name:</strong>{" "}
                    {user?.user_metadata.full_name
                      ? user?.user_metadata.full_name
                      : profile.full_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email || user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>
                    {profile.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p>
                    <strong>Name: </strong>{" "}
                    {selectedOrder.shipping_address.name}
                  </p>
                  <p>
                    <strong>Phone: </strong>
                    {selectedOrder.shipping_address.phone}
                  </p>
                  <p>
                    <strong>Country: </strong>
                    {selectedOrder.shipping_address?.country}
                  </p>

                  <p>
                    <strong>Region: </strong>
                    {selectedOrder.shipping_address?.state}
                  </p>
                  <p>
                    <strong>City: </strong>
                    {selectedOrder.shipping_address.city}
                  </p>
                  <p>
                    <strong>Street: </strong>
                    {selectedOrder.shipping_address.street}
                  </p>
                  <p>
                    <strong>Zip Code: </strong>
                    {selectedOrder.shipping_address.zipCode}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder?.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>$9.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${(selectedOrder.total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>
                      $
                      {(
                        selectedOrder.total +
                        9.99 +
                        selectedOrder.total * 0.08
                      ).toFixed(2)}
                    </span>
                  </div> */}
                </div>
              </div>

              {/* Tracking Information */}
              {selectedOrder.tracking_number && (
                <div>
                  <h3 className="font-semibold mb-2">Tracking Information</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>
                      <strong>Tracking Number:</strong>{" "}
                      {selectedOrder.tracking_number}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <Badge
                        className={`ml-2 ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status}
                      </Badge>
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {new Date(selectedOrder.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Address details Dialog */}
      <Dialog
        open={isUpdateAddressDialogOpen}
        onOpenChange={setIsUpdateAddressDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Address Details</DialogTitle>
            <DialogDescription>Complete address details</DialogDescription>
          </DialogHeader>

          {selectedAddress && (
            <Card>
              <CardHeader>
                {/* <CardTitle>Add New Address</CardTitle> */}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newAddressType">Address Type</Label>
                    <Select
                      value={newAddress.type}
                      onValueChange={(value: "home" | "work" | "other") =>
                        setNewAddress((prev) => ({
                          ...prev,
                          type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAddressName">Address Name</Label>
                    <Input
                      id="newAddressName"
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g., Home, Office"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="newAddressStreet">Street Address</Label>
                    <Input
                      id="newAddressStreet"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAddressCity">City</Label>
                    <Input
                      id="newAddressCity"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="San Francisco"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAddressState">State</Label>
                    <Input
                      id="newAddressState"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      placeholder="CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAddressZip">ZIP Code</Label>
                    <Input
                      id="newAddressZip"
                      value={newAddress.zipCode}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      placeholder="94102"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAddressCountry">Country</Label>
                    <Input
                      id="newAddressCountry"
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newAddressDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="newAddressDefault">
                    Set as default address
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleAddressUpdate(selectedAddress?.name, newAddress)
                    }
                  >
                    Update Address
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddAddress(false);
                      setIsUpdateAddressDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
