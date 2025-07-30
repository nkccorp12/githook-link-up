import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import type { TimelineEntry } from "./TravelTracker";

interface TravelCalendarProps {
  entries: TimelineEntry[];
}

const TravelCalendar: React.FC<TravelCalendarProps> = ({ entries }) => {
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
                        className={`h-6 w-6 flex items-center justify-center text-xs rounded-sm relative ${
                          dayEntries.length > 0 
                            ? `${getCountryColor(dayEntries[0].country)} text-white font-medium` 
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                        title={dayEntries.length > 0 ? `${dayEntries[0].city}, ${dayEntries[0].country}` : ''}
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
    </div>
  );
};

export default TravelCalendar;