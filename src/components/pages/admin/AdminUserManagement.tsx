import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
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
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Users,
  UserPlus,
  Mail,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { log } from "console";

interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: "customer" | "admin" | "moderator";
  status: "active" | "inactive" | "banned";
  avatar?: string;
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    orderUpdates: boolean;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
    subscriptions: number;
  };
  createdAt: string;
  lastLoginAt?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | User["role"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | User["status"]>(
    "all"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const { getAllUsers } = await await import("../../../utils/admin-db");
      const data = await getAllUsers();
      console.log("Raw user data from database:", data);

      const mappedUsers: User[] = data.map((user: any) => {
        const profile = user.profiles || {};

        return {
          id: user.id,
          email: user.email,
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          role: user.role || "user",
          status: user.status || "active",
          avatar: profile.avatar_url || null,
          preferences: {
            newsletter: profile.preferences?.newsletter || false,
            promotions: profile.preferences?.promotions || false,
            orderUpdates: profile.preferences?.orderUpdates || false,
          },
          stats: {
            totalOrders: profile.stats?.totalOrders || 0,
            totalSpent: profile.stats?.totalSpent || 0,
            lastOrderDate: profile.stats?.lastOrderDate || undefined,
            subscriptions: profile.stats?.subscriptions || 0,
          },
          createdAt: user.created_at,
          lastLoginAt: user.last_login_at || undefined,
          address: profile.address
            ? {
                street: profile.address.street,
                city: profile.address.city,
                state: profile.address.state,
                zipCode: profile.address.zip_code,
                country: profile.address.country,
              }
            : undefined,
        };
      });

      console.log(
        "Loaded users from database:",
        mappedUsers.length,
        mappedUsers
      );

      setUsers(mappedUsers);

      if (mappedUsers.length === 0) {
        toast.info(
          "No products found. Please run MIGRATION.sql and SEED_DATA.sql in Supabase."
        );
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (
    userId: string,
    newStatus: User["status"]
  ) => {
    try {
      const { updateUserStatus } = await import("../../../utils/admin-db");
      const { data, error } = await updateUserStatus(
        userId,
        newStatus.toLowerCase()
      );

      if (error) {
        console.error(error);
        toast.error("Failed to update user status in database");
        return;
      }

      toast.success("User status updated successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const updateUserRole = async (userId: string, newRole: User["role"]) => {
    try {
      const { updateUserRole } = await import("../../../utils/admin-db");
      const { data, error } = await updateUserRole(
        userId,
        newRole.toLowerCase()
      );

      if (error) {
        console.error(error);
        toast.error("Failed to update user role in database");
        return;
      }

      toast.success("User role updated successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const sendEmailToUser = (userEmail: string, userName: string) => {
    // In a real app, this would trigger an email service
    toast.success(`Email dialog would open for ${userName} (${userEmail})`);
  };

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter((user) => {
    // Skip null or invalid users
    if (!user || !user.id || !user.email) return false;

    const matchesSearch =
      !searchQuery ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
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
            User Management
          </h2>
          <p className="text-muted-foreground">
            Manage customer accounts and permissions
          </p>
        </div>
        <Button className="bg-coffee-dark hover:bg-coffee-medium">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(value: typeof roleFilter) => setRoleFilter(value)}
        >
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value: typeof statusFilter) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-xl font-bold">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-xl font-bold">
                  {
                    users.filter(
                      (u) =>
                        new Date(u.createdAt).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Ban className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Banned Users</p>
                <p className="text-xl font-bold">
                  {users.filter((u) => u.status === "banned").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.full_name} />
                        <AvatarFallback>
                          {user.full_name
                            ? user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : user.email?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.full_name || "No Name"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: User["role"]) =>
                        updateUserRole(user.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onValueChange={(value: User["status"]) =>
                        updateUserStatus(user.id, value)
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{user.stats.totalOrders}</TableCell>
                  <TableCell>${user.stats.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          sendEmailToUser(
                            user.email,
                            user.full_name || "No Name"
                          )
                        }
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              User Details - {selectedUser?.full_name || "No Name"}
            </DialogTitle>
            <DialogDescription>
              Complete user profile and activity information
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Profile Information */}
              <div>
                <h3 className="font-semibold mb-2">Profile Information</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={selectedUser.avatar}
                        alt={selectedUser.full_name}
                      />
                      <AvatarFallback className="text-lg">
                        {selectedUser.full_name
                          ? selectedUser.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : selectedUser.email?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-lg">
                        {selectedUser.full_name || "No Name"}
                      </p>
                      <p className="text-muted-foreground">
                        {selectedUser.email}
                      </p>
                      {selectedUser.phone && (
                        <p className="text-sm">{selectedUser.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <Badge className={getRoleColor(selectedUser.role)}>
                        {selectedUser.role}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(selectedUser.status)}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Member Since
                      </p>
                      <p>
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last Login
                      </p>
                      <p>
                        {selectedUser.lastLoginAt
                          ? new Date(
                              selectedUser.lastLoginAt
                            ).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {selectedUser.address && (
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>{selectedUser.address.street}</p>
                    <p>
                      {selectedUser.address.city}, {selectedUser.address.state}{" "}
                      {selectedUser.address.zipCode}
                    </p>
                    <p>{selectedUser.address.country}</p>
                  </div>
                </div>
              )}

              {/* Order Statistics */}
              <div>
                <h3 className="font-semibold mb-2">Order Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold">
                      {selectedUser.stats.totalOrders}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">
                      ${selectedUser.stats.totalSpent.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Active Subscriptions
                    </p>
                    <p className="text-2xl font-bold">
                      {selectedUser.stats.subscriptions}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Last Order</p>
                    <p className="text-lg font-medium">
                      {selectedUser.stats.lastOrderDate
                        ? new Date(
                            selectedUser.stats.lastOrderDate
                          ).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="font-semibold mb-2">
                  Communication Preferences
                </h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Newsletter</span>
                    <Badge
                      variant={
                        selectedUser.preferences.newsletter
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedUser.preferences.newsletter
                        ? "Subscribed"
                        : "Unsubscribed"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Promotions</span>
                    <Badge
                      variant={
                        selectedUser.preferences.promotions
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedUser.preferences.promotions
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Order Updates</span>
                    <Badge
                      variant={
                        selectedUser.preferences.orderUpdates
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedUser.preferences.orderUpdates
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
