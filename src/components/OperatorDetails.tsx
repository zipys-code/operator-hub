import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Operator } from "@/types/operator";

interface OperatorDetailsProps {
  operator: Operator;
}

const OperatorDetails: React.FC<OperatorDetailsProps> = React.memo(({ operator }) => {
  return (
    <div dir="rtl" className="grid grid-cols-3 gap-6 p-6 bg-muted/30 border-t border-border">
      {/* Right section – URLs */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground">כתובות שאילתה</h4>
        <div className="space-y-2">
          <div>
            <span className="text-xs text-muted-foreground">Trip Query URL</span>
            <p className="text-sm break-all font-mono bg-background rounded p-2 border border-border">
              {operator.tripQueryUrl || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">History Query URL</span>
            <p className="text-sm break-all font-mono bg-background rounded p-2 border border-border">
              {operator.historyQueryUrl || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Center section – Technical fields */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground">פרטים טכניים</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <span className="text-muted-foreground">מרווח שליפה:</span>
          <span>{operator.retrievalInterval} שניות</span>

          <span className="text-muted-foreground">שיחות קודמות:</span>
          <span>{operator.previousCallsCount}</span>

          <span className="text-muted-foreground">גרסת פרוטוקול:</span>
          <span>{operator.vmProtocolVersionDesc}</span>

          <span className="text-muted-foreground">מערכת חיזוי ראשית:</span>
          <span>{operator.mainPredictionSystemId}</span>

          <span className="text-muted-foreground">דוא״ל:</span>
          <span className="break-all">{operator.contactEmail || "—"}</span>

          <span className="text-muted-foreground">שאילתה מוצלחת אחרונה:</span>
          <span className="text-xs">{operator.lastSuccessfulQueryTime || "—"}</span>
        </div>
      </div>

      {/* Left section – Flags as checkboxes */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground">דגלים</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm cursor-default">
            <Checkbox checked={operator.saveInterfaceContentFlag} disabled />
            <span>שמירת תוכן ממשק</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-default">
            <Checkbox checked={operator.testingPeriodFlag} disabled />
            <span>תקופת בדיקות</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-default">
            <Checkbox checked={operator.historyQueryEnabledFlag} disabled />
            <span>שאילתת היסטוריה מופעלת</span>
          </label>
        </div>
      </div>
    </div>
  );
});

OperatorDetails.displayName = "OperatorDetails";

export default OperatorDetails;
