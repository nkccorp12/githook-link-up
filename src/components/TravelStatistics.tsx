import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Globe, Calendar, AlertTriangle } from "lucide-react";
import type { TimelineEntry } from "./TravelTracker";

interface TravelStatisticsProps {
  entries: TimelineEntry[];
}

const TravelStatistics: React.FC<TravelStatisticsProps> = ({ entries }) => {
  // Calculate statistics - only for stays
  const currentYear = new Date().getFullYear();
  const stayEntries = entries.filter(entry => entry.type === 'stay');
  const totalDays = stayEntries.reduce((sum, entry) => sum + (entry.days || 0), 0);
  
  // Group by country - only stays
  const countryStats = stayEntries.reduce((acc, entry) => {
    if (!acc[entry.country]) {
      acc[entry.country] = 0;
    }
    acc[entry.country] += entry.days || 0;
    return acc;
  }, {} as Record<string, number>);

  const sortedCountries = Object.entries(countryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5); // Top 5 countries

  // Calculate percentages
  const getPercentage = (days: number) => {
    return totalDays > 0 ? ((days / 365) * 100).toFixed(1) : "0";
  };

  // Warning check (183 days rule for tax residency)
  const getWarningCountries = () => {
    return Object.entries(countryStats).filter(([, days]) => days >= 183);
  };

  const warningCountries = getWarningCountries();

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Days */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Gesamttage {currentYear}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-2xl font-bold text-primary">{totalDays}</div>
          <p className="text-xs text-muted-foreground">
            von 365 Tagen ({((totalDays / 365) * 100).toFixed(1)}%)
          </p>
          <Progress value={(totalDays / 365) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {/* Countries Count */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Länder besucht
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-2xl font-bold text-accent">{Object.keys(countryStats).length}</div>
          <p className="text-xs text-muted-foreground">
            verschiedene Länder
          </p>
        </CardContent>
      </Card>

      {/* Entries Count */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reiseeinträge
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-2xl font-bold text-success">{stayEntries.length}</div>
          <p className="text-xs text-muted-foreground">
            erfasste Reisen
          </p>
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card className={`shadow-card ${warningCountries.length > 0 ? 'border-warning' : ''}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className={`h-4 w-4 ${warningCountries.length > 0 ? 'text-warning' : ''}`} />
            183-Tage-Regel
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {warningCountries.length > 0 ? (
            <div>
              <div className="text-2xl font-bold text-warning">{warningCountries.length}</div>
              <p className="text-xs text-warning">
                Länder über Grenzwert
              </p>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold text-success">✓</div>
              <p className="text-xs text-muted-foreground">
                Alle Länder unter 183 Tagen
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Country Breakdown */}
      {sortedCountries.length > 0 && (
        <Card className="shadow-card md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Tage pro Land
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedCountries.map(([country, days]) => (
                <div key={country} className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{country}</span>
                        {days >= 183 && (
                          <Badge variant="destructive" className="text-xs">
                            Steuerresidenz
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline">
                        {days} Tag{days !== 1 ? 'e' : ''}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getPercentage(days)}% des Jahres
                    </div>
                  </div>
                  <Progress value={(days / 365) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TravelStatistics;