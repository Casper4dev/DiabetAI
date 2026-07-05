import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { RiskResult, PatientData } from "@/lib/riskCalculator";

export interface HistoryEntry {
  id: string;
  patientId: string;
  date: string;
  result: RiskResult;
  data: PatientData;
}

const badgeStyle = {
  High: "bg-risk-high text-primary-foreground",
  Moderate: "bg-risk-moderate text-primary-foreground",
  Low: "bg-risk-low text-primary-foreground",
};

const PatientHistoryLog = ({ entries, onView }: { entries: HistoryEntry[]; onView: (entry: HistoryEntry) => void }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base flex items-center gap-2">
        <History className="h-4 w-4 text-teal" />
        Recent Assessments
      </CardTitle>
    </CardHeader>
    <CardContent>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No assessments yet. Submit a patient form to begin.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Patient ID</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Score</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-sm font-mono font-medium">{e.patientId}</TableCell>
                  <TableCell className="text-sm">{e.date}</TableCell>
                  <TableCell>
                    <Badge className={badgeStyle[e.result.level]}>{e.result.level}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{e.result.percentage}%</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => onView(e)} className="text-xs">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  </Card>
);

export default PatientHistoryLog;
