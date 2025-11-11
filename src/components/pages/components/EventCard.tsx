import * as React from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Calendar, MapPin, Users, Clock, Star, Award } from "lucide-react";
import type { Event } from "../../../utils/database-service";
import { toast } from "sonner";

interface EventCardProps {
  event: Event;
  onRegister: (event: Event) => void;
}

export const EventCard = React.forwardRef<HTMLDivElement, EventCardProps>(
  ({ event, onRegister }, ref) => {
    const availableSpots = (event.capacity || 0) - (event.enrolled || 0);
    const isFull = availableSpots <= 0;
    const isAlmostFull = availableSpots > 0 && availableSpots <= 3;

    const handleRegister = () => {
      if (isFull) {
        toast.error("This event is fully booked");
        return;
      }
      onRegister(event);
    };

    const getDifficultyColor = (difficulty?: string) => {
      if (!difficulty) return "";
      switch (difficulty.toLowerCase()) {
        case "beginner":
          return "bg-green-600";
        case "intermediate":
          return "bg-yellow-600";
        case "advanced":
          return "bg-red-600";
        default:
          return "";
      }
    };

    const formatEventDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return (
      <Card
        ref={ref}
        className="overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="aspect-video relative">
          <ImageWithFallback
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {event.category === "Featured" && <Badge>Featured</Badge>}
          </div>
          {event.level && (
            <div className="absolute top-4 right-4">
              <Badge className={getDifficultyColor(event.level)}>
                {event.level}
              </Badge>
            </div>
          )}
          {isAlmostFull && (
            <div className="absolute bottom-4 left-4">
              <Badge variant="destructive">
                Only {availableSpots} spots left!
              </Badge>
            </div>
          )}
          {isFull && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Fully Booked
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">{event.category}</Badge>
          </div>

          <h3 className="text-lg mb-2">{event.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {formatEventDate(event.event_date)} at {event.event_time}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{event.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>
                {availableSpots} of {event.capacity} spots available
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-medium text-primary">
                ${event.price}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                per person
              </span>
            </div>
            <Button
              onClick={handleRegister}
              disabled={isFull}
              className={
                isAlmostFull ? "bg-orange-600 hover:bg-orange-700" : ""
              }
            >
              {isFull ? "Fully Booked" : "Register Now"}
            </Button>
          </div>

          {event.instructor && (
            <div className="mt-4 text-xs text-muted-foreground">
              <strong>Instructor:</strong> {event.instructor}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

EventCard.displayName = "EventCard";
