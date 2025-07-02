import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calendar, Plane } from "lucide-react";
import TravelEntryForm from "./TravelEntryForm";
import TravelStatistics from "./TravelStatistics";
import TravelTimeline from "./TravelTimeline";

export interface TimelineEntry {
  id: string;
  date: Date;
  type: "stay" | "flight";
  country: string;
  city: string;
  // For stays
  endDate?: Date;
  accommodationType?: "airbnb" | "hotel" | "friend" | "other";
  days?: number;
  // For flights
  flightNumber?: string;
  departure?: string;
  arrival?: string;
  comments?: string;
}

const TravelTracker = () => {
  const [entries, setEntries] = useState<TimelineEntry[]>([
    // Thailand Januar-März
    {
      id: crypto.randomUUID(),
      date: new Date('2025-01-01'),
      endDate: new Date('2025-03-11'),
      type: 'stay',
      country: 'Thailand',
      city: 'Chiang Rai',
      accommodationType: 'hotel',
      comments: 'Längerer Aufenthalt zu Jahresbeginn',
      days: 70
    },
    // Rückflug nach Deutschland
    {
      id: crypto.randomUUID(),
      date: new Date('2025-03-11'),
      type: 'flight',
      country: 'Deutschland',
      city: 'Frankfurt',
      flightNumber: 'Rückflug',
      departure: 'Bangkok',
      arrival: 'Frankfurt',
      comments: 'Rückflug nach Deutschland'
    },
    // Frankfurt Hotel März-April
    {
      id: crypto.randomUUID(),
      date: new Date('2025-03-12'),
      endDate: new Date('2025-04-01'),
      type: 'stay',
      country: 'Deutschland',
      city: 'Frankfurt',
      accommodationType: 'hotel',
      comments: 'Hotel-Aufenthalt nach Thailand-Rückkehr',
      days: 21
    },
    // Mosbach ab April (Standard-Aufenthalt)
    {
      id: crypto.randomUUID(),
      date: new Date('2025-04-01'),
      endDate: new Date('2025-06-12'),
      type: 'stay',
      country: 'Deutschland',
      city: 'Mosbach',
      accommodationType: 'other',
      comments: 'Standard-Aufenthalt in Mosbach',
      days: 72
    },
    // Berlin Flug hin
    {
      id: crypto.randomUUID(),
      date: new Date('2025-06-12'),
      type: 'flight',
      country: 'Deutschland',
      city: 'Berlin',
      flightNumber: 'DE4087',
      departure: 'Frankfurt (FRA)',
      arrival: 'Berlin (BER)',
      comments: '14:50-15:55'
    },
    // Berlin Aufenthalt
    {
      id: crypto.randomUUID(),
      date: new Date('2025-06-12'),
      endDate: new Date('2025-06-15'),
      type: 'stay',
      country: 'Deutschland',
      city: 'Berlin',
      accommodationType: 'hotel',
      comments: 'Berlin-Trip',
      days: 3
    },
    // Berlin Rückflug
    {
      id: crypto.randomUUID(),
      date: new Date('2025-06-15'),
      type: 'flight',
      country: 'Deutschland',
      city: 'Frankfurt',
      flightNumber: 'DE4086',
      departure: 'Berlin (BER)',
      arrival: 'Frankfurt (FRA)',
      comments: '09:00-10:10'
    },
    // Zurück nach Mosbach
    {
      id: crypto.randomUUID(),
      date: new Date('2025-06-15'),
      endDate: new Date('2025-06-23'),
      type: 'stay',
      country: 'Deutschland',
      city: 'Mosbach',
      accommodationType: 'other',
      comments: 'Zurück in Mosbach nach Berlin',
      days: 8
    },
    // Thailand Flug
    {
      id: crypto.randomUUID(),
      date: new Date('2025-06-23'),
      type: 'flight',
      country: 'Thailand',
      city: 'Bangkok',
      flightNumber: 'Frankfurt → Bangkok',
      departure: 'Frankfurt',
      arrival: 'Bangkok',
      comments: '22:10 CET → 14:30 (+1 Tag)'
    },
    // Bangkok Aufenthalt
    {
      id: crypto.randomUUID(),
      date: new Date('2025-06-24'),
      endDate: new Date('2025-06-25'),
      type: 'stay',
      country: 'Thailand',
      city: 'Bangkok',
      accommodationType: 'hotel',
      comments: 'Hilton Garden Inn Bangkok Silom',
      days: 2
    },
    // Flug nach Chiang Rai
    {
      id: crypto.randomUUID(),
      date: new Date('2025-06-25'),
      type: 'flight',
      country: 'Thailand',
      city: 'Chiang Rai',
      flightNumber: 'VZ132',
      departure: 'Bangkok (BKK)',
      arrival: 'Chiang Rai (CNX)',
      comments: '13:30-14:55'
    },
    // Chiang Rai Aufenthalt
    {
      id: crypto.randomUUID(),
      date: new Date('2025-06-25'),
      endDate: new Date('2025-07-01'),
      type: 'stay',
      country: 'Thailand',
      city: 'Chiang Rai',
      accommodationType: 'hotel',
      comments: 'Aufenthalt bis Rückflug',
      days: 7
    },
    // Zurück nach Deutschland (impliziert)
    {
      id: crypto.randomUUID(),
      date: new Date('2025-07-01'),
      type: 'flight',
      country: 'Deutschland',
      city: 'Frankfurt',
      flightNumber: 'Rückflug',
      departure: 'Chiang Rai/Bangkok',
      arrival: 'Frankfurt',
      comments: 'Rückflug nach Deutschland'
    },
    // Zurück nach Mosbach
    {
      id: crypto.randomUUID(),
      date: new Date('2025-07-02'),
      endDate: new Date('2025-07-04'),
      type: 'stay',
      country: 'Deutschland',
      city: 'Mosbach',
      accommodationType: 'other',
      comments: 'Zurück in Mosbach nach Thailand',
      days: 2
    },
    // Barcelona Flug hin
    {
      id: crypto.randomUUID(),
      date: new Date('2025-07-04'),
      type: 'flight',
      country: 'Spanien',
      city: 'Barcelona',
      flightNumber: 'Hinflug',
      departure: 'Deutschland',
      arrival: 'Barcelona',
      comments: 'Freitag Abflug'
    },
    // Barcelona Aufenthalt
    {
      id: crypto.randomUUID(),
      date: new Date('2025-07-04'),
      endDate: new Date('2025-07-07'),
      type: 'stay',
      country: 'Spanien',
      city: 'Barcelona',
      accommodationType: 'hotel',
      comments: 'Wochenend-Trip',
      days: 4
    },
    // Barcelona Rückflug
    {
      id: crypto.randomUUID(),
      date: new Date('2025-07-07'),
      type: 'flight',
      country: 'Deutschland',
      city: 'Frankfurt',
      flightNumber: 'Rückflug',
      departure: 'Barcelona',
      arrival: 'Deutschland',
      comments: 'Montag Rückflug'
    },
    // Zurück nach Mosbach (Standard bis Jahresende)
    {
      id: crypto.randomUUID(),
      date: new Date('2025-07-07'),
      endDate: new Date('2025-12-31'),
      type: 'stay',
      country: 'Deutschland',
      city: 'Mosbach',
      accommodationType: 'other',
      comments: 'Standard-Aufenthalt in Mosbach bis Jahresende',
      days: 177
    }
  ]);
  const [showForm, setShowForm] = useState(false);

  const addEntry = (entry: Omit<TimelineEntry, "id">) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: crypto.randomUUID(),
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

        {/* Timeline */}
        <TravelTimeline entries={entries} />
      </div>
    </div>
  );
};

export default TravelTracker;
