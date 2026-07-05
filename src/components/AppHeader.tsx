import { Activity } from "lucide-react";

const AppHeader = () => (
  <header className="gradient-navy px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-teal rounded-lg p-2">
          <Activity className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
            DiabetAI — Early Detection System
          </h1>
          <p className="text-xs text-primary-foreground/60">
            Advisory tool for clinical decision support. Final diagnosis rests with the clinician.
          </p>
        </div>
      </div>
    </div>
  </header>
);

export default AppHeader;
