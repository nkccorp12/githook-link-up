import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Calendar, Plane, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TravelEntryForm from "./TravelEntryForm";
import TravelStatistics from "./TravelStatistics";
import TravelTimeline from "./TravelTimeline";
import TravelCalendar from "./TravelCalendar";

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
  ]);
  const [showForm, setShowForm] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const addEntry = (entry: Omit<TimelineEntry, "id">) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setEntries(prev => [...prev, newEntry].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Event gelöscht",
      description: "Der Reise-Eintrag wurde erfolgreich entfernt.",
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      toast({
        title: "Fehler",
        description: "Bitte nur JSON-Dateien ablegen.",
        variant: "destructive",
      });
      return;
    }

    jsonFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          const importedEntries = Array.isArray(jsonData) ? jsonData : [jsonData];
          
          const validEntries: TimelineEntry[] = [];
          
          importedEntries.forEach((item: any) => {
            if (item.date && item.type && item.country && item.city) {
              const entry: TimelineEntry = {
                id: crypto.randomUUID(),
                date: new Date(item.date),
                type: item.type,
                country: item.country,
                city: item.city,
                endDate: item.endDate ? new Date(item.endDate) : undefined,
                accommodationType: item.accommodationType,
                days: item.days,
                flightNumber: item.flightNumber,
                departure: item.departure,
                arrival: item.arrival,
                comments: item.comments,
              };
              validEntries.push(entry);
            }
          });
          
          if (validEntries.length > 0) {
            setEntries(prev => [...prev, ...validEntries].sort((a, b) => a.date.getTime() - b.date.getTime()));
            toast({
              title: "Import erfolgreich",
              description: `${validEntries.length} Einträge wurden hinzugefügt.`,
            });
          } else {
            toast({
              title: "Fehler",
              description: "Keine gültigen Einträge in der JSON-Datei gefunden.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Fehler",
            description: "Die JSON-Datei konnte nicht gelesen werden.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `travel-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export erfolgreich",
      description: "Reise-Daten wurden heruntergeladen.",
    });
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

  const getCurrentLocation = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Finde den aktuellen Aufenthalt basierend auf heutigem Datum
    const currentStay = entries.find(entry => {
      if (entry.type !== 'stay') return false;
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const endDate = entry.endDate ? new Date(entry.endDate) : new Date(entry.date);
      endDate.setHours(23, 59, 59, 999);
      
      return today >= entryDate && today <= endDate;
    });
    
    // Falls kein aktueller Aufenthalt gefunden wird, ist Default Mosbach
    return currentStay || {
      country: 'Deutschland',
      city: 'Mosbach',
      type: 'stay' as const,
      accommodationType: 'other' as const
    };
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={() => setShowForm(true)} 
            size="lg"
            className="bg-gradient-travel hover:shadow-travel transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Neue Reise hinzufügen
          </Button>
          
          {/* Compact Drag & Drop Zone */}
          <Card className={`border-2 border-dashed transition-all duration-300 ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}>
            <CardContent 
              className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors min-w-[280px]"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className={`h-6 w-6 mx-auto mb-2 transition-colors ${
                isDragOver ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <p className="text-sm font-medium text-foreground mb-1">
                JSON-Import
              </p>
              <p className="text-xs text-muted-foreground">
                Dateien hier ablegen
              </p>
            </CardContent>
          </Card>
          
          <Button 
            onClick={exportData}
            variant="outline"
            size="lg"
          >
            <Upload className="h-5 w-5 mr-2 rotate-180" />
            Export JSON
          </Button>
        </div>

        {/* Entry Form Modal */}
        {showForm && (
          <TravelEntryForm 
            onSubmit={addEntry} 
            onCancel={() => setShowForm(false)} 
          />
        )}

        {/* Tabs for Timeline and Calendar */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline">
            <TravelTimeline entries={entries} onDeleteEntry={deleteEntry} />
          </TabsContent>
          <TabsContent value="calendar">
            <TravelCalendar entries={entries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TravelTracker;
