import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { PatientData, RiskResult } from "@/lib/riskCalculator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Booking {
  id: string;
  patientId: string;
  doctorName: string;
  date: string;
  time: string;
  type: "In-Person" | "Video Call";
  reason: string;
  reference: string;
}

export interface AssessmentEntry {
  patientId: string;
  patientName: string;
  date: string;
  data: PatientData;
  result: RiskResult;
}

interface AppState {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  assessments: AssessmentEntry[];
  addAssessment: (a: AssessmentEntry) => Promise<void>;
  loadingAssessments: boolean;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assessments, setAssessments] = useState<AssessmentEntry[]>([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setAssessments([]);
      return;
    }
    setLoadingAssessments(true);
    const { data, error } = await supabase
      .from("clinician_assessments")
      .select("patient_id, patient_name, created_at, data, result")
      .order("created_at", { ascending: false });
    setLoadingAssessments(false);
    if (error) {
      console.error("Failed to load assessments", error);
      return;
    }
    setAssessments(
      (data ?? []).map((r: any) => ({
        patientId: r.patient_id,
        patientName: r.patient_name,
        date: new Date(r.created_at).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }),
        data: r.data,
        result: r.result,
      }))
    );
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBooking = (b: Booking) => setBookings((prev) => [b, ...prev]);

  const addAssessment = async (a: AssessmentEntry) => {
    if (!user) return;
    const { error } = await supabase.from("clinician_assessments").insert({
      clinician_id: user.id,
      patient_id: a.patientId,
      patient_name: a.patientName,
      data: a.data as any,
      result: a.result as any,
    });
    if (error) {
      console.error("Failed to save assessment", error);
      return;
    }
    await refresh();
  };

  return (
    <AppContext.Provider value={{ bookings, addBooking, assessments, addAssessment, loadingAssessments }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be inside AppProvider");
  return ctx;
};
