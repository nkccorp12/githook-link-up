import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Save, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DayEditorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  currentLocation?: string;
  currentCountry?: string;
  availableLocations: Array<{ city: string; country: string }>;
  onSave: (location: { city: string; country: string }) => void;
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
  onDelete
}) => {
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const { toast } = useToast();

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleSave = () => {
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Tag bearbeiten
          </DialogTitle>
          <DialogDescription>
            Aufenthaltsort für {formatDate(selectedDate)} bearbeiten
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Location Display */}
          {currentLocation && (
            <div className="p-3 bg-muted rounded-md">
              <Label className="text-sm font-medium">Aktueller Ort:</Label>
              <p className="text-sm text-muted-foreground">{currentLocation}, {currentCountry}</p>
            </div>
          )}

          {/* Select from existing locations */}
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

          {/* Action Buttons */}
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
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Speichern
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayEditor;