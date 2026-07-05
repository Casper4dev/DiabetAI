import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Hospital, Salad, Dumbbell, BarChart3, Brain, CalendarDays, Download, Share2, BookOpen } from "lucide-react";
import { findPatient, PatientProfile } from "@/lib/patientData";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type RiskLevel = "High" | "Moderate" | "Low";

const actionPlans: Record<RiskLevel, { medical: string[]; diet: string[]; exercise: string[]; monitoring: string[]; wellness: string[] }> = {
  High: {
    medical: ["Urgent consultation within 7 days", "Fortnightly HbA1c monitoring", "Complication screening referrals"],
    diet: ["Eliminate refined sugars immediately", "Low-GI diet with portion control", "Dietitian referral within 2 weeks"],
    exercise: ["Light activity: 15–20 min walks daily", "Avoid intense unsupervised exercise", "Target 150 min/week when cleared"],
    monitoring: ["Daily home glucose monitoring", "Track weight, BP & symptoms", "Full panel in 4 weeks"],
    wellness: ["Counselling or support group encouraged", "Prioritise 7–9 hrs sleep", "Quit smoking immediately, zero alcohol"],
  },
  Moderate: {
    medical: ["Follow-up within 30 days", "Repeat tests in 6–8 weeks", "Discuss prediabetes management"],
    diet: ["Reduce processed foods", "Increase fibre, balanced plate model", "Consider dietary consultation"],
    exercise: ["30 min moderate activity 5 days/week", "Strength training 2x/week", "Reduce prolonged sitting"],
    monitoring: ["Blood glucose every 2–4 weeks", "Monthly weight & BMI tracking", "Reassessment in 8 weeks"],
    wellness: ["Active stress management", "7–8 hrs sleep nightly", "Reduce alcohol, avoid smoking"],
  },
  Low: {
    medical: ["Annual screening recommended", "Routine check-ups every 6–12 months", "No immediate intervention needed"],
    diet: ["Maintain balanced varied diet", "Stay hydrated", "Limit alcohol and sugar"],
    exercise: ["Maintain current routine", "150 min/week mixed cardio & strength", "Stay consistent"],
    monitoring: ["Annual HbA1c check", "Monthly self-monitoring", "No intensive monitoring needed"],
    wellness: ["Maintain good sleep & stress habits", "Stay socially connected", "Avoid smoking, limit alcohol"],
  },
};

const actionCards = [
  { key: "medical" as const, icon: Hospital, label: "Medical Actions", emoji: "🏥" },
  { key: "diet" as const, icon: Salad, label: "Dietary Recommendations", emoji: "🥗" },
  { key: "exercise" as const, icon: Dumbbell, label: "Physical Activity Plan", emoji: "🏃" },
  { key: "monitoring" as const, icon: BarChart3, label: "Monitoring & Follow-Up", emoji: "📊" },
  { key: "wellness" as const, icon: Brain, label: "Mental & Lifestyle Wellness", emoji: "🧠" },
];

const resources = [
  { emoji: "📘", title: "Understanding Diabetes", desc: "What diabetes is, how it develops, and what it means for you.", color: "border-t-teal", url: "https://books.google.com/books?hl=en&lr=&id=jryKBkyZjl8C&oi=fnd&pg=PR1&dq=Understanding+Diabetes&ots=_9dFDJ0ekb&sig=7uG9gs1uv1SAga_SX6v_dn18rfA" },
  { emoji: "🥦", title: "Nutrition & Blood Sugar", desc: "How food affects glucose levels and what to eat for metabolic health.", color: "border-t-success", url: "https://nutritionsource.hsph.harvard.edu/carbohydrates/carbohydrates-and-blood-sugar/" },
  { emoji: "🏋️", title: "Exercise & Insulin Sensitivity", desc: "Why movement is one of the most powerful tools against diabetes.", color: "border-t-risk-moderate", url: "https://www.thieme-connect.com/products/all/doi/10.1055/s-2000-8847" },
  { emoji: "💊", title: "Medication Basics", desc: "Common diabetes medications explained in plain language.", color: "border-t-coral", url: "https://journals.lww.com/orthopaedicnursing/fulltext/2006/05000/diabetes_and_diabetes_medications.15.aspx" },
];

