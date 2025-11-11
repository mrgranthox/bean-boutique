import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Search,
  Calendar,
  Users,
  Coffee,
  BookOpen,
  Filter,
  Loader2,
} from "lucide-react";
import { Pagination } from "../ui/pagination-custom";
import { toast } from "sonner";
import { EventCard } from "./components/EventCard";
import { useEvents } from "../../hooks/useEvents";
import type { Event } from "../../utils/database-service";
import type { Page } from "../../App";

interface EventsPageProps {
  onPageChange: (page: Page) => void;
}

const dateRanges = ["All", "This Week", "This Month", "Next Month", "Later"];

export function EventsPage({ onPageChange }: EventsPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const itemsPerPage = 60;

  // Load events from database
  const { events, loading, error, pagination, refetch } = useEvents({
    upcoming: selectedDate !== "All",
    limit: itemsPerPage,
    page: currentPage,
  });

  // Get unique categories and difficulties from events
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(events.map((e) => e.category).filter(Boolean))
    );
    return ["All", ...cats.sort()];
  }, [events]);

  const difficulties = useMemo(() => {
    const diffs = Array.from(
      new Set(events.map((e) => e.level).filter(Boolean))
    );
    return ["All", ...diffs.sort()];
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.instructor &&
          event.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "All" || event.level === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort by date or other criteria
    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        );
      } else if (sortBy === "price-low") {
        return a.price - b.price;
      } else if (sortBy === "price-high") {
        return b.price - a.price;
      }
      return 0;
    });
  }, [events, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleRegister = (event: Event) => {
    toast.success(`Successfully registered for ${event.title}!`, {
      description: "Check your email for confirmation details.",
      duration: 5000,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setSelectedDate("All");
    setSortBy("date");
    setCurrentPage(1);
  };

  const featuredEvents = events.filter((e) => e.category === "Featured");

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl mb-6">Events & Workshops</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our expert-led coffee workshops and events. From beginner
            brewing classes to advanced barista techniques, enhance your coffee
            knowledge and skills.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">{events.length}</h3>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Coffee className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">{categories.length - 1}</h3>
              <p className="text-sm text-muted-foreground">
                Workshop Categories
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">
                {events.reduce((sum, e) => sum + (e.capacity || 0), 0)}
              </h3>
              <p className="text-sm text-muted-foreground">Total Capacity</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">{difficulties.length - 1}</h3>
              <p className="text-sm text-muted-foreground">Skill Levels</p>
            </CardContent>
          </Card>
        </section>

        {/* Filters and Search */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={(value) => {
                setSelectedDifficulty(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff} value={diff ?? ""}>
                    {diff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDate}
              onValueChange={(value) => {
                setSelectedDate(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm ||
            selectedCategory !== "All" ||
            selectedDifficulty !== "All" ||
            selectedDate !== "All") && (
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredEvents.length} of {events.length} events
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          )}
        </section>

        {/* Events Grid */}
        <section className="mb-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">No Events Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ||
                selectedCategory !== "All" ||
                selectedDifficulty !== "All"
                  ? "Try adjusting your filters to see more events."
                  : "No events are currently scheduled. Check back soon!"}
              </p>
              {(searchTerm ||
                selectedCategory !== "All" ||
                selectedDifficulty !== "All") && (
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              )}
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={handleRegister}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </section>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-12">
            <div className="text-center mb-8">
              <Badge className="mb-4">Featured</Badge>
              <h2 className="text-3xl mb-4">Don't Miss These Events</h2>
              <p className="text-muted-foreground">
                Our most popular and highly-rated workshops
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 3).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegister}
                />
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="text-center bg-muted/30 rounded-lg p-12">
          <h2 className="text-3xl mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always adding new workshops and events. Sign up for our
            newsletter to be the first to know about upcoming classes, special
            events, and exclusive workshops.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg">Subscribe to Newsletter</Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onPageChange("contact")}
            >
              Suggest a Workshop
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
