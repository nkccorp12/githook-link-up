import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, Calendar, Hotel, Home, Users } from "lucide-react";
import type { TimelineEntry } from "./TravelTracker";

interface TravelTimelineProps {
  entries: TimelineEntry[];
}

const getCountryColor = (country: string) => {
  const colors = {
    'Thailand': 'bg-emerald-500',
    'Deutschland': 'bg-blue-500', 
    'Spanien': 'bg-yellow-500',
  };
  return colors[country as keyof typeof colors] || 'bg-gray-500';
};

const getAccommodationIcon = (type?: string) => {
  switch (type) {
    case "hotel": return <Hotel className="h-4 w-4" />;
    case "friend": return <Users className="h-4 w-4" />;
    case "airbnb": return <Home className="h-4 w-4" />;
    default: return <MapPin className="h-4 w-4" />;
  }
};

const getAccommodationLabel = (type?: string) => {
  switch (type) {
    case "airbnb": return "Airbnb";
    case "hotel": return "Hotel";
    case "friend": return "Bei Freunden";
    default: return "Sonstiges";
  }
};

const TravelTimeline: React.FC<TravelTimelineProps> = ({ entries }) => {
  const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        <Calendar className="h-6 w-6 text-primary" />
        Reise Timeline ({entries.length})
      </h2>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {sortedEntries.map((entry, index) => (
            <div key={entry.id} className="relative flex items-start gap-4">
              {/* Timeline dot */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${getCountryColor(entry.country)}`}>
                {entry.type === 'flight' ? (
                  <Plane className="h-5 w-5 text-white" />
                ) : (
                  getAccommodationIcon(entry.accommodationType)
                )}
              </div>
              
              {/* Content */}
              <Card className="flex-1 shadow-card hover:shadow-travel transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">{entry.city}</span>
                      <Badge variant="outline">{entry.country}</Badge>
                    </CardTitle>
                    <Badge variant={entry.type === 'flight' ? 'destructive' : 'default'}>
                      {entry.type === 'flight' ? 'Flug' : 'Aufenthalt'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {entry.type === 'stay' ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {entry.date.toLocaleDateString('de-DE')} - {entry.endDate?.toLocaleDateString('de-DE')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getAccommodationIcon(entry.accommodationType)}
                          {getAccommodationLabel(entry.accommodationType)}
                        </Badge>
                        <span className="text-sm font-medium text-primary">
                          {entry.days} Tag{entry.days !== 1 ? 'e' : ''}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{entry.date.toLocaleDateString('de-DE')}</span>
                      </div>
                      
                      {entry.flightNumber && (
                        <Badge variant="outline" className="text-xs">
                          {entry.flightNumber}
                        </Badge>
                      )}
                      
                      {entry.departure && entry.arrival && (
                        <div className="text-sm text-muted-foreground">
                          {entry.departure} → {entry.arrival}
                        </div>
                      )}
                    </>
                  )}

                  {entry.comments && (
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                      {entry.comments}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelTimeline;