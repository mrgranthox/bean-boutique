import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { v4 as uuidv4 } from "uuid";
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
  Calendar,
  Users,
  MapPin,
  Clock,
  Search,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Pagination } from "@/components/ui/pagination-custom";
import { updateImage, uploadImage } from "@/utils/imagefunctions";

interface Event {
  id: string;
  title: string;
  description: string;
  category: "workshop" | "tasting" | "class" | "special";
  event_date: string;
  event_time: string;
  duration: number; // in minutes
  location: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  price: number;
  image_url: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  level: "beginner" | "intermediate" | "advanced" | "all level";
  requirements?: string[];
  materials?: string[];
  featured: boolean;
  createdAt?: string;
}

export function AdminEventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Event["category"]>(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<"all" | Event["status"]>(
    "all"
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    category: "workshop",
    event_date: "",
    event_time: "",
    duration: 60,
    location: "",
    instructor: "",
    capacity: 12,
    enrolled: 0,
    price: 0,
    image_url: "",
    status: "upcoming",
    level: "beginner",
    requirements: [],
    materials: [],
    featured: false,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { getAllEvents } = await import("../../../utils/admin-db");
      const data = await getAllEvents();
      console.log("Loaded events:", data);
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async () => {
    try {
      if (!formData) {
        toast.error("Form data is missing");
        return;
      }

      const eventData: Event = {
        id: isEditing && selectedEvent?.id ? selectedEvent.id : uuidv4(),
        title: formData.title ?? "Untitled Event",
        description: formData.description ?? "",
        category: formData.category ?? "workshop",
        event_date: formData.event_date
          ? new Date(formData.event_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        event_time: formData.event_time ?? "10:00",
        duration:
          typeof formData.duration === "number" ? formData.duration : 60,
        location: formData.location ?? "",
        instructor: formData.instructor ?? "",
        capacity:
          typeof formData.capacity === "number" ? formData.capacity : 12,
        enrolled: typeof formData.enrolled === "number" ? formData.enrolled : 0,
        price: typeof formData.price === "number" ? formData.price : 0,
        image_url: formData.image_url ?? "",
        status: formData.status ?? "upcoming",
        level: formData.level ?? "beginner",
        requirements: Array.isArray(formData.requirements)
          ? formData.requirements
          : [],
        materials: Array.isArray(formData.materials) ? formData.materials : [],
        featured:
          typeof formData.featured === "boolean" ? formData.featured : false,
      };

      const { createEvent, updateEvent } = await import(
        "../../../utils/admin-db"
      );

      if (isEditing && selectedEvent?.id) {
        await updateEvent(selectedEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }

      toast.success(
        isEditing ? "Event updated successfully" : "Event created successfully"
      );
      await loadEvents();

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save event:", error);

      setIsDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const { deleteEvent } = await import("../../../utils/admin-db");
      await deleteEvent(eventId);
      toast.success("Product deleted successfully");
      await loadEvents();
    } catch (error) {
      console.error("Failed to delete product:", error);
      if (error instanceof Error) {
        toast.error(`Failed to update order status: ${error.message}`);
      } else {
        toast.error("Failed to update order status: Unknown error occurred");
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      // Use existing event ID if editing, otherwise generate a temporary one for storage
      const entityId = selectedEvent?.id || uuidv4();

      // Get old image path if exists
      const oldPath = formData.image_url;

      // Upload or replace image
      const { data, error } = oldPath
        ? await updateImage(file, "events", entityId, oldPath)
        : await uploadImage(file, "events", entityId);

      if (error || !data) {
        toast.error("Failed to upload image");
        return;
      }

      // Update form data with new public URL
      setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));

      // If this is a new event, make sure to store the generated entityId
      if (!selectedEvent?.id) {
        setFormData((prev) => ({ ...prev, id: entityId }));
      }

      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "workshop",
      event_date: "",

      duration: 60,
      location: "",
      instructor: "",
      capacity: 12,
      enrolled: 0,
      price: 0,
      image_url: "",
      status: "upcoming",
      level: "beginner",
      requirements: [],
      materials: [],
      featured: false,
    });
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setFormData({ ...event });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: Event["category"]) => {
    switch (type) {
      case "workshop":
        return "bg-purple-100 text-purple-800";
      case "tasting":
        return "bg-orange-100 text-orange-800";
      case "class":
        return "bg-blue-100 text-blue-800";
      case "special":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEvents = events.filter((event) => {
    // Skip null/undefined events
    if (!event) {
      return false;
    }

    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || event.category === typeFilter;
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const itemsPerPage = 10; // or whatever you want
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            Event Management
          </h2>
          <p className="text-muted-foreground">
            Manage workshops, tastings, and special events
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-coffee-dark hover:bg-coffee-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update event information"
                  : "Create a new workshop, tasting, or class"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: Event["category"]) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="tasting">Tasting</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="special">Special Event</SelectItem>
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
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.event_time || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, event_time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value) || 60,
                      })
                    }
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    placeholder="Enter instructor name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 12,
                      })
                    }
                    placeholder="12"
                  />
                </div>
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
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: Event["level"]) =>
                      setFormData({ ...formData, level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Image</Label>

                {formData.image_url ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                      onClick={() => {
                        setFormData({ ...formData, image_url: "" });
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
                      handleImageUpload(file);
                    }
                  }}
                />

                {uploading && (
                  <p className="text-sm text-blue-600 font-medium">
                    Uploading...
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="requirements">
                  Requirements (comma-separated)
                </Label>
                <Input
                  id="requirements"
                  value={formData.requirements?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requirements: e.target.value
                        .split(",")
                        .map((req) => req.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g., Basic coffee knowledge, Own apron"
                />
              </div>

              <div>
                <Label htmlFor="materials">
                  Materials Provided (comma-separated)
                </Label>
                <Input
                  id="materials"
                  value={formData.materials?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      materials: e.target.value
                        .split(",")
                        .map((mat) => mat.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g., Apron provided, Take-home guide"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                  />
                  <Label htmlFor="featured">Featured Event</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveEvent}
                className="bg-coffee-dark hover:bg-coffee-medium"
              >
                {isEditing ? "Update Event" : "Create Event"}
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
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="tasting">Tasting</SelectItem>
            <SelectItem value="class">Class</SelectItem>
            <SelectItem value="special">Special</SelectItem>
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
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-xl font-bold">
                  {events.filter((e) => e.status === "upcoming").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Enrolled</p>
                <p className="text-xl font-bold">
                  {events.reduce((sum, e) => sum + e.enrolled, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Capacity Available
                </p>
                <p className="text-xl font-bold">
                  {events.reduce(
                    (sum, e) => sum + (e.capacity - e.enrolled),
                    0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({paginatedEvents.length})</CardTitle>
          <CardDescription>
            Manage workshops, tastings, and educational events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <ImageWithFallback
                        src={event.image_url}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.location}
                        </p>
                        {event.featured && (
                          <Badge variant="outline" className="mt-1">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(event.category)}>
                      {event.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {new Date(event.event_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.event_time} ({event.duration} min)
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{event.instructor}</TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium">
                        {event.enrolled}/{event.capacity}
                      </p>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (event.enrolled / event.capacity) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${event.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(event)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
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
