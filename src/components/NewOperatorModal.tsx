import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Minus, Info } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const newOperatorSchema = z.object({
  contactFirstName: z.string().min(1, "שדה חובה"),
  contactLastName: z.string().min(1, "שדה חובה"),
  contactPhone: z.string().min(1, "שדה חובה"),
  contactEmail: z.string().email("כתובת דוא״ל לא תקינה"),
  operatorName: z.string().min(1, "שדה חובה"),
  operatorId: z.coerce.number().min(1, "שדה חובה"),
  retrievalInterval: z.coerce.number().min(1, "שדה חובה"),
  previousCallsCount: z.coerce.number().min(0, "שדה חובה"),
  kavRazifPassword: z.string().min(1, "שדה חובה"),
  tripQueryUrl: z.string().url("כתובת URL לא תקינה"),
  historyQueryUrl: z.string().url("כתובת URL לא תקינה"),
  vmProtocolVersionCode: z.string().min(1, "שדה חובה"),
  mainPredictionSystemId: z.string().min(1, "שדה חובה"),
  adminStatusCode: z.enum(["ENABLED", "DISABLED"]),
  saveInterfaceContentFlag: z.boolean(),
  testingPeriodFlag: z.boolean(),
  historyQueryEnabledFlag: z.boolean(),
  kavRazifApiIpList: z.array(z.object({ value: z.string().min(1, "שדה חובה") })).min(1),
  predictionSystemIdList: z.array(z.object({ value: z.string().min(1, "שדה חובה") })).min(1),
});

export type NewOperatorFormValues = z.infer<typeof newOperatorSchema>;

interface NewOperatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewOperatorFormValues) => void;
}

const PROTOCOL_OPTIONS = [
  { value: "BUSES", label: "אוטובוסים" },
  { value: "TRAINS", label: "רכבות" },
  { value: "LIGHT_RAIL", label: "רכבת קלה" },
];

const PREDICTION_SYSTEM_OPTIONS = [
  { value: "OPERATOR", label: "OPERATOR" },
  { value: "CENTRAL", label: "CENTRAL" },
  { value: "HYBRID", label: "HYBRID" },
];

