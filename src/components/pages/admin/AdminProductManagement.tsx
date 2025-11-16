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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Coffee,
  Search,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { uploadImage } from "@/utils/imagefunctions";
import { Pagination } from "@/components/ui/pagination-custom";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "coffee" | "equipment";
  image: string;
  inStock: boolean;
  stockQuantity: number;
  origin?: string;
  roastLevel?: string;
  processingMethod?: string;
  flavorNotes?: string[];
  specifications?: { [key: string]: string };
  featured: boolean;
  createdAt: string;
}

export function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "coffee" | "equipment"
  >("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // adjust as needed

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "coffee",
    image: "",
    inStock: true,
    stockQuantity: 0,
    origin: "",
    roastLevel: "",
    processingMethod: "",
    flavorNotes: [],
    specifications: {},
    featured: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      // Load from Supabase database
      const { getAllProducts } = await import("../../../utils/admin-db");
      const data = await getAllProducts();

      // Map database fields to component format
      const mappedProducts = data.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category,
        image: product.image_url || "",
        inStock: product.stock > 0,
        stockQuantity: product.stock,
        origin: product.origin || "",
        roastLevel: product.roast_level || "",
        processingMethod: product.processing_method || "",
        flavorNotes: product.flavor_notes || [],
        specifications: product.specifications || {},
        featured: product.featured || false,
        createdAt: product.created_at,
      }));

      console.log("✅ Loaded products from database:", mappedProducts.length);
      setProducts(mappedProducts);

      if (mappedProducts.length === 0) {
        toast.info(
          "No products found. Please run MIGRATION.sql and SEED_DATA.sql in Supabase."
        );
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products. Please ensure database is set up.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      // Map form data to database format
      const dbData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stockQuantity || 0,
        image_url: formData.image,
        category: formData.category,
        origin: formData.origin,
        roast_level: formData.roastLevel,
        processing_method: formData.processingMethod,
        flavor_notes: formData.flavorNotes,
        brand: formData.specifications?.brand,
        model: formData.specifications?.model,
        type: formData.specifications?.type,
        featured: formData.featured || false,
      };

      const { createProduct, updateProduct } = await import(
        "../../../utils/admin-db"
      );

      if (isEditing && selectedProduct) {
        await updateProduct(selectedProduct.id, dbData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(dbData);
        toast.success("Product created successfully");
      }

      await loadProducts();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save product:", error);
      if (error instanceof Error) {
        toast.error(`Failed to update order status: ${error.message}`);
      } else {
        toast.error("Failed to update order status: Unknown error occurred");
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const { deleteProduct } = await import("../../../utils/admin-db");
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      if (error instanceof Error) {
        toast.error(`Failed to update order status: ${error.message}`);
      } else {
        toast.error("Failed to update order status: Unknown error occurred");
      }
    }
  };

  const handleImageUpload = async (file: File, productId: string) => {
    try {
      setUploading(true);

      const oldPath = formData.image;

      const { data, error: uploadError } = await uploadImage(
        file,
        "products",
        productId
      );

      if (uploadError || !data) {
        toast.error("Failed to upload image");
        return;
      }

      // Save into form data
      setFormData((prev) => ({ ...prev, image: data.publicUrl }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "coffee",
      image: "",
      inStock: true,
      stockQuantity: 0,
      origin: "",
      roastLevel: "",
      processingMethod: "",
      flavorNotes: [],
      specifications: {},
      featured: false,
    });
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({ ...product });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter((product) => {
    // Filter out null/undefined products
    if (!product || !product.name || !product.description) {
      return false;
    }

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const safeCurrentPage = Math.min(currentPage, totalPages) || 1;

  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

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
            Product Management
          </h2>
          <p className="text-muted-foreground">
            Manage your coffee and equipment inventory
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-coffee-dark hover:bg-coffee-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update product information"
                  : "Create a new product for your store"}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: "coffee" | "equipment") =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter product description"
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
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stockQuantity: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Image</Label>

                  {formData.image ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                        onClick={() => {
                          setFormData({ ...formData, image: "" });
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No image selected
                    </p>
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // temporary preview
                        handleImageUpload(
                          file,
                          selectedProduct?.id || "product"
                        );
                      }
                    }}
                  />

                  {uploading && (
                    <p className="text-sm text-blue-600 font-medium">
                      Uploading...
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                {formData.category === "coffee" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="origin">Origin</Label>
                        <Input
                          id="origin"
                          value={formData.origin || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, origin: e.target.value })
                          }
                          placeholder="e.g., Ethiopia"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roastLevel">Roast Level</Label>
                        <Select
                          value={formData.roastLevel || ""}
                          onValueChange={(value) =>
                            setFormData({ ...formData, roastLevel: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select roast level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Light">Light</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Medium-Dark">
                              Medium-Dark
                            </SelectItem>
                            <SelectItem value="Dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="processingMethod">
                        Processing Method
                      </Label>
                      <Input
                        id="processingMethod"
                        value={formData.processingMethod || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            processingMethod: e.target.value,
                          })
                        }
                        placeholder="e.g., Washed, Natural, Honey"
                      />
                    </div>

                    <div>
                      <Label htmlFor="flavorNotes">
                        Flavor Notes (comma-separated)
                      </Label>
                      <Input
                        id="flavorNotes"
                        value={formData.flavorNotes?.join(", ") || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            flavorNotes: e.target.value
                              .split(",")
                              .map((note) => note.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="e.g., Citrus, Chocolate, Nutty"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <Label>Equipment Specifications</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add key specifications for this equipment
                    </p>
                    <Textarea
                      placeholder='Enter specifications in JSON format, e.g., {"Capacity": "350g", "Material": "Stainless Steel"}'
                      value={JSON.stringify(
                        formData.specifications || {},
                        null,
                        2
                      )}
                      onChange={(e) => {
                        try {
                          const specs = JSON.parse(e.target.value);
                          setFormData({ ...formData, specifications: specs });
                        } catch {
                          // Invalid JSON, but allow user to continue typing
                        }
                      }}
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) =>
                      setFormData({ ...formData, inStock: e.target.checked })
                    }
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveProduct}
                className="bg-coffee-dark hover:bg-coffee-medium"
              >
                {isEditing ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value: "all" | "coffee" | "equipment") =>
            setCategoryFilter(value)
          }
        >
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="coffee">Coffee</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({paginatedProducts.length})</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.category === "coffee" ? "default" : "secondary"
                      }
                    >
                      {product.category === "coffee" ? (
                        <Coffee className="w-3 h-3 mr-1" />
                      ) : (
                        <Package className="w-3 h-3 mr-1" />
                      )}
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stockQuantity < 10 ? "text-red-600" : ""
                      }
                    >
                      {product.stockQuantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge
                        variant={product.inStock ? "default" : "secondary"}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                      {product.featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                showInfo={true}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
