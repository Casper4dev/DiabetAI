import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Activity, User, LogOut, TrendingUp, AlertTriangle, FileText } from "lucide-react";
import { findPatient, PatientProfile } from "@/lib/patientData";
import { useAppContext } from "@/context/AppContext";
import { generateSHAPData, generateLIMEData } from "@/lib/riskCalculator";
import ExplainabilityPanel from "@/components/ExplainabilityPanel";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const riskBadge: Record<string, string> = {
  High: "bg-risk-high text-primary-foreground",
  Moderate: "bg-risk-moderate text-primary-foreground",
  Low: "bg-risk-low text-primary-foreground",
};

const PatientPortal = () => {
  const [inputId, setInputId] = useState("");
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [error, setError] = useState("");
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const { assessments } = useAppContext();

  const handleLookup = () => {
    const p = findPatient(inputId.trim(), assessments);
    if (p) { setPatient(p); setError(""); }
    else { setError("Patient ID not found. Please check with your clinician."); setPatient(null); }
  };

  const handleSignOut = () => { setPatient(null); setInputId(""); setError(""); setExpandedRecord(null); };

  if (!patient) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-teal rounded-xl p-3 w-fit">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl">DiabetAI Patient Portal</CardTitle>
            <CardDescription>Access your diagnostic records securely.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Input
                placeholder="Enter Patient ID or Name (e.g. DAI-00101 or Amara Okonkwo)"
                value={inputId}
                onChange={(e) => { setInputId(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
              {error && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {error}
                </p>
              )}
            </div>
            <Button onClick={handleLookup} className="w-full bg-teal hover:bg-teal-light text-primary-foreground font-semibold">
              View My Records
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Your Patient ID was assigned to you by your clinician at registration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const trendData = [...patient.records].reverse().map((r) => ({
    date: r.date,
    score: r.result.percentage,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold">Welcome, {patient.name}</h2>
          <Badge variant="outline" className="mt-1">{patient.id}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5">
          <LogOut className="h-3.5 w-3.5" /> Sign Out
        </Button>
      </div>

      {/* Profile card */}
      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-teal/10 rounded-full p-3"><User className="h-6 w-6 text-teal" /></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-sm">
              <div><span className="text-muted-foreground">Name</span><p className="font-medium">{patient.name}</p></div>
              <div><span className="text-muted-foreground">Age</span><p className="font-medium">{patient.age}</p></div>
              <div><span className="text-muted-foreground">Gender</span><p className="font-medium">{patient.gender}</p></div>
              <div><span className="text-muted-foreground">Registered</span><p className="font-medium">{patient.dateRegistered}</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend chart */}
      {trendData.length > 1 && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal" /> Risk Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 20% 88%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(200 80% 30%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Test records */}
      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-teal" /> Test Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patient.records.map((r) => (
            <div key={r.id} className="border rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium">{r.date}</span>
                  <Badge className={riskBadge[r.result.level]}>{r.result.level}</Badge>
                  <span className="text-xs text-muted-foreground">Glucose: {r.data.glucose} · HbA1c: {r.data.hba1c}% · BMI: {r.data.bmi}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setExpandedRecord(expandedRecord === r.id ? null : r.id)}
                >
                  {expandedRecord === r.id ? "Hide Report" : "View Full Report"}
                </Button>
              </div>
              {expandedRecord === r.id && (
                <div className="border-t p-4 space-y-4 bg-muted/30">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-xs">
                    {Object.entries(r.data).map(([k, v]) => (
                      <div key={k}><span className="text-muted-foreground capitalize">{k}</span><p className="font-medium">{v}</p></div>
                    ))}
                  </div>
                  <ExplainabilityPanel shapData={generateSHAPData()} limeData={generateLIMEData(r.data)} />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center py-4">
        These results are for your reference only. Please consult your clinician for medical advice.
      </p>
    </div>
  );
};

export default PatientPortal;
