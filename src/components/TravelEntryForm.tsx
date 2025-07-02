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
    startDate: Date;
    endDate: Date;
    country: string;
    city: string;
    accommodationType: "airbnb" | "hotel" | "friend" | "other";
    comments?: string;
  }) => void;
  onCancel: () => void;
}

const TravelEntryForm: React.FC<TravelEntryFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    country: "",
    city: "",
    accommodationType: "" as "airbnb" | "hotel" | "friend" | "other",
    comments: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.country || !formData.city || !formData.accommodationType) {
      return;
    }

    onSubmit({
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      country: formData.country,
      city: formData.city,
      accommodationType: formData.accommodationType,
      comments: formData.comments || undefined,
    });
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ankunft</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              
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

            <div className="space-y-2">
              <Label htmlFor="comments">Kommentare / Links (optional)</Label>
              <Textarea
                id="comments"
                placeholder="z.B. Booking-URL, Notizen..."
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