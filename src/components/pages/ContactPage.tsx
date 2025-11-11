import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { LocationMap } from "../ui/location-map";
import { RatingDisplay } from "../ui/rating-display";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  HelpCircle,
  ShoppingCart,
  Truck,
  Coffee,
  Wrench,
  Users,
  Calendar,
  Star,
  Award,
  Wifi,
  Car,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

interface ContactPageProps {
  onPageChange?: (page: any, section?: string) => void;
}

export function ContactPage({ onPageChange }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [selectedLocation, setSelectedLocation] = useState("main");

  const locations = [
    {
      id: "main",
      name: "Bean Boutique Flagship",
      address: "123 Coffee Street",
      city: "Bean City",
      state: "BC",
      zipCode: "12345",
      phone: "(555) 123-BEAN",
      hours: {
        Monday: "6:00 AM - 8:00 PM",
        Tuesday: "6:00 AM - 8:00 PM",
        Wednesday: "6:00 AM - 8:00 PM",
        Thursday: "6:00 AM - 8:00 PM",
        Friday: "6:00 AM - 8:00 PM",
        Saturday: "7:00 AM - 9:00 PM",
        Sunday: "7:00 AM - 7:00 PM",
      },
      coordinates: { lat: 40.7128, lng: -74.006 },
      features: [
        "Drive-thru",
        "WiFi",
        "Roastery Tours",
        "Event Space",
        "Parking",
      ],
      isMain: true,
    },
    {
      id: "downtown",
      name: "Bean Boutique Downtown",
      address: "456 Main Avenue",
      city: "Bean City",
      state: "BC",
      zipCode: "12346",
      phone: "(555) 456-BEAN",
      hours: {
        Monday: "7:00 AM - 6:00 PM",
        Tuesday: "7:00 AM - 6:00 PM",
        Wednesday: "7:00 AM - 6:00 PM",
        Thursday: "7:00 AM - 6:00 PM",
        Friday: "7:00 AM - 6:00 PM",
        Saturday: "8:00 AM - 7:00 PM",
        Sunday: "8:00 AM - 5:00 PM",
      },
      coordinates: { lat: 40.758, lng: -73.9855 },
      features: ["WiFi", "Study Area", "Grab & Go", "Mobile Order"],
    },
    {
      id: "university",
      name: "Bean Boutique University",
      address: "789 Campus Drive",
      city: "Bean City",
      state: "BC",
      zipCode: "12347",
      phone: "(555) 789-BEAN",
      hours: {
        Monday: "6:30 AM - 10:00 PM",
        Tuesday: "6:30 AM - 10:00 PM",
        Wednesday: "6:30 AM - 10:00 PM",
        Thursday: "6:30 AM - 10:00 PM",
        Friday: "6:30 AM - 8:00 PM",
        Saturday: "8:00 AM - 8:00 PM",
        Sunday: "9:00 AM - 9:00 PM",
      },
      coordinates: { lat: 40.7831, lng: -73.9712 },
      features: ["WiFi", "Study Rooms", "Student Discounts", "Group Seating"],
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success(
      "Message sent successfully! We'll get back to you within 24 hours."
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    });
  };

  const quickQuestions = [
    {
      id: "shipping",
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Free shipping on orders over $50!",
      action: () => onPageChange?.("faq", "shipping"),
      icon: Truck,
      category: "Shipping",
    },
    {
      id: "returns",
      question: "What is your return policy?",
      answer:
        "30-day returns on all items. Coffee returns accepted if damaged or defective.",
      action: () => onPageChange?.("faq", "returns"),
      icon: ShoppingCart,
      category: "Returns",
    },
    {
      id: "grind",
      question: "What grind size should I use?",
      answer:
        "Depends on your brewing method. Coarse for French press, fine for espresso.",
      action: () => onPageChange?.("faq", "brewing"),
      icon: Coffee,
      category: "Brewing",
    },
    {
      id: "equipment",
      question: "How do I clean my equipment?",
      answer:
        "Regular cleaning ensures the best taste. We have detailed guides for each device.",
      action: () => onPageChange?.("faq", "equipment"),
      icon: Wrench,
      category: "Equipment",
    },
    {
      id: "subscription",
      question: "Can I modify my subscription?",
      answer:
        "Yes! Skip, pause, or change your subscription anytime through your account.",
      action: () => onPageChange?.("subscription"),
      icon: MessageSquare,
      category: "Subscriptions",
    },
    {
      id: "storage",
      question: "How should I store coffee?",
      answer:
        "Store in an airtight container, away from light, heat, and moisture.",
      action: () => onPageChange?.("faq", "storage"),
      icon: Coffee,
      category: "Coffee Care",
    },
  ];

  const communityHighlights = [
    {
      title: "Coffee Education Workshops",
      description: "Join our weekly brewing workshops and coffee cuppings",
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXBwaW5nJTIwc2V0fGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      participants: "500+ participants",
      rating: 4.9,
    },
    {
      title: "Local Artist Showcase",
      description: "Supporting local artists with rotating gallery displays",
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5fGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      participants: "150+ artists featured",
      rating: 4.8,
    },
    {
      title: "Community Coffee Club",
      description: "Monthly meetups for coffee enthusiasts and professionals",
      image:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZWV0aW5nfGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      participants: "300+ members",
      rating: 4.7,
    },
  ];

  const handleQuickQuestionClick = (question: (typeof quickQuestions)[0]) => {
    if (question.action) {
      question.action();
    } else {
      onPageChange?.("faq");
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We're here to help with anything coffee-related! Whether you need
            brewing advice, have questions about our products, or want to learn
            about our community events, our friendly team is ready to assist
            you.
          </p>
        </section>

        {/* Contact Methods Overview */}
        <section className="mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  (555) 123-BEAN
                </p>
                <Badge variant="outline">Immediate Response</Badge>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  hello@beanboutique.com
                </p>
                <Badge variant="outline">24-hour Response</Badge>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Available during business hours
                </p>
                <Badge variant="outline">Instant Help</Badge>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Visit Us</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  3 locations to serve you
                </p>
                <Badge variant="outline">In-Person Help</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll respond within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="order">Order Support</SelectItem>
                        <SelectItem value="product">
                          Product Question
                        </SelectItem>
                        <SelectItem value="technical">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="subscription">
                          Subscription Help
                        </SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="event">Event Inquiry</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your question or concern in detail..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Community Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Community Programs</CardTitle>
                <CardDescription>
                  Join our vibrant coffee community through these ongoing
                  programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {communityHighlights.map((highlight, index) => (
                    <div key={index} className="space-y-3">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={highlight.image}
                          alt={highlight.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{highlight.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {highlight.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {highlight.participants}
                          </span>
                          <RatingDisplay rating={highlight.rating} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Questions</CardTitle>
                <CardDescription>
                  Find instant answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quickQuestions.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleQuickQuestionClick(item)}
                        className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm mb-1">
                              {item.question}
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {item.answer}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onPageChange?.("faq")}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  View All FAQs
                </Button>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Support</span>
                    <Badge variant="secondary">Within 24 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Phone Support</span>
                    <Badge variant="secondary">Immediate</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Order Issues</span>
                    <Badge className="bg-green-600">Within 4 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical Support</span>
                    <Badge variant="secondary">Within 12 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Live Chat</span>
                    <Badge className="bg-green-600">Instant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span className="text-muted-foreground">
                      6:00 AM - 8:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span className="text-muted-foreground">
                      7:00 AM - 9:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span className="text-muted-foreground">
                      7:00 AM - 7:00 PM
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="text-center">
                    <Badge variant="outline" className="text-primary">
                      All times EST
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Locations Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Visit Our Locations</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience Bean Boutique in person at one of our three convenient
              locations. Each offers a unique atmosphere while maintaining our
              commitment to quality.
            </p>
          </div>

          <LocationMap
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        </section>

        {/* Additional Services */}
        <section className="mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <Coffee className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Coffee Consultation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized coffee recommendations from our experts
                </p>
                <Button variant="outline" size="sm">
                  Book Session
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Wrench className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Equipment Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Technical help and maintenance for your brewing equipment
                </p>
                <Button variant="outline" size="sm">
                  Get Help
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Group Events</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Private tastings and workshops for teams and groups
                </p>
                <Button variant="outline" size="sm">
                  Plan Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
