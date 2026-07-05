import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const models = [
  { name: "Random Forest", accuracy: "95.2%", sensitivity: "94.1%", specificity: "96.0%", f1: "94.6%", auc: "0.97", selected: false },
  { name: "XGBoost", accuracy: "96.1%", sensitivity: "95.3%", specificity: "96.7%", f1: "95.7%", auc: "0.98", selected: true },
  { name: "SVM", accuracy: "92.4%", sensitivity: "91.0%", specificity: "93.5%", f1: "91.7%", auc: "0.95", selected: false },
  { name: "Logistic Regression", accuracy: "88.3%", sensitivity: "86.5%", specificity: "89.8%", f1: "87.4%", auc: "0.92", selected: false },
];

const ModelComparisonPanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="animate-fade-in">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-teal" />
              Model Performance
            </CardTitle>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Model</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Sensitivity</TableHead>
                    <TableHead>Specificity</TableHead>
                    <TableHead>F1-Score</TableHead>
                    <TableHead>AUC-ROC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((m) => (
                    <TableRow key={m.name} className={m.selected ? "bg-teal/5" : ""}>
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2">
                          {m.name}
                          {m.selected && <Badge className="bg-teal text-primary-foreground text-[10px] px-1.5 py-0">Recommended</Badge>}
                        </span>
                      </TableCell>
                      <TableCell>{m.accuracy}</TableCell>
                      <TableCell>{m.sensitivity}</TableCell>
                      <TableCell>{m.specificity}</TableCell>
                      <TableCell>{m.f1}</TableCell>
                      <TableCell>{m.auc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ModelComparisonPanel;
