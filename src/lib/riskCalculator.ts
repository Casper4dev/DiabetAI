export interface PatientData {
  glucose: number;
  hba1c: number;
  bmi: number;
  bloodPressure: number;
  cholesterol: number;
  triglycerides: number;
  insulin: number;
  age: number;
  pregnancies: number;
}

export interface RiskResult {
  score: number;
  percentage: number;
  level: "High" | "Moderate" | "Low";
  summary: string;
  featureContributions: { name: string; value: number; normalized: number; weight: number; contribution: number }[];
}

const WEIGHTS = {
  glucose: 0.30,
  hba1c: 0.25,
  bmi: 0.15,
  bloodPressure: 0.10,
  insulin: 0.10,
  age: 0.10,
};

const MAXES = {
  glucose: 500,
  hba1c: 15,
  bmi: 60,
  bloodPressure: 200,
  insulin: 300,
  age: 100,
};

export function calculateRisk(data: PatientData): RiskResult {
  const contributions = Object.entries(WEIGHTS).map(([key, weight]) => {
    const value = data[key as keyof PatientData] as number;
    const max = MAXES[key as keyof typeof MAXES];
    const normalized = value / max;
    return { name: key, value, normalized, weight, contribution: normalized * weight };
  });

  const score = contributions.reduce((sum, c) => sum + c.contribution, 0);
  const percentage = Math.min(Math.round(score * 100), 99);

  let level: RiskResult["level"];
  if (score > 0.60) level = "High";
  else if (score >= 0.35) level = "Moderate";
  else level = "Low";

  const topDrivers = [...contributions].sort((a, b) => b.contribution - a.contribution).slice(0, 2);
  const driverNames = topDrivers.map(d => {
    const labels: Record<string, string> = { glucose: "glucose", hba1c: "HbA1c", bmi: "BMI", bloodPressure: "blood pressure", insulin: "insulin", age: "age" };
    return labels[d.name] || d.name;
  });

  const summary = level === "Low"
    ? `All metabolic markers are within normal ranges. No significant risk drivers identified.`
    : `Elevated ${driverNames.join(" and ")} are the primary risk drivers for this patient.`;

  return { score, percentage, level, summary, featureContributions: contributions };
}

export function generateSHAPData() {
  return [
    { feature: "Glucose Level", importance: 0.32 },
    { feature: "HbA1c", importance: 0.27 },
    { feature: "BMI", importance: 0.16 },
    { feature: "Blood Pressure", importance: 0.11 },
    { feature: "Insulin Level", importance: 0.09 },
  ];
}

export function generateLIMEData(data: PatientData) {
  const result = calculateRisk(data);
  const baseline = 0.40;
  return result.featureContributions.map(c => {
    const labels: Record<string, string> = { glucose: "Glucose Level", hba1c: "HbA1c", bmi: "BMI", bloodPressure: "Blood Pressure", insulin: "Insulin Level", age: "Age" };
    const impact = c.contribution - (baseline * c.weight);
    return { feature: labels[c.name] || c.name, impact: parseFloat(impact.toFixed(3)) };
  }).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
}

export const FIELD_RANGES: Record<string, { min: number; max: number; unit: string; label: string }> = {
  glucose: { min: 50, max: 500, unit: "mg/dL", label: "Glucose Level" },
  hba1c: { min: 3, max: 15, unit: "%", label: "HbA1c" },
  bmi: { min: 10, max: 60, unit: "", label: "BMI" },
  bloodPressure: { min: 60, max: 250, unit: "mmHg", label: "Blood Pressure" },
  cholesterol: { min: 100, max: 400, unit: "mg/dL", label: "Total Cholesterol" },
  triglycerides: { min: 30, max: 600, unit: "mg/dL", label: "Triglycerides" },
  insulin: { min: 0, max: 300, unit: "μU/mL", label: "Insulin Level" },
  age: { min: 1, max: 120, unit: "years", label: "Age" },
  pregnancies: { min: 0, max: 20, unit: "", label: "Number of Pregnancies" },
};
