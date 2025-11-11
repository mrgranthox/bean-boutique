import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Plus,
  Edit,
  Trash2,
  CreditCard,
  Package,
  Calendar,
  Search,
  Filter,
  User,
  Coffee,
} from "lucide-react";
import { toast } from "sonner";
import { get } from "http";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "weekly" | "monthly" | "quarterly";
  features: string[];
  coffee_quantity: number; // oz per shipment
  is_active: boolean;
  featured: boolean;
  createdAt: string;
}

interface Subscription {
  users: any;
  id: string;
  user_id: string;
  customerName: string;
  customerEmail: string;
  plan_id: string;
  plan_name: string;
  status: "active" | "paused" | "cancelled" | "expired";
  start_date: string;
  nextDelivery: string;
  price: number;
  preferences: {
    roastLevel?: "light" | "medium" | "dark" | "mixed";
    grindType?: "whole-bean" | "coarse" | "medium" | "fine";
    deliveryNotes?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

export function AdminSubscriptionManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"plans" | "subscriptions">(
    "plans"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Subscription["status"]
  >("all");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [planFormData, setPlanFormData] = useState<Partial<SubscriptionPlan>>({
    name: "",
    description: "",
    price: 0,
    interval: "monthly",
    features: [],
    coffee_quantity: 12,
    is_active: true,
    featured: false,
  });

  useEffect(() => {
    loadData();
    loadPlans();
  }, [subscriptions.length, plans.length]);

  const loadData = async () => {
    try {
      setLoading(true);

      const { getAllSubscriptions } = await import("../../../utils/admin-db");
      await getAllSubscriptions().then((data) => {
        setSubscriptions(data);
      });
      console.log("Subscriptions data loaded:", subscriptions);
    } catch (error) {
      console.error("Failed to load subscription data:", error);
      setPlans([]);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriptionStatus = async (
    subscriptionId: string,
    newStatus: Subscription["status"]
  ) => {
    try {
      const { updateSubscription } = await import("../../../utils/admin-db");
      const data = await updateSubscription(subscriptionId, {
        status: newStatus,
      });

      console.log("Subscription status updated:", data);
      toast.success("Subscription status updated");
      await loadData();
    } catch (error) {
      console.error("Failed to update subscription status:", error);
      toast.error("Failed to update subscription status");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const { deleteSubscriptionPlan } = await import(
        "../../../utils/admin-db"
      );
      await deleteSubscriptionPlan(planId);
      console.log("Subscription plan deleted:", planId);
      toast.success("Subscription plan deleted");
      await loadPlans();
    } catch (error) {
      console.error("Failed to delete plan:", error);
      toast.error("Failed to delete plan");
    }
  };

  const loadPlans = async () => {
    try {
      const { getAllSubscriptionPlans } = await import(
        "../../../utils/admin-db"
      );
      const data = await getAllSubscriptionPlans();
      setPlans(data);
      console.log("Subscription plans loaded:", plans);
    } catch (error) {
      console.error("Failed to load subscription plans:", error);
      setPlans([]);
    }
  };

  const handleSavePlan = async () => {
    try {
      const { createSubscriptionPlan, updateSubscriptionPlan } = await import(
        "../../../utils/admin-db"
      );

      if (isEditing && selectedPlan) {
        // Update existing plan
        const data = await updateSubscriptionPlan(selectedPlan.id, {
          ...planFormData,
        });
        console.log("Subscription plan updated:", data);
        toast.success("Subscription plan updated");
      } else {
        // Create new plan
        const data = await createSubscriptionPlan({
          ...planFormData,
        } as SubscriptionPlan);
        console.log("Subscription plan created:", data);
        toast.success("Subscription plan created");
      }

      setIsDialogOpen(false);
      await loadPlans();
    } catch (error) {
      console.error("Failed to save subscription plan:", error);
      toast.error("Failed to save subscription plan");
    }
  };

  const resetPlanForm = () => {
    setPlanFormData({
      name: "",
      description: "",
      price: 0,
      interval: "monthly",
      features: [],
      coffee_quantity: 12,
      is_active: true,
      featured: false,
    });
    setSelectedPlan(null);
    setIsEditing(false);
  };

  const openEditPlanDialog = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPlanFormData({ ...plan });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openCreatePlanDialog = () => {
    resetPlanForm();
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const search = searchQuery?.toLowerCase() || "";

    const customerName = subscription?.customerName?.toLowerCase() || "";
    const customerEmail = subscription?.customerEmail?.toLowerCase() || "";
    const planName = subscription?.plan_name?.toLowerCase() || "";

    const matchesSearch =
      customerName.includes(search) ||
      customerEmail.includes(search) ||
      planName.includes(search);

    const matchesStatus =
      statusFilter === "all" || subscription?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-coffee-dark">
            Subscription Management
          </h2>
          <p className="text-muted-foreground">
            Manage subscription plans and customer subscriptions
          </p>
        </div>
        {activeTab === "plans" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreatePlanDialog}
                className="bg-coffee-dark hover:bg-coffee-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditing
                    ? "Edit Subscription Plan"
                    : "Add New Subscription Plan"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update plan information"
                    : "Create a new subscription plan for customers"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                      id="name"
                      value={planFormData.name}
                      onChange={(e) =>
                        setPlanFormData({
                          ...planFormData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter plan name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interval">Billing Interval</Label>
                    <Select
                      value={planFormData.interval}
                      onValueChange={(value: SubscriptionPlan["interval"]) =>
                        setPlanFormData({ ...planFormData, interval: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={planFormData.description}
                    onChange={(e) =>
                      setPlanFormData({
                        ...planFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter plan description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={planFormData.price}
                      onChange={(e) =>
                        setPlanFormData({
                          ...planFormData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coffeeQuantity">Coffee Quantity (oz)</Label>
                    <Input
                      id="coffeeQuantity"
                      type="number"
                      value={planFormData.coffee_quantity}
                      onChange={(e) =>
                        setPlanFormData({
                          ...planFormData,
                          coffee_quantity: parseInt(e.target.value) || 12,
                        })
                      }
                      placeholder="12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Textarea
                    id="features"
                    value={planFormData.features?.join(", ") || ""}
                    onChange={(e) =>
                      setPlanFormData({
                        ...planFormData,
                        features: e.target.value
                          .split(",")
                          .map((feature) => feature.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="e.g., Free shipping, Pause anytime, Tasting notes"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={planFormData.is_active}
                      onChange={(e) =>
                        setPlanFormData({
                          ...planFormData,
                          is_active: e.target.checked,
                        })
                      }
                    />
                    <Label htmlFor="isActive">Active Plan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={planFormData.featured}
                      onChange={(e) =>
                        setPlanFormData({
                          ...planFormData,
                          featured: e.target.checked,
                        })
                      }
                    />
                    <Label htmlFor="featured">Featured Plan</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePlan}
                  className="bg-coffee-dark hover:bg-coffee-medium"
                >
                  {isEditing ? "Update Plan" : "Create Plan"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "plans" ? "default" : "ghost"}
          onClick={() => setActiveTab("plans")}
          className="px-4 py-2"
        >
          <Package className="w-4 h-4 mr-2" />
          Plans ({plans.length})
        </Button>
        <Button
          variant={activeTab === "subscriptions" ? "default" : "ghost"}
          onClick={() => setActiveTab("subscriptions")}
          className="px-4 py-2"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Subscriptions ({subscriptions.length})
        </Button>
      </div>

      {activeTab === "plans" ? (
        /* Subscription Plans */
        <div className="space-y-6">
          {/* Plans Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Plans</p>
                    <p className="text-xl font-bold">{plans.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Coffee className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Plans
                    </p>
                    <p className="text-xl font-bold">
                      {plans.filter((p) => p.is_active).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Featured Plans
                    </p>
                    <p className="text-xl font-bold">
                      {plans.filter((p) => p.featured).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>
                Manage available subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Interval</TableHead>
                    <TableHead>Coffee Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{plan.name}</p>
                            {plan.featured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {plan.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${plan.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {plan.interval}
                      </TableCell>
                      <TableCell>{plan.coffee_quantity}oz</TableCell>
                      <TableCell>
                        <Badge
                          variant={plan.is_active ? "default" : "secondary"}
                        >
                          {plan.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditPlanDialog(plan)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Active Subscriptions */
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: typeof statusFilter) =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Subscriptions
                    </p>
                    <p className="text-xl font-bold">{subscriptions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-xl font-bold">
                      {
                        subscriptions.filter((s) => s.status === "active")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Paused</p>
                    <p className="text-xl font-bold">
                      {
                        subscriptions.filter((s) => s.status === "paused")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Shipments
                    </p>
                    <p className="text-xl font-bold">
                      {subscriptions.reduce((sum, s) => sum + s.price, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Active Subscriptions ({filteredSubscriptions.length})
              </CardTitle>
              <CardDescription>Manage customer subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Delivery</TableHead>
                    <TableHead>Shipments</TableHead>
                    <TableHead>Preferences</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {subscription.users.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {subscription.customerEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{subscription.plan_name}</TableCell>
                      <TableCell>
                        <Select
                          value={subscription.status}
                          onValueChange={(value: Subscription["status"]) =>
                            updateSubscriptionStatus(subscription.id, value)
                          }
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {new Date(
                          subscription.nextDelivery
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{subscription.price}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm capitalize">
                            {subscription.preferences?.roastLevel} roast
                          </p>
                          <p className="text-sm capitalize">
                            {subscription.preferences?.grindType?.replace(
                              "-",
                              " "
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
