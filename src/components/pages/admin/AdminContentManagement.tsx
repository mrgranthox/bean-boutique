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
import { Switch } from "../../ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Image as ImageIcon,
  FileText,
  Settings,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../../figma/ImageWithFallback";

interface ContentItem {
  id: string;
  type: "hero" | "feature" | "testimonial" | "blog" | "page" | "banner";
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  published: boolean;
  featured: boolean;
  author?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export function AdminContentManagement() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState<Partial<ContentItem>>({
    type: "page",
    title: "",
    subtitle: "",
    content: "",
    image: "",
    published: false,
    featured: false,
    author: "",
    slug: "",
    seoTitle: "",
    seoDescription: "",
    tags: [],
  });

  useEffect(() => {
    loadContentItems();
  }, []);

  const loadContentItems = async () => {
    try {
      setLoading(true);

      // Simulate loading content from backend
      // In a real implementation, this would call an API
      const mockContent: ContentItem[] = [
        {
          id: "hero-main",
          type: "hero",
          title: "Discover Your Perfect Brew",
          subtitle: "Premium Coffee Experience",
          content:
            "From single-origin beans to professional brewing equipment, we bring you the finest coffee experience at home.",
          image:
            "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBjdXAlMjBzdGVhbXxlbnwxfHx8fDE3NTU3OTczNjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
          published: true,
          featured: true,
          author: "Bean Boutique Team",
          slug: "hero-main",
          seoTitle: "Bean Boutique - Premium Coffee & Equipment",
          seoDescription:
            "Discover the finest coffee beans and brewing equipment. Premium quality, direct trade, sustainably sourced.",
          tags: ["hero", "main", "coffee"],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "feature-sustainability",
          type: "feature",
          title: "Sustainable Coffee Sourcing",
          subtitle: "Direct Trade & Fair Prices",
          content:
            "We work directly with coffee farmers to ensure fair prices and sustainable farming practices. Every purchase supports farming communities and environmental conservation.",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBmYXJtfGVufDB8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080",
          published: true,
          featured: true,
          author: "Sustainability Team",
          slug: "sustainable-sourcing",
          seoTitle: "Sustainable Coffee Sourcing - Bean Boutique",
          seoDescription:
            "Learn about our direct trade partnerships and sustainable coffee sourcing practices.",
          tags: ["sustainability", "direct-trade", "feature"],
          createdAt: "2024-01-05T00:00:00Z",
          updatedAt: "2024-01-20T14:15:00Z",
        },
        {
          id: "blog-brewing-guide",
          type: "blog",
          title: "The Ultimate Guide to Pour-Over Coffee",
          subtitle: "Master the art of manual brewing",
          content:
            "Pour-over coffee is both an art and a science. In this comprehensive guide, we'll walk you through everything you need to know to brew the perfect cup of pour-over coffee at home. From selecting the right beans to mastering your pouring technique, we've got you covered.",
          image:
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwb3VyJTIwb3ZlcnxlbnwwfHx8fDE3NTU5NjI0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
          published: true,
          featured: false,
          author: "Coffee Expert",
          slug: "pour-over-coffee-guide",
          seoTitle: "Ultimate Pour-Over Coffee Guide - Bean Boutique",
          seoDescription:
            "Learn how to brew perfect pour-over coffee with our comprehensive guide. Tips, techniques, and equipment recommendations.",
          tags: ["brewing", "pour-over", "guide", "coffee"],
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-25T09:45:00Z",
        },
      ];

      setContentItems(mockContent);
    } catch (error) {
      console.error("Failed to load content:", error);
      toast.error("Failed to load content items");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    try {
      const contentData = {
        ...formData,
        id: isEditing ? selectedItem?.id : `content_${Date.now()}`,
        updatedAt: new Date().toISOString(),
        createdAt: isEditing
          ? selectedItem?.createdAt
          : new Date().toISOString(),
      };

      if (isEditing) {
        setContentItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem?.id
              ? {
                  ...item,
                  ...contentData,
                  id: item.id,
                  createdAt: item.createdAt,
                }
              : item
          )
        );
        toast.success("Content updated successfully");
      } else {
        setContentItems((prev) => [...prev, contentData as ContentItem]);
        toast.success("Content created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save content:", error);
      toast.error("Failed to save content");
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      setContentItems((prev) => prev.filter((item) => item.id !== contentId));
      toast.success("Content deleted successfully");
    } catch (error) {
      console.error("Failed to delete content:", error);
      toast.error("Failed to delete content");
    }
  };

  const handleTogglePublished = async (contentId: string) => {
    try {
      setContentItems((prev) =>
        prev.map((item) =>
          item.id === contentId
            ? {
                ...item,
                published: !item.published,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
      toast.success("Content status updated");
    } catch (error) {
      console.error("Failed to update content status:", error);
      toast.error("Failed to update content status");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "page",
      title: "",
      subtitle: "",
      content: "",
      image: "",
      published: false,
      featured: false,
      author: "",
      slug: "",
      seoTitle: "",
      seoDescription: "",
      tags: [],
    });
    setSelectedItem(null);
    setIsEditing(false);
  };

  const openEditDialog = (item: ContentItem) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const contentTypes = [
    { value: "hero", label: "Hero Section" },
    { value: "feature", label: "Feature" },
    { value: "testimonial", label: "Testimonial" },
    { value: "blog", label: "Blog Post" },
    { value: "page", label: "Page Content" },
    { value: "banner", label: "Banner" },
  ];

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
            Content Management
          </h2>
          <p className="text-muted-foreground">
            Manage your website content like a CMS
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-coffee-dark hover:bg-coffee-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Content" : "Add New Content"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update content information"
                  : "Create new content for your website"}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter content title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Content Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: ContentItem["type"]) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    placeholder="Enter content subtitle"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Enter content text"
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="Enter image URL"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="Content author"
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="url-friendly-slug"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags?.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="coffee, brewing, guide"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, published: checked })
                      }
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, featured: checked })
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, seoTitle: e.target.value })
                    }
                    placeholder="SEO optimized title (60 characters max)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seoTitle?.length || 0}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seoDescription: e.target.value,
                      })
                    }
                    placeholder="SEO optimized description (160 characters max)"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seoDescription?.length || 0}/160 characters
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveContent}
                className="bg-coffee-dark hover:bg-coffee-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? "Update Content" : "Create Content"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            size="sm"
          >
            All
          </Button>
          {contentTypes.map((type) => (
            <Button
              key={type.value}
              variant={activeTab === type.value ? "default" : "outline"}
              onClick={() => setActiveTab(type.value)}
              size="sm"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>Content Items ({filteredContent.length})</CardTitle>
          <CardDescription>Manage your website content</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-sm text-muted-foreground">
                            {item.subtitle}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {contentTypes.find((t) => t.value === item.type)?.label ||
                        item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={item.published ? "default" : "secondary"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                      {item.featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublished(item.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteContent(item.id)}
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
  );
}
