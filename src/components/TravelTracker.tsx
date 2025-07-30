import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MapPin, Calendar, Plane, Upload, ChevronDown, FileText, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [jsonPasteDialog, setJsonPasteDialog] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load entries from Supabase on component mount
  useEffect(() => {
    if (user) {
      loadEntriesFromDatabase();
    }
  }, [user]);

  const loadEntriesFromDatabase = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('travel_entries')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading travel entries:', error);
        toast({
          title: "Fehler beim Laden",
          description: "Die Reiseeinträge konnten nicht geladen werden.",
          variant: "destructive"
        });
        return;
      }

      // Convert database entries to TimelineEntry format
      const timelineEntries: TimelineEntry[] = data.map(entry => ({
        id: entry.id,
        date: new Date(entry.date),
        endDate: entry.end_date ? new Date(entry.end_date) : undefined,
        type: entry.type as "stay" | "flight",
        country: entry.country,
        city: entry.city,
        accommodationType: entry.accommodation_type as "airbnb" | "hotel" | "friend" | "other" | undefined,
        days: entry.days || undefined,
        flightNumber: entry.flight_number || undefined,
        departure: entry.departure || undefined,
        arrival: entry.arrival || undefined,
        comments: entry.comments || undefined
      }));

      setEntries(timelineEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntryToDatabase = async (entry: TimelineEntry) => {
    try {
      const { error } = await supabase
        .from('travel_entries')
        .upsert({
          id: entry.id,
          user_id: user?.id,
          date: entry.date.toISOString(),
          end_date: entry.endDate?.toISOString() || null,
          type: entry.type,
          country: entry.country,
          city: entry.city,
          accommodation_type: entry.accommodationType || null,
          days: entry.days || null,
          flight_number: entry.flightNumber || null,
          departure: entry.departure || null,
          arrival: entry.arrival || null,
          comments: entry.comments || null
        });

      if (error) {
        console.error('Error saving entry:', error);
        toast({
          title: "Fehler beim Speichern",
          description: "Der Eintrag konnte nicht gespeichert werden.",
          variant: "destructive"
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error saving entry:', error);
      return false;
    }
  };

  const deleteEntryFromDatabase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('travel_entries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting entry:', error);
        toast({
          title: "Fehler beim Löschen",
          description: "Der Eintrag konnte nicht gelöscht werden.",
          variant: "destructive"
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
  };

  const addEntry = async (entry: Omit<TimelineEntry, "id">) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    
    const saved = await saveEntryToDatabase(newEntry);
    if (saved) {
      setEntries(prev => [...prev, newEntry].sort((a, b) => a.date.getTime() - b.date.getTime()));
      setShowForm(false);
      toast({
        title: "Eintrag gespeichert",
        description: "Der Reise-Eintrag wurde erfolgreich gespeichert.",
      });
    }
  };

  const deleteEntry = async (id: string) => {
    const deleted = await deleteEntryFromDatabase(id);
    if (deleted) {
      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Event gelöscht",
        description: "Der Reise-Eintrag wurde erfolgreich entfernt.",
      });
    }
  };

  // CRUD functions for individual days
  const updateDay = async (date: Date, location: { city: string; country: string }) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Remove existing entries for this day from database
    const entriesToDelete = entries.filter(entry => {
      if (entry.type !== 'stay') return false;
      const entryDate = new Date(entry.date);
      const entryEndDate = entry.endDate || entry.date;
      
      // Check if entry overlaps with the target day
      return entryDate <= dayEnd && entryEndDate >= dayStart;
    });

    // Delete from database
    for (const entry of entriesToDelete) {
      await deleteEntryFromDatabase(entry.id);
    }

    // Add new entry for this day
    const newEntry: TimelineEntry = {
      id: crypto.randomUUID(),
      date: new Date(date),
      endDate: new Date(date),
      type: 'stay',
      country: location.country,
      city: location.city,
      accommodationType: 'other',
      days: 1
    };

    const saved = await saveEntryToDatabase(newEntry);
    if (saved) {
      // Update local state
      const filteredEntries = entries.filter(entry => {
        if (entry.type !== 'stay') return true;
        const entryDate = new Date(entry.date);
        const entryEndDate = entry.endDate || entry.date;
        
        // Check if entry overlaps with the target day
        return !(entryDate <= dayEnd && entryEndDate >= dayStart);
      });

      setEntries([...filteredEntries, newEntry].sort((a, b) => a.date.getTime() - b.date.getTime()));
      
      toast({
        title: "Tag aktualisiert",
        description: `Aufenthaltsort für ${date.toLocaleDateString('de-DE')} wurde auf ${location.city}, ${location.country} gesetzt.`,
      });
    }
  };

  const updateDayRange = async (location: { city: string; country: string }, startDate: Date, endDate: Date) => {
    // Remove existing entries that overlap with the date range
    const rangeStart = new Date(startDate);
    rangeStart.setHours(0, 0, 0, 0);
    const rangeEnd = new Date(endDate);
    rangeEnd.setHours(23, 59, 59, 999);

    // Find and delete overlapping entries from database
    const entriesToDelete = entries.filter(entry => {
      if (entry.type !== 'stay') return false;
      const entryDate = new Date(entry.date);
      const entryEndDate = entry.endDate || entry.date;
      
      // Keep entries that don't overlap with the target range
      return entryDate <= rangeEnd && entryEndDate >= rangeStart;
    });

    // Delete from database
    for (const entry of entriesToDelete) {
      await deleteEntryFromDatabase(entry.id);
    }

    // Calculate the number of days
    const daysDiff = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Add new entry for the date range
    const newEntry: TimelineEntry = {
      id: crypto.randomUUID(),
      date: new Date(startDate),
      endDate: new Date(endDate),
      type: 'stay',
      country: location.country,
      city: location.city,
      accommodationType: 'other',
      days: daysDiff
    };

    const saved = await saveEntryToDatabase(newEntry);
    if (saved) {
      // Update local state
      const filteredEntries = entries.filter(entry => {
        if (entry.type !== 'stay') return true;
        const entryDate = new Date(entry.date);
        const entryEndDate = entry.endDate || entry.date;
        
        // Keep entries that don't overlap with the target range
        return !(entryDate <= rangeEnd && entryEndDate >= rangeStart);
      });

      setEntries([...filteredEntries, newEntry].sort((a, b) => a.date.getTime() - b.date.getTime()));
      
      toast({
        title: "Zeitraum aktualisiert",
        description: `Aufenthalt von ${startDate.toLocaleDateString('de-DE')} bis ${endDate.toLocaleDateString('de-DE')} in ${location.city}, ${location.country} eingetragen.`,
      });
    }
  };

  const deleteDay = async (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Find entries to delete from database
    const entriesToDelete = entries.filter(entry => {
      if (entry.type !== 'stay') return false;
      const entryDate = new Date(entry.date);
      const entryEndDate = entry.endDate || entry.date;
      
      // Check if entry overlaps with the target day
      return entryDate <= dayEnd && entryEndDate >= dayStart;
    });

    // Delete from database
    for (const entry of entriesToDelete) {
      await deleteEntryFromDatabase(entry.id);
    }

    // Update local state
    const filteredEntries = entries.filter(entry => {
      if (entry.type !== 'stay') return true;
      const entryDate = new Date(entry.date);
      const entryEndDate = entry.endDate || entry.date;
      
      // Keep entries that don't overlap with the target day
      return !(entryDate <= dayEnd && entryEndDate >= dayStart);
    });

    setEntries(filteredEntries);
    
    toast({
      title: "Tag gelöscht",
      description: `Aufenthaltsort für ${date.toLocaleDateString('de-DE')} wurde entfernt.`,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-travel p-4 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground">Reisedaten werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 relative">
          {/* Settings Button in top right - with proper mobile spacing */}
          <div className="absolute -top-2 right-0 md:top-0">
            <div className="scale-75 md:scale-90">
              <SettingsButton entries={entries} />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-primary pr-12 md:pr-0">
            <Plane className="h-6 w-6 md:h-8 md:w-8" />
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-travel bg-clip-text text-transparent">
              Aufenthaltsnachweis
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
                size="default"
                className="bg-gradient-travel hover:shadow-travel transition-all duration-300 px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
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
                <TravelCalendar 
                  entries={entries} 
                  onUpdateDay={updateDay}
                  onUpdateDayRange={updateDayRange}
                  onDeleteDay={deleteDay}
                />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TravelTracker;
