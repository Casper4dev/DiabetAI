import { AlertTriangle } from "lucide-react";

const DisclaimerBanner = () => (
  <div className="bg-amber-warn/15 border-b border-amber-warn/30 px-4 py-2.5 text-center">
    <p className="text-sm font-medium text-foreground flex items-center justify-center gap-2">
      <AlertTriangle className="h-4 w-4 text-amber-warn flex-shrink-0" />
      <span>This system is an advisory tool only. Results must be reviewed by a qualified healthcare professional.</span>
    </p>
  </div>
);

export default DisclaimerBanner;
