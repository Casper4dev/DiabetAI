import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskResult, PatientData } from "@/lib/riskCalculator";
import { generatePDFReport } from "@/lib/pdfReport";

const config = {
  High: { icon: AlertTriangle, bg: "bg-risk-high/10", border: "border-risk-high/30", text: "text-risk-high", badge: "bg-risk-high" },
  Moderate: { icon: Shield, bg: "bg-risk-moderate/10", border: "border-risk-moderate/30", text: "text-risk-moderate", badge: "bg-risk-moderate" },
  Low: { icon: CheckCircle, bg: "bg-risk-low/10", border: "border-risk-low/30", text: "text-risk-low", badge: "bg-risk-low" },
};

const RiskResultPanel = ({ result, patientId, patientData }: { result: RiskResult; patientId?: string | null; patientData?: PatientData | null }) => {
  const c = config[result.level];
  const Icon = c.icon;

  return (
    <Card className={`${c.bg} border ${c.border} animate-fade-in`}>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className={`${c.badge} rounded-full p-3`}>
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              {patientId && (
                <span className="text-sm font-mono font-semibold bg-muted px-2.5 py-0.5 rounded">{patientId}</span>
              )}
              <span className={`text-2xl font-bold ${c.text}`}>{result.level} Risk</span>
              <span className={`${c.badge} text-primary-foreground text-sm font-bold px-3 py-0.5 rounded-full`}>
                {result.percentage}% likelihood
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>
          {patientData && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              onClick={() => generatePDFReport(patientData, result, patientId ?? null)}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskResultPanel;
