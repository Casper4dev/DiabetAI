import { useState, useRef, useMemo } from "react";
import PatientForm from "@/components/PatientForm";
import RiskResultPanel from "@/components/RiskResultPanel";
import ExplainabilityPanel from "@/components/ExplainabilityPanel";
import ModelComparisonPanel from "@/components/ModelComparisonPanel";
import PatientHistoryLog, { HistoryEntry } from "@/components/PatientHistoryLog";
import { PatientData, RiskResult, calculateRisk, generateSHAPData, generateLIMEData } from "@/lib/riskCalculator";
import { useAppContext } from "@/context/AppContext";

const Index = () => {
  const [currentResult, setCurrentResult] = useState<RiskResult | null>(null);
  const [currentData, setCurrentData] = useState<PatientData | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const { addAssessment, assessments } = useAppContext();

  const generatePatientId = () => {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `DAI-${num}`;
  };

  const history: HistoryEntry[] = useMemo(
    () =>
      assessments.slice(0, 5).map((a, i) => ({
        id: `${a.patientId}-${i}`,
        patientId: a.patientId,
        date: a.date,
        result: a.result,
        data: a.data,
      })),
    [assessments]
  );

  const handleSubmit = async (data: PatientData, patientName: string) => {
    const result = calculateRisk(data);
    const patientId = generatePatientId();
    const date = new Date().toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });
    setCurrentResult(result);
    setCurrentData(data);
    setCurrentPatientId(patientId);
    await addAssessment({ patientId, patientName, date, data, result });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleViewHistory = (entry: HistoryEntry) => {
    setCurrentResult(entry.result);
    setCurrentData(entry.data);
    setCurrentPatientId(entry.patientId);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <PatientForm onSubmit={handleSubmit} />
      <div ref={resultRef}>
        {currentResult && currentData && (
          <div className="space-y-6">
            <RiskResultPanel result={currentResult} patientId={currentPatientId} patientData={currentData} />
            <ExplainabilityPanel shapData={generateSHAPData()} limeData={generateLIMEData(currentData)} />
            <ModelComparisonPanel />
          </div>
        )}
      </div>
      <PatientHistoryLog entries={history} onView={handleViewHistory} />
    </main>
  );
};

export default Index;
