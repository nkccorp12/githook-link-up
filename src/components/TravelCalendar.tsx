import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import type { TimelineEntry } from "./TravelTracker";
import DayEditor from "./DayEditor";

interface TravelCalendarProps {
  entries: TimelineEntry[];
  onUpdateDay: (date: Date, location: { city: string; country: string }) => void;
  onDeleteDay: (date: Date) => void;
}

const TravelCalendar: React.FC<TravelCalendarProps> = ({ entries, onUpdateDay, onDeleteDay }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEditorOpen, setDayEditorOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const getCountryColor = (country: string) => {
    const colors = {
      'Thailand': 'bg-emerald-500',
      'Deutschland': 'bg-blue-500', 
      'Spanien': 'bg-yellow-500',
      'Bulgarien': 'bg-purple-500',
      'Niederlande': 'bg-orange-500',
      'Österreich': 'bg-red-500',
      'Schweiz': 'bg-red-600',
      'Frankreich': 'bg-indigo-500',
      'Italien': 'bg-green-600',
      'Griechenland': 'bg-cyan-500',
    };
    return colors[country as keyof typeof colors] || 'bg-gray-500';
  };

  const getEntriesForMonth = (monthIndex: number) => {
    return entries.filter(entry => {
      if (entry.type !== 'stay') return false;
      const entryMonth = entry.date.getMonth();
      const entryYear = entry.date.getFullYear();
      const endMonth = entry.endDate ? entry.endDate.getMonth() : entryMonth;
      const endYear = entry.endDate ? entry.endDate.getFullYear() : entryYear;
      
      // Check if the stay spans this month
      return (entryYear === currentYear && entryMonth <= monthIndex && endMonth >= monthIndex) ||
             (entryYear === currentYear && entryMonth === monthIndex) ||
             (endYear === currentYear && endMonth === monthIndex);
    });
  };

  const getDaysInMonth = (monthIndex: number) => {
    return new Date(currentYear, monthIndex + 1, 0).getDate();
  };

  const getStayDaysForMonth = (entry: TimelineEntry, monthIndex: number) => {
    if (entry.type !== 'stay' || !entry.endDate) return [];
    
    const monthStart = new Date(currentYear, monthIndex, 1);
    const monthEnd = new Date(currentYear, monthIndex + 1, 0);
    const stayStart = new Date(Math.max(entry.date.getTime(), monthStart.getTime()));
    const stayEnd = new Date(Math.min(entry.endDate.getTime(), monthEnd.getTime()));
    
    const days = [];
    const current = new Date(stayStart);
    
    while (current <= stayEnd) {
      days.push(current.getDate());
      current.setDate(current.getDate() + 1);
    }
    
  return days;
  };

  const handleDayClick = (day: number, monthIndex: number) => {
    const clickedDate = new Date(currentYear, monthIndex, day);
    setSelectedDate(clickedDate);
    setDayEditorOpen(true);
  };

  const getCurrentLocationForDate = (date: Date) => {
    const dayEntries = entries.filter(entry => {
      if (entry.type !== 'stay') return false;
      const entryDate = new Date(entry.date);
      const endDate = entry.endDate || entry.date;
      
      return date >= entryDate && date <= endDate;
    });
    
    return dayEntries.length > 0 ? dayEntries[0] : null;
  };

  const getAvailableLocationsForMonth = (monthIndex: number) => {
    const monthEntries = getEntriesForMonth(monthIndex);
    const locations = Array.from(new Set(
      monthEntries.map(entry => `${entry.city}|${entry.country}`)
    )).map(location => {
      const [city, country] = location.split('|');
      return { city, country };
    });
    return locations;
  };

  const handleSaveDay = (location: { city: string; country: string }) => {
    if (selectedDate) {
      onUpdateDay(selectedDate, location);
      setDayEditorOpen(false);
    }
  };

  const handleDeleteDay = () => {
    if (selectedDate) {
      onDeleteDay(selectedDate);
      setDayEditorOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        <CalendarDays className="h-6 w-6 text-primary" />
        Jahreskalender {currentYear}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((month, monthIndex) => {
          const monthEntries = getEntriesForMonth(monthIndex);
          const daysInMonth = getDaysInMonth(monthIndex);
          
          return (
            <Card key={month} className="shadow-card hover:shadow-travel transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-center">{month}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {/* Weekday headers */}
                  {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                    <div key={day} className="text-center font-medium text-muted-foreground py-1">
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty cells for first week */}
                  {Array.from({ length: (new Date(currentYear, monthIndex, 1).getDay() + 6) % 7 }, (_, i) => (
                    <div key={`empty-${i}`} className="h-6"></div>
                  ))}
                  
                  {/* Days */}
                  {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                    const day = dayIndex + 1;
                    const dayEntries = monthEntries.filter(entry => 
                      getStayDaysForMonth(entry, monthIndex).includes(day)
                    );
                    
                    return (
                      <div 
                        key={day} 
                        className={`h-6 w-6 flex items-center justify-center text-xs rounded-sm relative cursor-pointer transition-all duration-200 ${
                          dayEntries.length > 0 
                            ? `${getCountryColor(dayEntries[0].country)} text-white font-medium hover:opacity-80` 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        title={dayEntries.length > 0 ? `${dayEntries[0].city}, ${dayEntries[0].country} (Klicken zum Bearbeiten)` : 'Klicken zum Bearbeiten'}
                        onClick={() => handleDayClick(day, monthIndex)}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend for this month */}
                {monthEntries.length > 0 && (
                  <div className="space-y-1 pt-2 border-t">
                    {Array.from(new Set(monthEntries.map(entry => `${entry.city}|${entry.country}`))).map(cityCountry => {
                      const [city, country] = cityCountry.split('|');
                      return (
                        <div key={cityCountry} className="flex items-center gap-2 text-xs">
                          <div className={`w-3 h-3 rounded-full ${getCountryColor(country)}`}></div>
                          <span className="text-muted-foreground">{city}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Day Editor Dialog */}
      <DayEditor
        isOpen={dayEditorOpen}
        onClose={() => setDayEditorOpen(false)}
        selectedDate={selectedDate}
        currentLocation={selectedDate ? getCurrentLocationForDate(selectedDate)?.city : undefined}
        currentCountry={selectedDate ? getCurrentLocationForDate(selectedDate)?.country : undefined}
        availableLocations={selectedDate ? getAvailableLocationsForMonth(selectedDate.getMonth()) : []}
        onSave={handleSaveDay}
        onDelete={handleDeleteDay}
      />
    </div>
  );
};

export default TravelCalendar;