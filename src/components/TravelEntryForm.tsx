import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

interface TravelEntryFormProps {
  onSubmit: (entry: {
    date: Date;
    endDate?: Date;
    type: "stay" | "flight";
    country: string;
    city: string;
    accommodationType?: "airbnb" | "hotel" | "friend" | "other";
    days?: number;
    flightNumber?: string;
    departure?: string;
    arrival?: string;
    comments?: string;
  }) => void;
  onCancel: () => void;
}

const TravelEntryForm: React.FC<TravelEntryFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    type: "stay" as "stay" | "flight",
    country: "",
    city: "",
    accommodationType: "" as "airbnb" | "hotel" | "friend" | "other",
    flightNumber: "",
    departure: "",
    arrival: "",
    comments: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.country || !formData.city || !formData.type) {
      return;
    }

    const baseEntry = {
      date: new Date(formData.startDate),
      type: formData.type,
      country: formData.country,
      city: formData.city,
      comments: formData.comments || undefined,
    };

    if (formData.type === 'stay') {
      if (!formData.endDate || !formData.accommodationType) return;
      
      const days = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      onSubmit({
        ...baseEntry,
        endDate: new Date(formData.endDate),
        accommodationType: formData.accommodationType,
        days,
      });
    } else {
      onSubmit({
        ...baseEntry,
        flightNumber: formData.flightNumber || undefined,
        departure: formData.departure || undefined,
        arrival: formData.arrival || undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-travel">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Neue Reise hinzufügen</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Typ</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: "stay" | "flight") => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wähle Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stay">Aufenthalt</SelectItem>
                  <SelectItem value="flight">Flug</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">{formData.type === 'stay' ? 'Ankunft' : 'Flugdatum'}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              
              {formData.type === 'stay' && (
                <div className="space-y-2">
                  <Label htmlFor="endDate">Abreise</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Land</Label>
              <Input
                id="country"
                placeholder="z.B. Deutschland"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Stadt</Label>
              <Input
                id="city"
                placeholder="z.B. Berlin"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>

            {formData.type === 'stay' && (
              <div className="space-y-2">
                <Label>Unterkunftstyp</Label>
                <Select 
                  value={formData.accommodationType} 
                  onValueChange={(value: "airbnb" | "hotel" | "friend" | "other") => 
                    setFormData(prev => ({ ...prev, accommodationType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle eine Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="friend">Bei Freunden</SelectItem>
                    <SelectItem value="other">Sonstiges</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.type === 'flight' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="flightNumber">Flugnummer (optional)</Label>
                  <Input
                    id="flightNumber"
                    placeholder="z.B. LH441"
                    value={formData.flightNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, flightNumber: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departure">Von</Label>
                    <Input
                      id="departure"
                      placeholder="z.B. Frankfurt"
                      value={formData.departure}
                      onChange={(e) => setFormData(prev => ({ ...prev, departure: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="arrival">Nach</Label>
                    <Input
                      id="arrival"
                      placeholder="z.B. Bangkok"
                      value={formData.arrival}
                      onChange={(e) => setFormData(prev => ({ ...prev, arrival: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="comments">Kommentare / Links (optional)</Label>
              <Textarea
                id="comments"
                placeholder={formData.type === 'flight' ? 'z.B. Zeiten, Terminal...' : 'z.B. Booking-URL, Notizen...'}
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-travel">
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Abbrechen
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelEntryForm;