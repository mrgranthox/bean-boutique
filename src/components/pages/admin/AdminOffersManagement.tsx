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
  Gift,
  Percent,
  Tag,
  Calendar,
  Search,
  Filter,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { v4 as uuidv4 } from "uuid";

interface Offer {
  id: string;
  title: string;
  description: string;
  type: "discount" | "bogo" | "free-shipping" | "bundle" | "gift";
  discountType?: "percentage" | "fixed";
  discount_value?: number;
  min_purchase?: number;
  code: string;
  start_date: string;
  end_date: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  isPublic: boolean;
  // applicableProducts?: string[];
  // excludedProducts?: string[];
  image?: string;
  featured: boolean;
  createdAt: string;
}

interface PromoCode {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed" | "free-shipping";
  value: number;
  minimumOrder?: number;
  usage_limit?: number;
  usage_count: number;
  active: boolean;
  start_date: string;
  end_date: string;
  description: string;
  createdAt: string;
}

export function AdminOffersManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"offers" | "promo-codes">(
    "offers"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Offer["type"]>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "expired"
  >("all");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(
    null
  );
  const [isEditingOffer, setIsEditingOffer] = useState(false);
  const [isEditingPromoCode, setIsEditingPromoCode] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);

  const [offerFormData, setOfferFormData] = useState<Partial<Offer>>({
    title: "",
    description: "",
    type: "discount",
    discountType: "percentage",
    discount_value: 0,
    min_purchase: 0,
    code: "",
    start_date: "",
    end_date: "",
    usageLimit: undefined,
    usageCount: 0,
    active: true,
    isPublic: true,
    // applicableProducts: [],
    // excludedProducts: [],
    image: "",
    featured: false,
  });

  const [promoFormData, setPromoFormData] = useState<Partial<PromoCode>>({
    code: "",
    discount_type: "percentage",
    value: 0,
    minimumOrder: 0,
    usage_limit: undefined,
    usage_count: 0,
    active: true,
    start_date: "",
    end_date: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const { getAllOffers, getAllPromotions } = await import(
        "../../../utils/admin-db"
      );
      const offersData = await getAllOffers();
      console.log("Offers Data:", offersData);

      const promoData = await getAllPromotions();
      console.log("Promo Codes Data:", promoData);

      if (offersData && promoData) {
        setOffers(offersData);
        setPromoCodes(promoData);
      }
    } catch (error) {
      console.error("Failed to load offers and promo codes:", error);
      setOffers([]);
      setPromoCodes([]);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSaveOffer = async () => {
    try {
      const offerData = {
        ...offerFormData,
        id: isEditingOffer && selectedOffer?.id ? selectedOffer.id : uuidv4(),
        code: offerFormData.code || generateCode(),
        // createdAt: isEditingOffer
        //   ? selectedOffer?.createdAt
        //   : new Date().toISOString(),
      };

      const { createOffer, updateOffer } = await import(
        "../../../utils/admin-db"
      );

      if (isEditingOffer && selectedOffer?.id) {
        await updateOffer(selectedOffer.id, offerData as Offer);
        toast.success("Offer updated successfully");
      } else {
        await createOffer(offerData as Offer);
        toast.success("Offer created successfully");
      }

      await loadData();

      setIsOfferDialogOpen(false);
      resetOfferForm();
    } catch (error) {
      console.error("Failed to save offer:", error);
      toast.error("Failed to save offer");
    }
  };

  const handleSavePromoCode = async () => {
    try {
      const promoData = {
        ...promoFormData,
        id: isEditingPromoCode ? selectedPromoCode?.id : uuidv4(),
        code: promoFormData.code || generateCode(),
        // createdAt: isEditingPromoCode
        //   ? selectedPromoCode?.createdAt
        //   : new Date().toISOString(),
      };

      const { createPromotion, updatePromotion } = await import(
        "../../../utils/admin-db"
      );

      if (isEditingPromoCode && selectedPromoCode?.id) {
        await updatePromotion(selectedPromoCode.id, promoData);
        toast.success("Offer updated successfully");
      } else {
        await createPromotion(promoData);
        toast.success("Offer created successfully");
      }
      loadData();

      setIsPromoDialogOpen(false);
      resetPromoForm();
    } catch (error) {
      console.error("Failed to save promo code:", error);
      toast.error("Failed to save promo code");
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) {
      return;
    }
    try {
      const { deleteOffer } = await import("../../../utils/admin-db");
      await deleteOffer(offerId);

      toast.success("Offer deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Failed to delete offer:", error);
      toast.error("Failed to delete offer");
    }
  };

  const handleDeletePromoCode = async (promoId: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) {
      return;
    }
    try {
      const { deletePromotion } = await import("../../../utils/admin-db");
      await deletePromotion(promoId);

      toast.success("Promo code deleted locally");
      loadData();
    } catch (error) {
      console.error("Failed to delete promo code:", error);
      toast.error("Failed to delete promo code");
    }
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code "${code}" copied to clipboard`);
  };

  const resetOfferForm = () => {
    setOfferFormData({
      title: "",
      description: "",
      type: "discount",
      discountType: "percentage",
      discount_value: 0,
      min_purchase: 0,
      code: "",
      start_date: "",
      end_date: "",
      usageLimit: undefined,
      usageCount: 0,
      active: true,
      isPublic: true,
      // applicableProducts: [],
      // excludedProducts: [],
      image: "",
      featured: false,
    });
    setSelectedOffer(null);
    setIsEditingOffer(false);
  };

  const resetPromoForm = () => {
    setPromoFormData({
      code: "",
      discount_type: "percentage",
      value: 0,
      minimumOrder: 0,
      usage_limit: undefined,
      usage_count: 0,
      active: true,
      start_date: "",
      end_date: "",
      description: "",
    });
    setSelectedPromoCode(null);
    setIsEditingPromoCode(false);
  };

  const openEditOfferDialog = (offer: Offer) => {
    setSelectedOffer(offer);
    setOfferFormData({ ...offer });
    setIsEditingOffer(true);
    setIsOfferDialogOpen(true);
  };

  const openCreateOfferDialog = () => {
    resetOfferForm();
    setIsOfferDialogOpen(true);
  };

  const openEditPromoDialog = (promo: PromoCode) => {
    setSelectedPromoCode(promo);
    setPromoFormData({ ...promo });
    setIsEditingPromoCode(true);
    setIsPromoDialogOpen(true);
  };

  const openCreatePromoDialog = () => {
    resetPromoForm();
    setIsPromoDialogOpen(true);
  };

  const getOfferStatus = (offer: Offer) => {
    const now = new Date();
    const start = new Date(offer.start_date);
    const end = new Date(offer.end_date);

    if (!offer.active) return "inactive";
    if (now < start) return "scheduled";
    if (now > end) return "expired";
    return "active";
  };

  const getPromoStatus = (promo: PromoCode) => {
    const now = new Date();
    const start = new Date(promo.start_date);
    const end = new Date(promo.end_date);

    if (!promo.active) return "inactive";
    if (now < start) return "scheduled";
    if (now > end) return "expired";
    return "active";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || offer.type === typeFilter;
    const status = getOfferStatus(offer);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredPromoCodes = promoCodes.filter((promo) => {
    const matchesSearch =
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getPromoStatus(promo);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
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
            Offers & Promotions
          </h2>
          <p className="text-muted-foreground">
            Manage special offers, discounts, and promo codes
          </p>
        </div>
        <div className="flex space-x-2">
          {activeTab === "offers" && (
            <Dialog
              open={isOfferDialogOpen}
              onOpenChange={setIsOfferDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={openCreateOfferDialog}
                  className="bg-coffee-dark hover:bg-coffee-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {isEditingOffer ? "Edit Offer" : "Add New Offer"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditingOffer
                      ? "Update offer information"
                      : "Create a new promotional offer"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Offer Title</Label>
                      <Input
                        id="title"
                        value={offerFormData.title}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter offer title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Offer Type</Label>
                      <Select
                        value={offerFormData.type}
                        onValueChange={(value: Offer["type"]) =>
                          setOfferFormData({ ...offerFormData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discount">Discount</SelectItem>
                          <SelectItem value="bogo">Buy One Get One</SelectItem>
                          <SelectItem value="free-shipping">
                            Free Shipping
                          </SelectItem>
                          <SelectItem value="bundle">Bundle Deal</SelectItem>
                          <SelectItem value="gift">
                            Gift with Purchase
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={offerFormData.description}
                      onChange={(e) =>
                        setOfferFormData({
                          ...offerFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter offer description"
                      rows={3}
                    />
                  </div>

                  {offerFormData.type === "discount" && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="discountType">Discount Type</Label>
                        <Select
                          value={offerFormData.discountType}
                          onValueChange={(value: "percentage" | "fixed") =>
                            setOfferFormData({
                              ...offerFormData,
                              discountType: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">
                              Percentage
                            </SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="discountValue">
                          {offerFormData.discountType === "percentage"
                            ? "Percentage"
                            : "Amount ($)"}
                        </Label>
                        <Input
                          id="discountValue"
                          type="number"
                          value={offerFormData.discount_value}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              discount_value: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="minimumOrder">Minimum Order ($)</Label>
                        <Input
                          id="minimumOrder"
                          type="number"
                          value={offerFormData.min_purchase}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              min_purchase: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="code">Offer Code</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="code"
                          value={offerFormData.code}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              code: e.target.value.toUpperCase(),
                            })
                          }
                          placeholder="Enter code or leave blank to auto-generate"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setOfferFormData({
                              ...offerFormData,
                              code: generateCode(),
                            })
                          }
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="usageLimit">Usage Limit (optional)</Label>
                      <Input
                        id="usageLimit"
                        type="number"
                        value={offerFormData.usageLimit || ""}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            usageLimit: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={offerFormData.start_date}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            start_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={offerFormData.end_date}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            end_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL (optional)</Label>
                    <Input
                      id="image"
                      value={offerFormData.image}
                      onChange={(e) =>
                        setOfferFormData({
                          ...offerFormData,
                          image: e.target.value,
                        })
                      }
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={offerFormData.active}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            active: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={offerFormData.isPublic}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            isPublic: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="isPublic">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={offerFormData.featured}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            featured: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsOfferDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveOffer}
                    className="bg-coffee-dark hover:bg-coffee-medium"
                  >
                    {isEditingOffer ? "Update Offer" : "Create Offer"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "promo-codes" && (
            <Dialog
              open={isPromoDialogOpen}
              onOpenChange={setIsPromoDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={openCreatePromoDialog}
                  className="bg-coffee-dark hover:bg-coffee-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Promo Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>
                    {isEditingPromoCode
                      ? "Edit Promo Code"
                      : "Add New Promo Code"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditingPromoCode
                      ? "Update promo code details"
                      : "Create a new promotional code"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="promoCode">Promo Code</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="promoCode"
                          value={promoFormData.code}
                          onChange={(e) =>
                            setPromoFormData({
                              ...promoFormData,
                              code: e.target.value.toUpperCase(),
                            })
                          }
                          placeholder="Enter code"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setPromoFormData({
                              ...promoFormData,
                              code: generateCode(),
                            })
                          }
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="promoType">Type</Label>
                      <Select
                        value={promoFormData.discount_type}
                        onValueChange={(value: PromoCode["discount_type"]) =>
                          setPromoFormData({
                            ...promoFormData,
                            discount_type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="free-shipping">
                            Free Shipping
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="promoDescription">Description</Label>
                    <Input
                      id="promoDescription"
                      value={promoFormData.description}
                      onChange={(e) =>
                        setPromoFormData({
                          ...promoFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter description"
                    />
                  </div>

                  {promoFormData.discount_type !== "free-shipping" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="promoValue">
                          {promoFormData.discount_type === "percentage"
                            ? "Percentage"
                            : "Amount ($)"}
                        </Label>
                        <Input
                          id="promoValue"
                          type="number"
                          value={promoFormData.value}
                          onChange={(e) =>
                            setPromoFormData({
                              ...promoFormData,
                              value: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="promoMinOrder">Minimum Order ($)</Label>
                        <Input
                          id="promoMinOrder"
                          type="number"
                          value={promoFormData.minimumOrder}
                          onChange={(e) =>
                            setPromoFormData({
                              ...promoFormData,
                              minimumOrder: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="promoStart">Start Date</Label>
                      <Input
                        id="promoStart"
                        type="date"
                        value={promoFormData.start_date}
                        onChange={(e) =>
                          setPromoFormData({
                            ...promoFormData,
                            start_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="promoEnd">End Date</Label>
                      <Input
                        id="promoEnd"
                        type="date"
                        value={promoFormData.end_date}
                        onChange={(e) =>
                          setPromoFormData({
                            ...promoFormData,
                            end_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="promoUsageLimit">
                        Usage Limit (optional)
                      </Label>
                      <Input
                        id="promoUsageLimit"
                        type="number"
                        value={promoFormData.usage_limit || ""}
                        onChange={(e) =>
                          setPromoFormData({
                            ...promoFormData,
                            usage_limit: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="Unlimited"
                      />
                    </div>
                    <div className="flex items-center pt-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="promoActive"
                          checked={promoFormData.active}
                          onChange={(e) =>
                            setPromoFormData({
                              ...promoFormData,
                              active: e.target.checked,
                            })
                          }
                        />
                        <Label htmlFor="promoActive">Active</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsPromoDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSavePromoCode}
                    className="bg-coffee-dark hover:bg-coffee-medium"
                  >
                    {isEditingPromoCode ? "Update Code" : "Create Code"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "offers" ? "default" : "ghost"}
          onClick={() => setActiveTab("offers")}
          className="px-4 py-2"
        >
          <Gift className="w-4 h-4 mr-2" />
          Special Offers ({offers.length})
        </Button>
        <Button
          variant={activeTab === "promo-codes" ? "default" : "ghost"}
          onClick={() => setActiveTab("promo-codes")}
          className="px-4 py-2"
        >
          <Tag className="w-4 h-4 mr-2" />
          Promo Codes ({promoCodes.length})
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${
              activeTab === "offers" ? "offers" : "promo codes"
            }...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {activeTab === "offers" && (
          <Select
            value={typeFilter}
            onValueChange={(value: typeof typeFilter) => setTypeFilter(value)}
          >
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="discount">Discount</SelectItem>
              <SelectItem value="bogo">BOGO</SelectItem>
              <SelectItem value="free-shipping">Free Shipping</SelectItem>
              <SelectItem value="bundle">Bundle</SelectItem>
              <SelectItem value="gift">Gift</SelectItem>
            </SelectContent>
          </Select>
        )}
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
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeTab === "offers" ? (
        /* Special Offers */
        <Card>
          <CardHeader>
            <CardTitle>Special Offers ({filteredOffers.length})</CardTitle>
            <CardDescription>
              Manage promotional campaigns and special deals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {offer.image && (
                          <ImageWithFallback
                            src={offer.image}
                            alt={offer.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{offer.title}</p>
                            {offer.featured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {offer.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {/* {offer.type.replace("-", " ")} */}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {offer.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCodeToClipboard(offer.code)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {offer.type === "discount" &&
                      offer.discountType &&
                      offer.discount_value ? (
                        <span>
                          {offer.discountType === "percentage"
                            ? `${offer.discount_value}%`
                            : `$${offer.discount_value}`}
                          {offer.min_purchase
                            ? ` (min $${offer.min_purchase})`
                            : ""}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{offer.usageCount}</p>
                        {offer.usageLimit && (
                          <p className="text-sm text-muted-foreground">
                            / {offer.usageLimit}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(offer.start_date).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">
                          to {new Date(offer.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(getOfferStatus(offer))}>
                        {getOfferStatus(offer)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditOfferDialog(offer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteOffer(offer.id)}
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
      ) : (
        /* Promo Codes */
        <Card>
          <CardHeader>
            <CardTitle>Promo Codes ({filteredPromoCodes.length})</CardTitle>
            <CardDescription>
              Manage discount codes and promotional coupons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromoCodes.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono">
                          {promo.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCodeToClipboard(promo.code)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {promo.description}
                      </p>
                    </TableCell>
                    <TableCell className="capitalize">
                      {promo.discount_type.replace("-", " ")}
                    </TableCell>
                    <TableCell>
                      {promo.discount_type === "percentage"
                        ? `${promo.value}%`
                        : promo.discount_type === "fixed"
                        ? `$${promo.value}`
                        : "Free Shipping"}
                      {promo.minimumOrder ? (
                        <p className="text-sm text-muted-foreground">
                          min $${promo.minimumOrder}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{promo.usage_count}</p>
                        {promo.usage_limit && (
                          <p className="text-sm text-muted-foreground">
                            / {promo.usage_limit}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(promo.start_date).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">
                          to {new Date(promo.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(getPromoStatus(promo))}>
                        {getPromoStatus(promo)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditPromoDialog(promo)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePromoCode(promo.id)}
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
      )}
    </div>
  );
}
