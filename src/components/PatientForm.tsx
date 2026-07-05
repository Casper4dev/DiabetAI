import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { PatientData, FIELD_RANGES } from "@/lib/riskCalculator";

const FIELD_ORDER: (keyof PatientData)[] = [
  "glucose", "hba1c", "bmi", "bloodPressure", "cholesterol", "triglycerides", "insulin", "age", "pregnancies",
];

interface Props {
  onSubmit: (data: PatientData, patientName: string) => void;
}

const PatientForm = ({ onSubmit }: Props) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [patientName, setPatientName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!patientName.trim()) { newErrors["patientName"] = "Required"; }
    for (const key of FIELD_ORDER) {
      const raw = values[key]?.trim();
      if (!raw) { newErrors[key] = "Required"; continue; }
      const num = parseFloat(raw);
      const range = FIELD_RANGES[key];
      if (isNaN(num)) { newErrors[key] = "Must be a number"; continue; }
      if (num < range.min || num > range.max) {
        newErrors[key] = `Range: ${range.min}–${range.max}`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const data: PatientData = {
      glucose: parseFloat(values.glucose),
      hba1c: parseFloat(values.hba1c),
      bmi: parseFloat(values.bmi),
      bloodPressure: parseFloat(values.bloodPressure),
      cholesterol: parseFloat(values.cholesterol),
      triglycerides: parseFloat(values.triglycerides),
      insulin: parseFloat(values.insulin),
      age: parseFloat(values.age),
      pregnancies: parseFloat(values.pregnancies),
    };
    onSubmit(data, patientName.trim());
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-teal" />
          Patient Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
            <Label htmlFor="patientName" className="text-sm font-medium">Patient Name</Label>
            <Input
              id="patientName"
              placeholder="e.g. Amara Okonkwo"
              value={patientName}
              onChange={(e) => {
                setPatientName(e.target.value);
                if (errors["patientName"]) setErrors(er => { const n = { ...er }; delete n["patientName"]; return n; });
              }}
              className={`sm:max-w-sm ${errors["patientName"] ? "border-destructive" : ""}`}
            />
            {errors["patientName"] && <p className="text-xs text-destructive">{errors["patientName"]}</p>}
          </div>
          {FIELD_ORDER.map((key) => {
            const range = FIELD_RANGES[key];
            return (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-sm font-medium">
                  {range.label} {range.unit && <span className="text-muted-foreground font-normal">({range.unit})</span>}
                </Label>
                <Input
                  id={key}
                  type="number"
                  step="any"
                  placeholder={`${range.min}–${range.max}`}
                  value={values[key] || ""}
                  onChange={(e) => {
                    setValues(v => ({ ...v, [key]: e.target.value }));
                    if (errors[key]) setErrors(er => { const n = { ...er }; delete n[key]; return n; });
                  }}
                  className={errors[key] ? "border-destructive" : ""}
                />
                {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
              </div>
            );
          })}
          <div className="sm:col-span-2 lg:col-span-3 pt-2">
            <Button type="submit" className="w-full sm:w-auto bg-teal hover:bg-teal-light text-primary-foreground font-semibold px-8">
              Run Assessment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientForm;
