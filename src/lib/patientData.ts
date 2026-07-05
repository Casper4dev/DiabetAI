import { PatientData, RiskResult, calculateRisk } from "./riskCalculator";
import type { AssessmentEntry } from "@/context/AppContext";

export interface PatientTestRecord {
  id: string;
  date: string;
  data: PatientData;
  result: RiskResult;
}

export interface PatientProfile {
  id: string;
  name: string;
  gender: "Male" | "Female";
  age: number;
  dateRegistered: string;
  records: PatientTestRecord[];
}

function makeRecord(id: string, date: string, data: PatientData): PatientTestRecord {
  return { id, date, data, result: calculateRisk(data) };
}

export const PATIENTS: PatientProfile[] = [
  {
    id: "DAI-00101",
    name: "Amara Okonkwo",
    gender: "Female",
    age: 42,
    dateRegistered: "2025-10-15",
    records: [
      makeRecord("r1a", "2026-04-01", { glucose: 220, hba1c: 9.5, bmi: 34, bloodPressure: 150, cholesterol: 250, triglycerides: 230, insulin: 90, age: 42, pregnancies: 3 }),
      makeRecord("r1b", "2026-01-10", { glucose: 160, hba1c: 7.2, bmi: 31, bloodPressure: 138, cholesterol: 220, triglycerides: 190, insulin: 60, age: 42, pregnancies: 3 }),
      makeRecord("r1c", "2025-11-05", { glucose: 150, hba1c: 6.8, bmi: 30, bloodPressure: 135, cholesterol: 210, triglycerides: 180, insulin: 55, age: 42, pregnancies: 3 }),
    ],
  },
  {
    id: "DAI-00234",
    name: "Emeka Balogun",
    gender: "Male",
    age: 58,
    dateRegistered: "2025-04-20",
    records: [
      makeRecord("r2a", "2026-04-05", { glucose: 95, hba1c: 5.0, bmi: 24, bloodPressure: 120, cholesterol: 180, triglycerides: 110, insulin: 14, age: 58, pregnancies: 0 }),
      makeRecord("r2b", "2026-01-15", { glucose: 145, hba1c: 6.5, bmi: 28, bloodPressure: 132, cholesterol: 200, triglycerides: 160, insulin: 45, age: 58, pregnancies: 0 }),
      makeRecord("r2c", "2025-09-10", { glucose: 200, hba1c: 8.8, bmi: 33, bloodPressure: 148, cholesterol: 245, triglycerides: 220, insulin: 80, age: 58, pregnancies: 0 }),
      makeRecord("r2d", "2025-06-01", { glucose: 210, hba1c: 9.0, bmi: 34, bloodPressure: 150, cholesterol: 250, triglycerides: 230, insulin: 85, age: 58, pregnancies: 0 }),
    ],
  },
  {
    id: "DAI-00389",
    name: "Fatima Aliyu",
    gender: "Female",
    age: 35,
    dateRegistered: "2026-01-08",
    records: [
      makeRecord("r3a", "2026-03-20", { glucose: 88, hba1c: 4.9, bmi: 22, bloodPressure: 115, cholesterol: 170, triglycerides: 100, insulin: 10, age: 35, pregnancies: 1 }),
      makeRecord("r3b", "2026-01-15", { glucose: 90, hba1c: 5.0, bmi: 22, bloodPressure: 118, cholesterol: 175, triglycerides: 105, insulin: 11, age: 35, pregnancies: 1 }),
    ],
  },
  {
    id: "DAI-00512",
    name: "Chukwudi Eze",
    gender: "Male",
    age: 50,
    dateRegistered: "2025-07-12",
    records: [
      makeRecord("r4a", "2026-04-02", { glucose: 205, hba1c: 9.0, bmi: 33, bloodPressure: 148, cholesterol: 240, triglycerides: 225, insulin: 82, age: 50, pregnancies: 0 }),
      makeRecord("r4b", "2025-12-18", { glucose: 155, hba1c: 7.0, bmi: 30, bloodPressure: 136, cholesterol: 215, triglycerides: 185, insulin: 55, age: 50, pregnancies: 0 }),
      makeRecord("r4c", "2025-09-05", { glucose: 148, hba1c: 6.6, bmi: 29, bloodPressure: 134, cholesterol: 210, triglycerides: 175, insulin: 50, age: 50, pregnancies: 0 }),
    ],
  },
  {
    id: "DAI-00678",
    name: "Ngozi Adeyemi",
    gender: "Female",
    age: 29,
    dateRegistered: "2026-03-25",
    records: [
      makeRecord("r5a", "2026-03-28", { glucose: 85, hba1c: 4.7, bmi: 21, bloodPressure: 110, cholesterol: 165, triglycerides: 95, insulin: 9, age: 29, pregnancies: 0 }),
    ],
  },
];

export function findPatient(query: string, assessments?: AssessmentEntry[]): PatientProfile | undefined {
  const trimmed = query.trim();
  const upper = trimmed.toUpperCase();

  // Check hardcoded patients by ID or name
  const hardcoded = PATIENTS.find(
    (p) => p.id === upper || p.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (hardcoded) return hardcoded;

  // Check dynamically created assessments by ID or name
  if (assessments) {
    const matching = assessments.filter(
      (a) => a.patientId === upper || a.patientName.toLowerCase() === trimmed.toLowerCase()
    );
    if (matching.length > 0) {
      const first = matching[matching.length - 1];
      return {
        id: first.patientId,
        name: first.patientName,
        gender: "Male",
        age: first.data.age,
        dateRegistered: first.date.split(" ")[0],
        records: matching.map((a, i) => ({
          id: `dyn-${i}`,
          date: a.date,
          data: a.data,
          result: a.result,
        })),
      };
    }
  }

  return undefined;
}