const NewOperatorModal: React.FC<NewOperatorModalProps> = ({ open, onOpenChange, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewOperatorFormValues>({
    resolver: zodResolver(newOperatorSchema),
    defaultValues: {
      adminStatusCode: "DISABLED",
      saveInterfaceContentFlag: false,
      testingPeriodFlag: false,
      historyQueryEnabledFlag: true,
      kavRazifApiIpList: [{ value: "" }],
      predictionSystemIdList: [{ value: "" }],
      retrievalInterval: 15,
      previousCallsCount: 2,
    },
  });

  const ipFields = useFieldArray({ control, name: "kavRazifApiIpList" });
  const predictionFields = useFieldArray({ control, name: "predictionSystemIdList" });

  const adminStatus = watch("adminStatusCode");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" dir="rtl">
        <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-xl font-bold text-primary">הוספת מפעיל</DialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">סטטוס ניהולי</span>
              <Switch
                checked={adminStatus === "ENABLED"}
                onCheckedChange={(checked) =>
                  setValue("adminStatusCode", checked ? "ENABLED" : "DISABLED")
                }
              />
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
          {/* Row 1: contactFirstName + contactLastName */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="שם פרטי" error={errors.contactFirstName?.message}>
              <Input {...register("contactFirstName")} />
            </FormField>
            <FormField label="שם משפחה" error={errors.contactLastName?.message}>
              <Input {...register("contactLastName")} />
            </FormField>
          </div>

          {/* Row 2: contactPhone + contactEmail */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="טלפון" error={errors.contactPhone?.message}>
              <Input {...register("contactPhone")} />
            </FormField>
            <FormField label="דואר אלקטרוני" error={errors.contactEmail?.message}>
              <Input type="email" {...register("contactEmail")} />
            </FormField>
          </div>

          {/* Row 3: operatorName + operatorId */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="שם המפעיל" error={errors.operatorName?.message}>
              <Input {...register("operatorName")} />
            </FormField>
            <FormField label="מספר המפעיל במערכת" error={errors.operatorId?.message}>
              <Input type="number" {...register("operatorId")} />
            </FormField>
          </div>

          {/* Row 4: retrievalInterval + kavRazifPassword */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
              <FormField label="תדירות שליפת מידע" error={errors.retrievalInterval?.message}>
                <Input type="number" {...register("retrievalInterval")} />
              </FormField>
              <span className="pb-2 text-sm text-muted-foreground">שנ׳</span>
              <div />
            </div>
            <FormField label="סיסמא לאתר קו רציף" error={errors.kavRazifPassword?.message}>
              <Input {...register("kavRazifPassword")} />
            </FormField>
          </div>

          {/* Row 5: previousCallsCount + kavRazifApiIpList */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="מס׳ תחנות קודמות לשליפה" error={errors.previousCallsCount?.message}>
              <Input type="number" {...register("previousCallsCount")} />
            </FormField>
            <div className="space-y-2">
              <Label className="text-sm">כתובות IP לאתר קו רציף</Label>
              {ipFields.fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input {...register(`kavRazifApiIpList.${index}.value`)} />
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-primary text-primary"
                      onClick={() => ipFields.remove(index)}
                      disabled={ipFields.fields.length <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-primary text-primary"
                      onClick={() => ipFields.append({ value: "" })}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* predictionSystemIdList */}
          <div className="grid grid-cols-2 gap-4">
            <div />
            <div className="space-y-2">
              <Label className="text-sm">מערכת חיזוי</Label>
              {predictionFields.fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input {...register(`predictionSystemIdList.${index}.value`)} />
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-primary text-primary"
                      onClick={() => predictionFields.remove(index)}
                      disabled={predictionFields.fields.length <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-primary text-primary"
                      onClick={() => predictionFields.append({ value: "" })}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6 py-2 justify-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={watch("historyQueryEnabledFlag")}
                onCheckedChange={(v) => setValue("historyQueryEnabledFlag", !!v)}
              />
              <span>יישום שאילתא היסטורית</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={watch("saveInterfaceContentFlag")}
                onCheckedChange={(v) => setValue("saveInterfaceContentFlag", !!v)}
              />
              <span>שמירת תוכן מסרים</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={watch("testingPeriodFlag")}
                onCheckedChange={(v) => setValue("testingPeriodFlag", !!v)}
              />
              <span>מפעיל בתקופת יישום</span>
            </label>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="מערכת חיזוי מבצעית" error={errors.mainPredictionSystemId?.message}>
              <Select
                value={watch("mainPredictionSystemId")}
                onValueChange={(v) => setValue("mainPredictionSystemId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר..." />
                </SelectTrigger>
                <SelectContent>
                  {PREDICTION_SYSTEM_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="גרסת פרוטוקול" error={errors.vmProtocolVersionCode?.message}>
              <Select
                value={watch("vmProtocolVersionCode")}
                onValueChange={(v) => setValue("vmProtocolVersionCode", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר..." />
                </SelectTrigger>
                <SelectContent>
                  {PROTOCOL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {/* URL fields with info icon */}
          <FormField label="כתובת לשליפת נסיעות פעילות ומתוכננות" error={errors.tripQueryUrl?.message} icon>
            <Input {...register("tripQueryUrl")} />
          </FormField>

          <FormField label="כתובת לשאילתא היסטורית" error={errors.historyQueryUrl?.message} icon>
            <Input {...register("historyQueryUrl")} />
          </FormField>

          {/* Submit */}
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="px-12 bg-[hsl(195,100%,50%)] hover:bg-[hsl(195,100%,40%)] text-white font-semibold rounded-lg"
            >
              אישור
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Helper component
const FormField: React.FC<{
  label: string;
  error?: string;
  icon?: boolean;
  children: React.ReactNode;
}> = ({ label, error, icon, children }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1">
      {icon && <Info className="h-3.5 w-3.5 text-muted-foreground" />}
      <Label className="text-sm">{label}</Label>
    </div>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

export default NewOperatorModal;
