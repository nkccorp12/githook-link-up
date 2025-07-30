import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Save, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface DayEditorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  currentLocation?: string;
  currentCountry?: string;
  availableLocations: Array<{ city: string; country: string }>;
  onSave: (location: { city: string; country: string }) => void;
  onSaveRange: (location: { city: string; country: string }, dateRange: DateRange) => void;
  onDelete: () => void;
}

const DayEditor: React.FC<DayEditorProps> = ({
  isOpen,
  onClose,
  selectedDate,
  currentLocation,
  currentCountry,
  availableLocations,
  onSave,
  onSaveRange,
  onDelete
}) => {
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleSaveSingleDay = () => {
    let city = '';
    let country = '';

    if (selectedLocation) {
      const [selectedCity, selectedCountry] = selectedLocation.split('|');
      city = selectedCity;
      country = selectedCountry;
    } else if (newCity.trim() && newCountry.trim()) {
      city = newCity.trim();
      country = newCountry.trim();
    } else {
      toast({
        title: "Eingabe erforderlich",
        description: "Bitte wählen Sie einen Ort aus oder geben Sie einen neuen ein.",
        variant: "destructive"
      });
      return;
    }

    onSave({ city, country });
    handleClose();
  };

  const handleSaveRange = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Datumsbereich erforderlich",
        description: "Bitte wählen Sie Start- und Enddatum aus.",
        variant: "destructive"
      });
      return;
    }

    let city = '';
    let country = '';

    if (selectedLocation) {
      const [selectedCity, selectedCountry] = selectedLocation.split('|');
      city = selectedCity;
      country = selectedCountry;
    } else if (newCity.trim() && newCountry.trim()) {
      city = newCity.trim();
      country = newCountry.trim();
    } else {
      toast({
        title: "Eingabe erforderlich",
        description: "Bitte wählen Sie einen Ort aus oder geben Sie einen neuen ein.",
        variant: "destructive"
      });
      return;
    }

    onSaveRange({ city, country }, dateRange);
    handleClose();
  };

  const handleDelete = () => {
    onDelete();
    handleClose();
    toast({
      title: "Tag gelöscht",
      description: "Der Aufenthaltsort für diesen Tag wurde entfernt.",
    });
  };

  const handleClose = () => {
    setNewCity('');
    setNewCountry('');
    setSelectedLocation('');
    setDateRange(undefined);
    setIsRangePickerOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Aufenthaltsort bearbeiten
          </DialogTitle>
          <DialogDescription>
            Einzelnen Tag oder Zeitraum bearbeiten
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Einzelner Tag</TabsTrigger>
            <TabsTrigger value="range">Zeitraum</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-4 mt-4">
            {/* Current Date Display */}
            <div className="p-3 bg-muted rounded-md">
              <Label className="text-sm font-medium">Ausgewähltes Datum:</Label>
              <p className="text-sm text-muted-foreground">{formatDate(selectedDate)}</p>
              {currentLocation && (
                <>
                  <Label className="text-sm font-medium mt-2 block">Aktueller Ort:</Label>
                  <p className="text-sm text-muted-foreground">{currentLocation}, {currentCountry}</p>
                </>
              )}
            </div>

            {/* Location Selection for Single Day */}
            {availableLocations.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="location-select">Aus vorhandenen Orten wählen:</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ort auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocations.map((location) => (
                      <SelectItem 
                        key={`${location.city}|${location.country}`} 
                        value={`${location.city}|${location.country}`}
                      >
                        {location.city}, {location.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Divider */}
            {availableLocations.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex-1 border-t"></div>
                <span className="text-xs text-muted-foreground px-2">ODER</span>
                <div className="flex-1 border-t"></div>
              </div>
            )}

            {/* New location input */}
            <div className="space-y-3">
              <Label>Neuen Ort eingeben:</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="city" className="text-sm">Stadt</Label>
                  <Input
                    id="city"
                    placeholder="z.B. Berlin"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-sm">Land</Label>
                  <Input
                    id="country"
                    placeholder="z.B. Deutschland"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons for Single Day */}
            <div className="flex justify-between gap-2 pt-4">
              {currentLocation && (
                <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={handleClose}>
                  Abbrechen
                </Button>
                <Button onClick={handleSaveSingleDay} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Speichern
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="range" className="space-y-4 mt-4">
            {/* Date Range Picker */}
            <div className="space-y-2">
              <Label>Zeitraum auswählen:</Label>
              <Popover open={isRangePickerOpen} onOpenChange={setIsRangePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd.MM.yyyy")} -{" "}
                          {format(dateRange.to, "dd.MM.yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd.MM.yyyy")
                      )
                    ) : (
                      <span>Von - bis Datum wählen</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={selectedDate || new Date()}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Location Selection for Range */}
            {availableLocations.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="location-select-range">Aus vorhandenen Orten wählen:</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ort auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocations.map((location) => (
                      <SelectItem 
                        key={`${location.city}|${location.country}`} 
                        value={`${location.city}|${location.country}`}
                      >
                        {location.city}, {location.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Divider */}
            {availableLocations.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex-1 border-t"></div>
                <span className="text-xs text-muted-foreground px-2">ODER</span>
                <div className="flex-1 border-t"></div>
              </div>
            )}

            {/* New location input for range */}
            <div className="space-y-3">
              <Label>Neuen Ort eingeben:</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="city-range" className="text-sm">Stadt</Label>
                  <Input
                    id="city-range"
                    placeholder="z.B. Berlin"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country-range" className="text-sm">Land</Label>
                  <Input
                    id="country-range"
                    placeholder="z.B. Deutschland"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons for Range */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button onClick={handleSaveRange} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Zeitraum speichern
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DayEditor;