import { useState, useMemo, useCallback, useEffect, memo } from "react";
import { Search, Plus, BarChart3, Menu, MoreVertical, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { Operator } from "@/types/operator";
import { fetchOperators } from "@/lib/apiClient";
import OperatorDetails from "@/components/OperatorDetails";
import OperatorTableSkeleton from "@/components/OperatorTableSkeleton";
import NewOperatorModal, { type NewOperatorFormValues } from "@/components/NewOperatorModal";

const StatusDot = memo(({ code, label }: { code: string; label: string }) => (
  <div className="flex items-center gap-2 justify-center">
    <span>{label}</span>
    <span className={`inline-block w-3 h-3 rounded-full ${code === "ENABLED" ? "bg-emerald-500" : "bg-red-500"}`} />
  </div>
));
StatusDot.displayName = "StatusDot";

type SortDirection = "asc" | "desc" | null;
type SortKey = "operatorName" | "operatorId" | "adminStatusDesc" | "operationStatusDesc" | "contact" | "contactPhone" | "lastQueryTime" | null;

const SortIcon = memo(({ direction }: { direction: SortDirection }) => {
  if (direction === "asc") return <ChevronUp className="h-3 w-3" />;
  if (direction === "desc") return <ChevronDown className="h-3 w-3" />;
  return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
});
SortIcon.displayName = "SortIcon";

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}\n${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

interface OperatorRowProps {
  op: Operator;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const OperatorRow = memo(({ op, isExpanded, onToggle }: OperatorRowProps) => (
  <>
    <TableRow className="hover:bg-muted/30 border-b">
      <TableCell className="text-center">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle(op.recordId); }}
          className="p-1 rounded hover:bg-muted transition-colors"
          aria-label={isExpanded ? "סגור פרטים" : "פתח פרטים"}
        >
          <ChevronLeft
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "-rotate-90" : ""}`}
          />
        </button>
      </TableCell>
      <TableCell className="text-center">
        <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </TableCell>
      <TableCell className="text-right font-medium">{op.operatorName}</TableCell>
      <TableCell className="text-center">{op.operatorId}</TableCell>
      <TableCell className="text-center">
        <StatusDot code={op.adminStatusCode} label={op.adminStatusDesc} />
      </TableCell>
      <TableCell className="text-center">
        <StatusDot code={op.operationStatusCode} label={op.operationStatusDesc} />
      </TableCell>
      <TableCell className="text-center text-sm">{op.contactFirstName} {op.contactLastName}</TableCell>
      <TableCell className="text-center text-sm">{op.contactPhone}</TableCell>
      <TableCell className="text-center whitespace-pre-line text-sm">{formatDate(op.lastQueryTime)}</TableCell>
    </TableRow>
    {isExpanded && (
      <TableRow>
        <TableCell colSpan={9} className="p-0">
          <OperatorDetails operator={op} />
        </TableCell>
      </TableRow>
    )}
  </>
));
OperatorRow.displayName = "OperatorRow";

const Operators = () => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showNewOperator, setShowNewOperator] = useState(false);

  const handleNewOperatorSubmit = async (data: NewOperatorFormValues) => {
    try {
      // כאן אנחנו משתמשים בפונקציה שכתבנו קודם ל-apiClient
      // אם עוד לא הוספת אותה ל-apiClient, אפשר לקרוא ישירות ל-postRequest
      console.log("Submitting new operator:", data);

      // את יכולה להשתמש בזה כבדיקה ראשונית:
      // await addOperator(data); 

      setShowNewOperator(false);
      // רענון הטבלה אחרי הוספה מוצלחת
      window.location.reload();
    } catch (err) {
      console.error("Failed to add operator:", err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchOperators()
      .then((data) => {
        console.log("Data received from API:", data);

        let operatorsList = [];

        // מקרה א': המידע חוזר כמערך ישיר (מה שקורה אצלך עכשיו לפי הלוג)
        if (Array.isArray(data)) {
          operatorsList = data;
        }
        // מקרה ב': המידע עטוף ב-uiMessage (כמו שחשבנו קודם)
        else if (data?.uiMessage?.responseData?.operatorList?.operator) {
          operatorsList = data.uiMessage.responseData.operatorList.operator;
        }

        if (operatorsList.length > 0 || Array.isArray(data)) {
          setOperators(operatorsList);
          setError(null);
        } else {
          console.error("Unexpected data structure:", data);
          setError("מבנה נתונים לא מזוהה");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch operators:", err);
        setError("שגיאה בטעינת הנתונים");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleRow = useCallback((recordId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(recordId)) next.delete(recordId);
      else next.add(recordId);
      return next;
    });
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
      else setSortDir("asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    // אם המערך ריק, תחזיר מערך ריק
    if (!operators || !Array.isArray(operators)) return [];

    // אם אין חיפוש, תחזיר את כל המפעילים
    if (!search) return operators;

    const q = search.toLowerCase();
    return operators.filter((op) => {
      // וידוא שהשדות קיימים לפני שמריצים עליהם toLowerCase
      const name = op.operatorName ? String(op.operatorName).toLowerCase() : "";
      const id = op.operatorId ? String(op.operatorId).toLowerCase() : "";

      return name.includes(q) || id.includes(q);
    });
  }, [search, operators]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "operatorId": cmp = a.operatorId - b.operatorId; break;
        case "operatorName": cmp = a.operatorName.localeCompare(b.operatorName, "he"); break;
        case "adminStatusDesc": cmp = a.adminStatusDesc.localeCompare(b.adminStatusDesc, "he"); break;
        case "operationStatusDesc": cmp = a.operationStatusDesc.localeCompare(b.operationStatusDesc, "he"); break;
        case "contact": cmp = `${a.contactFirstName} ${a.contactLastName}`.localeCompare(`${b.contactFirstName} ${b.contactLastName}`, "he"); break;
        case "contactPhone": cmp = a.contactPhone.localeCompare(b.contactPhone); break;
        case "lastQueryTime": cmp = new Date(a.lastQueryTime).getTime() - new Date(b.lastQueryTime).getTime(); break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [filtered, sortKey, sortDir]);

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5 text-muted-foreground cursor-pointer" />
          <div className="flex items-center gap-2">
            <UserCog className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">ZipyS</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="חיפוש" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 w-56" />
          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <BarChart3 className="ml-2 h-4 w-4" />הצגת גרפים
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowNewOperator(true)}>
            <Plus className="ml-2 h-4 w-4" />הוספת מפעיל
          </Button>
        </div>
      </header>

      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <UserCog className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">ניהול מפעילים</h1>
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} מתוך {operators.length}</span>
      </div>

      {error ? (
        <div className="px-6 py-12 text-center">
          <p className="text-destructive text-lg font-medium">Loading failed</p>
          <p className="text-muted-foreground text-sm mt-1">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>נסה שוב</Button>
        </div>
      ) : isLoading ? (
        <OperatorTableSkeleton />
      ) : (
        <div className="px-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right w-10" />
                <TableHead className="text-right w-10" />
                <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("operatorName")}>
                  <span className="flex items-center gap-1 justify-end">שם המפעיל <SortIcon direction={sortKey === "operatorName" ? sortDir : null} /></span>
                </TableHead>
                <TableHead className="text-center cursor-pointer select-none" onClick={() => handleSort("operatorId")}>
                  <span className="flex items-center gap-1 justify-center">מזהה מפעיל <SortIcon direction={sortKey === "operatorId" ? sortDir : null} /></span>
                </TableHead>
                <TableHead className="text-center cursor-pointer select-none" onClick={() => handleSort("adminStatusDesc")}>
                  <span className="flex items-center gap-1 justify-center">סטטוס ניהולי <SortIcon direction={sortKey === "adminStatusDesc" ? sortDir : null} /></span>
                </TableHead>
                <TableHead className="text-center cursor-pointer select-none" onClick={() => handleSort("operationStatusDesc")}>
                  <span className="flex items-center gap-1 justify-center">סטטוס תפעולי <SortIcon direction={sortKey === "operationStatusDesc" ? sortDir : null} /></span>
                </TableHead>
                <TableHead className="text-center cursor-pointer select-none" onClick={() => handleSort("contact")}>
                  <span className="flex items-center gap-1 justify-center">איש קשר <SortIcon direction={sortKey === "contact" ? sortDir : null} /></span>
                </TableHead>
                <TableHead className="text-center cursor-pointer select-none" onClick={() => handleSort("contactPhone")}>
                  <span className="flex items-center gap-1 justify-center">טלפון <SortIcon direction={sortKey === "contactPhone" ? sortDir : null} /></span>
                </TableHead>
                <TableHead className="text-center cursor-pointer select-none" onClick={() => handleSort("lastQueryTime")}>
                  <span className="flex items-center gap-1 justify-center">מועד שאילתה אחרונה <SortIcon direction={sortKey === "lastQueryTime" ? sortDir : null} /></span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground text-base">
                    לא נמצאו מפעילים תואמים
                  </TableCell>
                </TableRow>
              ) : sorted.map((op) => (
                <OperatorRow
                  key={op.recordId}
                  op={op}
                  isExpanded={expandedRows.has(op.recordId)}
                  onToggle={toggleRow}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <NewOperatorModal
        open={showNewOperator}
        onOpenChange={setShowNewOperator}
        onSubmit={handleNewOperatorSubmit}
      />
    </div>
  );
};

export default Operators;
