import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Brain, Lightbulb } from "lucide-react";

interface SHAPItem { feature: string; importance: number }
interface LIMEItem { feature: string; impact: number }

const ExplainabilityPanel = ({ shapData, limeData }: { shapData: SHAPItem[]; limeData: LIMEItem[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-4 w-4 text-teal" />
          SHAP Global Insight
        </CardTitle>
        <p className="text-xs text-muted-foreground">What drives predictions overall?</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={shapData} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(210 20% 88%)" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="feature" type="category" tick={{ fontSize: 11 }} width={75} />
            <Tooltip formatter={(v: number) => v.toFixed(3)} />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
              {shapData.map((_, i) => (
                <Cell key={i} fill={`hsl(200, ${80 - i * 10}%, ${30 + i * 5}%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-teal" />
          LIME Local Insight
        </CardTitle>
        <p className="text-xs text-muted-foreground">Why this result for this patient?</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={limeData} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(210 20% 88%)" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="feature" type="category" tick={{ fontSize: 11 }} width={75} />
            <Tooltip formatter={(v: number) => v.toFixed(3)} />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
              {limeData.map((entry, i) => (
                <Cell key={i} fill={entry.impact >= 0 ? "hsl(200, 80%, 30%)" : "hsl(10, 80%, 60%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

export default ExplainabilityPanel;
