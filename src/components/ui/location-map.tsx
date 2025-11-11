import { MapPin, Navigation, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  hours: { [key: string]: string };
  coordinates: { lat: number; lng: number };
  features: string[];
  isMain?: boolean;
}

interface LocationMapProps {
  locations: Location[];
  selectedLocation?: string;
  onLocationSelect?: (locationId: string) => void;
}

export function LocationMap({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationMapProps) {
  const mainLocation =
    locations.find((l) => l.isMain) || locations[0];

  // Generate unique ID for this map instance
  const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;

  // Mock map component - in real implementation, this would use Google Maps or similar
  const MapDisplay = () => (
    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200">
        <div className="absolute inset-0 opacity-20">
          <svg
            width="100%"
            height="100%"
            className="text-green-300"
          >
            <defs>
              <pattern
                id={`map-pattern-${mapId}`}
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="1"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={`url(#map-pattern-${mapId})`}
            />
          </svg>
        </div>
      </div>

      {/* Location markers */}
      {locations.map((location, index) => (
        <div
          key={location.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
            selectedLocation === location.id ? "z-10" : "z-0"
          }`}
          style={{
            left: `${30 + index * 15}%`,
            top: `${40 + index * 10}%`,
          }}
          onClick={() => onLocationSelect?.(location.id)}
        >
          <div
            className={`relative group ${selectedLocation === location.id ? "scale-110" : ""} transition-transform`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                location.isMain ? "bg-primary" : "bg-secondary"
              }`}
            >
              <MapPin className="w-3 h-3 text-white" />
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-card border border-border rounded-lg p-2 shadow-lg whitespace-nowrap">
                <p className="text-xs font-medium">
                  {location.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {location.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Map overlay */}
      <div className="absolute bottom-4 right-4">
        <Button size="sm" variant="secondary">
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Map */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">
            Our Locations
          </h3>
          <MapDisplay />
        </CardContent>
      </Card>

      {/* Location Details */}
      <div className="grid gap-4">
        {locations.map((location) => (
          <Card
            key={location.id}
            className={`cursor-pointer transition-colors ${
              selectedLocation === location.id
                ? "ring-2 ring-primary"
                : ""
            }`}
            onClick={() => onLocationSelect?.(location.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">
                      {location.name}
                    </h4>
                    {location.isMain && (
                      <Badge variant="default">
                        Main Store
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{location.address}</p>
                    <p>
                      {location.city}, {location.state}{" "}
                      {location.zipCode}
                    </p>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{location.phone}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Directions
                </Button>
              </div>

              {/* Store Hours */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Store Hours
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(location.hours).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className="flex justify-between"
                      >
                        <span className="font-medium">
                          {day}:
                        </span>
                        <span className="text-muted-foreground">
                          {hours}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {location.features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="outline"
                    className="text-xs"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}