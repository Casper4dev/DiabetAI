import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CheckCircle, Clock, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DOCTORS, Doctor } from "@/lib/doctorData";
import { useAppContext, Booking } from "@/context/AppContext";
import { toast } from "sonner";

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];

const Consultations = () => {
  const { bookings, addBooking } = useAppContext();
  const [tab, setTab] = useState("book");
  const [patientId, setPatientId] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [consultType, setConsultType] = useState<"In-Person" | "Video Call">("In-Person");
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctor || !date || !time || !reason.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    const ref = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const booking: Booking = {
      id: crypto.randomUUID(),
      patientId: patientId.toUpperCase(),
      doctorName: doctor,
      date: format(date, "yyyy-MM-dd"),
      time,
      type: consultType,
      reason: reason.trim(),
      reference: ref,
    };
    addBooking(booking);
    setConfirmation(booking);
  };

  const selectDoctor = (d: Doctor) => {
    setDoctor(d.name);
    setTab("book");
  };

  const patientBookings = bookings.filter((b) => b.patientId === patientId.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="book">Book a Consultation</TabsTrigger>
          <TabsTrigger value="doctors">Our Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="mt-6 space-y-6">
          {confirmation ? (
            <Card className="animate-fade-in border-teal/30 bg-teal/5">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-teal" />
                  <div>
                    <h3 className="text-lg font-bold">Booking Confirmed</h3>
                    <p className="text-sm text-muted-foreground">You will be contacted by our team to confirm your appointment.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Reference</span><p className="font-bold text-teal">{confirmation.reference}</p></div>
                  <div><span className="text-muted-foreground">Doctor</span><p className="font-medium">{confirmation.doctorName}</p></div>
                  <div><span className="text-muted-foreground">Date</span><p className="font-medium">{confirmation.date}</p></div>
                  <div><span className="text-muted-foreground">Time</span><p className="font-medium">{confirmation.time}</p></div>
                  <div><span className="text-muted-foreground">Type</span><p className="font-medium">{confirmation.type}</p></div>
                </div>
                <Button variant="outline" onClick={() => setConfirmation(null)}>Book Another</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Stethoscope className="h-5 w-5 text-teal" /> Book a Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBook} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Patient ID</Label>
                    <Input placeholder="DAI-XXXXX" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Select a Doctor</Label>
                    <Select value={doctor} onValueChange={setDoctor}>
                      <SelectTrigger><SelectValue placeholder="Choose doctor" /></SelectTrigger>
                      <SelectContent>
                        {DOCTORS.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < new Date(new Date().toDateString())}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Preferred Time Slot</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger><SelectValue placeholder="Choose time" /></SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Consultation Type</Label>
                    <div className="flex gap-4">
                      {(["In-Person", "Video Call"] as const).map((t) => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
                          <input type="radio" name="type" checked={consultType === t} onChange={() => setConsultType(t)} className="accent-[hsl(var(--teal))]" />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Reason for Consultation</Label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                      maxLength={300}
                      placeholder="Briefly describe your concern..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground text-right">{reason.length}/300</p>
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" className="bg-teal hover:bg-teal-light text-primary-foreground font-semibold px-8">
                      Confirm Booking
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {patientBookings.length > 0 && (
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-teal" /> Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {patientBookings.map((b) => (
                  <div key={b.id} className="flex flex-wrap items-center gap-3 p-3 border rounded-md text-sm">
                    <Badge variant="outline">{b.reference}</Badge>
                    <span className="font-medium">{b.doctorName}</span>
                    <span className="text-muted-foreground">{b.date} · {b.time}</span>
                    <Badge className="bg-teal/10 text-teal border-teal/30">{b.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="doctors" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCTORS.map((d) => (
              <Card key={d.id} className="animate-fade-in">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm", d.color)}>
                      {d.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{d.name}</h4>
                      <p className="text-xs text-muted-foreground">{d.title}</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><span className="text-muted-foreground">Specialisation:</span> {d.specialisation}</p>
                    <p><span className="text-muted-foreground">Experience:</span> {d.years} years</p>
                  </div>
                  <Badge className={d.availableToday ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground"}>
                    {d.availability}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => selectDoctor(d)}
                  >
                    Book with This Doctor
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Consultations;