const NextSteps = () => {
  const [inputId, setInputId] = useState("");
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [error, setError] = useState("");

  const { bookings, assessments } = useAppContext();
  const navigate = useNavigate();

  const handleLookup = () => {
    const p = findPatient(inputId.trim(), assessments);
    if (p) { setPatient(p); setError(""); }
    else { setError("Patient ID not found."); setPatient(null); }
  };

  const latestRecord = patient?.records[0];
  const risk = latestRecord?.result.level as RiskLevel | undefined;
  const plan = risk ? actionPlans[risk] : null;
  const patientBooking = patient ? bookings.find((b) => b.patientId === patient.id) : null;

  const bannerStyles: Record<RiskLevel, string> = {
    High: "bg-risk-high/10 border-risk-high/30 text-risk-high",
    Moderate: "bg-risk-moderate/10 border-risk-moderate/30 text-risk-moderate",
    Low: "bg-teal/10 border-teal/30 text-teal",
  };
  const bannerMessages: Record<RiskLevel, string> = {
    High: "Immediate clinical attention is recommended.",
    Moderate: "Lifestyle changes and closer monitoring are advised.",
    Low: "Keep up the good work. Maintain your current habits.",
  };
  const riskEmoji: Record<RiskLevel, string> = { High: "🔴", Moderate: "🟡", Low: "🟢" };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Lookup */}
      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter Patient ID or Name (e.g. DAI-00101 or Amara Okonkwo)"
              value={inputId}
              onChange={(e) => { setInputId(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              className="sm:max-w-xs"
            />
            <Button onClick={handleLookup} className="bg-teal hover:bg-teal-light text-primary-foreground font-semibold gap-1.5">
              <Search className="h-4 w-4" /> Load My Plan
            </Button>
          </div>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      {patient && risk && plan && latestRecord && (
        <>
          {/* Risk Banner */}
          <div className={`border rounded-lg p-6 animate-fade-in ${bannerStyles[risk]}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-4xl">{riskEmoji[risk]}</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{risk} Risk</h2>
                <p className="text-sm font-medium mt-1">{bannerMessages[risk]}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs opacity-80">
                  <span>Patient: {patient.name}</span>
                  <span>Last Test: {latestRecord.date}</span>
                  <span>Score: {latestRecord.result.percentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionCards.map((ac) => (
              <Card key={ac.key} className="animate-fade-in">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span>{ac.emoji}</span> {ac.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan[ac.key].map((item, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-teal mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            {/* Appointment Card */}
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span>📅</span> Appointment Reminder
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patientBooking ? (
                  <div className="space-y-2 text-xs">
                    <p><span className="text-muted-foreground">Doctor:</span> {patientBooking.doctorName}</p>
                    <p><span className="text-muted-foreground">Date:</span> {patientBooking.date} · {patientBooking.time}</p>
                    <p><span className="text-muted-foreground">Type:</span> {patientBooking.type}</p>
                    <Badge variant="outline">{patientBooking.reference}</Badge>
                    <Button variant="link" size="sm" className="p-0 text-xs text-teal" onClick={() => navigate("/consultations")}>
                      Reschedule →
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-xs text-muted-foreground">You don't have a consultation booked yet.</p>
                    <Button size="sm" className="bg-teal hover:bg-teal-light text-primary-foreground text-xs" onClick={() => navigate("/consultations")}>
                      <CalendarDays className="h-3.5 w-3.5 mr-1" /> Book Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Download banner */}
          <div className="bg-muted/50 border rounded-lg p-6 flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-sm">Download or Share Your Action Plan</h3>
              <p className="text-xs text-muted-foreground mt-1">Save a copy or send it directly to your clinician.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Download feature coming soon. Please screenshot or print this page.")}>
                <Download className="h-3.5 w-3.5" /> Download My Action Plan
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Download feature coming soon. Please screenshot or print this page.")}>
                <Share2 className="h-3.5 w-3.5" /> Share with My Doctor
              </Button>
            </div>
          </div>

          {/* Educational Resources */}
          <div className="space-y-3 animate-fade-in">
            <h3 className="font-semibold text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-teal" /> Learn More About Managing Your Health</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {resources.map((r) => (
                <Card key={r.title} className={`min-w-[220px] max-w-[260px] flex-shrink-0 border-t-4 ${r.color}`}>
                  <CardContent className="pt-4 space-y-2">
                    <p className="text-2xl">{r.emoji}</p>
                    <h4 className="font-semibold text-sm">{r.title}</h4>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                    <Button asChild variant="link" size="sm" className="p-0 text-xs text-teal">
                      <a href={r.url} target="_blank" rel="noopener noreferrer">Read More →</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NextSteps;
