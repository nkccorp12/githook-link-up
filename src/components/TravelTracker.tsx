import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calendar, Plane } from "lucide-react";
import TravelEntryForm from "./TravelEntryForm";
import TravelStatistics from "./TravelStatistics";

export interface TravelEntry {
  id: string;
  startDate: Date;
  endDate: Date;
  country: string;
  city: string;
  accommodationType: "airbnb" | "hotel" | "friend" | "other";
  comments?: string;
  days: number;
}

const TravelTracker = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([
    {
      id: crypto.randomUUID(),
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-11'),
      country: 'Thailand',
      city: 'Chiang Rai',
      accommodationType: 'hotel',
      comments: 'Längerer Aufenthalt zu Jahresbeginn',
      days: 70
    },
    {
      id: crypto.randomUUID(),
      startDate: new Date('2025-03-12'),
      endDate: new Date('2025-04-07'),
      country: 'Deutschland',
      city: 'Frankfurt',
      accommodationType: 'friend',
      comments: 'Aufenthalt nach Thailand-Rückkehr',
      days: 27
    },
    {
      id: crypto.randomUUID(),
      startDate: new Date('2025-04-08'),
      endDate: new Date('2025-04-10'),
      country: 'Deutschland',
      city: 'Frankfurt',
      accommodationType: 'hotel',
      comments: 'Ganztägiger Aufenthalt',
      days: 3
    },
    {
      id: crypto.randomUUID(),
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-04-11'),
      country: 'Deutschland',
      city: 'Heidelberg',
      accommodationType: 'hotel',
      comments: 'Ganztägiger Aufenthalt',
      days: 2
    },
    {
      id: crypto.randomUUID(),
      startDate: new Date('2025-06-12'),
      endDate: new Date('2025-06-12'),
      country: 'Deutschland',
      city: 'Berlin',
      accommodationType: 'other',
      comments: 'Flug DE4087 Frankfurt → Berlin, 14:50-15:55',
      days: 1
    },
    {
      id: crypto.randomUUID(),
      startDate: new Date('2025-06-15'),
      endDate: new Date('2025-06-15'),
      country: 'Deutschland',
      city: 'Frankfurt',
      accommodationType: 'other',
      comments: 'Flug DE4086 Berlin → Frankfurt, 09:00-10:10',
      days: 1
    },
    {
      id: crypto.randomUUID(),
      startDate: new Date('2025-06-24'),
      endDate: new Date('2025-06-25'),
      country: 'Thailand',
      city: 'Bangkok',
      accommodationType: 'hotel',
      comments: 'Hilton Garden Inn Bangkok Silom, Check-in 24.06. 14:00, Check-out 25.06. 12:00',
      days: 2
    },
    {
      id: crypto.randomUUID(),
      startDate: new Date('2025-06-25'),
      endDate: new Date('2025-07-01'),
      country: 'Thailand',
      city: 'Chiang Rai',
      accommodationType: 'hotel',
      comments: 'Flug BKK → CNX (Thai Vietjet Air VZ132), Rückflug am 01.07',
      days: 7
    }
  ]);
  const [showForm, setShowForm] = useState(false);

  const addEntry = (entry: Omit<TravelEntry, "id" | "days">) => {
    const days = Math.ceil((entry.endDate.getTime() - entry.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const newEntry: TravelEntry = {
      ...entry,
      id: crypto.randomUUID(),
      days,
    };
    setEntries(prev => [...prev, newEntry]);
    setShowForm(false);
  };

  const getAccommodationBadgeVariant = (type: string) => {
    switch (type) {
      case "airbnb": return "default";
      case "hotel": return "secondary";
      case "friend": return "outline";
      default: return "destructive";
    }
  };

  const getAccommodationLabel = (type: string) => {
    switch (type) {
      case "airbnb": return "Airbnb";
      case "hotel": return "Hotel";
      case "friend": return "Bei Freunden";
      default: return "Sonstiges";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Plane className="h-8 w-8" />
            <h1 className="text-4xl font-bold bg-gradient-travel bg-clip-text text-transparent">
              Travel Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Dokumentiere deine Reisen und behalte den Überblick über deine Aufenthalte
          </p>
        </div>

        {/* Statistics */}
        <TravelStatistics entries={entries} />

        {/* Action Button */}
        <div className="flex justify-center">
          <Button 
            onClick={() => setShowForm(true)} 
            size="lg"
            className="bg-gradient-travel hover:shadow-travel transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Neue Reise hinzufügen
          </Button>
        </div>

        {/* Entry Form Modal */}
        {showForm && (
          <TravelEntryForm 
            onSubmit={addEntry} 
            onCancel={() => setShowForm(false)} 
          />
        )}

        {/* Entries List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Deine Reisen ({entries.length})
          </h2>
          
          {entries.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Noch keine Reisen erfasst
                </h3>
                <p className="text-muted-foreground">
                  Füge deine erste Reise hinzu, um zu beginnen!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <Card key={entry.id} className="shadow-card hover:shadow-travel transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{entry.city}</span>
                      <Badge variant="outline">{entry.country}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {entry.startDate.toLocaleDateString('de-DE')} - {entry.endDate.toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant={getAccommodationBadgeVariant(entry.accommodationType)}>
                        {getAccommodationLabel(entry.accommodationType)}
                      </Badge>
                      <span className="text-sm font-medium text-primary">
                        {entry.days} Tag{entry.days !== 1 ? 'e' : ''}
                      </span>
                    </div>

                    {entry.comments && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                        {entry.comments}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelTracker;