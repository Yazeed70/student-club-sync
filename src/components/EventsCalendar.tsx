
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/contexts/ApiContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EventsCalendar() {
  const { events, clubs } = useApi();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Filter only approved events
  const approvedEvents = events.filter(event => event.status === 'approved');
  
  // Get events for the selected date
  const eventsOnDate = selectedDate 
    ? approvedEvents.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === selectedDate.toDateString();
      })
    : [];
  
  // Function to highlight dates with events
  const isDayWithEvent = (day: Date) => {
    return approvedEvents.some(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === day.toDateString();
    });
  };
  
  // Get club name
  const getClubName = (clubId: string) => {
    return clubs.find(club => club.id === clubId)?.name || 'Unknown Club';
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 card-with-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Events Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiersStyles={{
              today: { fontWeight: "bold", border: "2px solid #3b6dff" },
              event: { backgroundColor: "#3b6dff20" }
            }}
            modifiers={{
              event: date => isDayWithEvent(date),
            }}
          />
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/20"></div>
              <span>Event Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-primary"></div>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2 card-with-hover">
        <CardHeader>
          <CardTitle>
            {selectedDate ? (
              <span>Events on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            ) : (
              <span>Select a date to view events</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventsOnDate.length > 0 ? (
            <ul className="space-y-4">
              {eventsOnDate.map(event => (
                <li key={event.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getClubName(event.clubId)} • {' '}
                        {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {' '}
                        {event.location}
                      </p>
                      <p className="text-sm mt-1 line-clamp-1">{event.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="self-start sm:self-center"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {selectedDate ? (
                <p>No events scheduled for this date.</p>
              ) : (
                <p>Select a date to view events.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
