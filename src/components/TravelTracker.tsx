import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MapPin, Calendar, Plane, Upload, ChevronDown, FileText, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TravelEntryForm from "./TravelEntryForm";
import TravelStatistics from "./TravelStatistics";
import TravelTimeline from "./TravelTimeline";
import TravelCalendar from "./TravelCalendar";
import SettingsButton from "./SettingsButton";

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
  const [jsonPasteDialog, setJsonPasteDialog] = useState(false);
  const [jsonText, setJsonText] = useState('');
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

  const handleJsonPaste = () => {
    try {
      const jsonData = JSON.parse(jsonText);
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
        setJsonPasteDialog(false);
        setJsonText('');
      } else {
        toast({
          title: "Fehler",
          description: "Keine gültigen Einträge gefunden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ungültiges JSON-Format.",
        variant: "destructive",
      });
    }
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
        <div className="text-center space-y-2 relative">
          {/* Settings Button in top right - with proper mobile spacing */}
          <div className="absolute -top-2 right-0 md:top-0">
            <SettingsButton entries={entries} />
          </div>
          
          <div className="flex items-center justify-center gap-2 text-primary pr-12 md:pr-0">
            <Plane className="h-6 w-6 md:h-8 md:w-8" />
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-travel bg-clip-text text-transparent">
              Travel Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-lg px-4">
            Dokumentiere deine Reisen und behalte den Überblick über deine Aufenthalte
          </p>
        </div>

        {/* Statistics */}
        <TravelStatistics entries={entries} />

        {/* Action Buttons */}
        <div className="flex justify-center">
          {/* Neue Reise hinzufügen Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="lg"
                className="bg-gradient-travel hover:shadow-travel transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Neue Reise hinzufügen
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 bg-background border shadow-lg z-50">
              <DropdownMenuItem onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                <span>Manuell eingeben</span>
              </DropdownMenuItem>
              <Dialog open={jsonPasteDialog} onOpenChange={setJsonPasteDialog}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>JSON einfügen</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>JSON-Daten einfügen</DialogTitle>
                    <DialogDescription>
                      Füge JSON-Daten mit Reise-Einträgen ein. Das Format sollte ein Array oder einzelne Objekte mit den Feldern: date, type, country, city enthalten.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder='[{"date": "2025-01-01", "type": "stay", "country": "Deutschland", "city": "Berlin", ...}]'
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setJsonPasteDialog(false)}>
                        Abbrechen
                      </Button>
                      <Button onClick={handleJsonPaste}>
                        Importieren
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Entry Form Modal */}
        {showForm && (
          <TravelEntryForm 
            onSubmit={addEntry} 
            onCancel={() => setShowForm(false)} 
          />
        )}

        {/* Tabs for Timeline and Calendar */}
        <Tabs defaultValue="calendar" className="w-full">
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
