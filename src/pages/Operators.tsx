import { useState } from "react";
import { Search, Plus, BarChart3, Menu, MoreVertical, ChevronDown, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OperatorStatus = "active" | "disabled";

interface Operator {
  id: number;
  name: string;
  operatorId: number;
  managementStatus: OperatorStatus;
  operationalStatus: OperatorStatus;
  historyQuery: string;
  contactPerson: string;
  lastQueryDate: string;
  lastPullDate: string;
  lastValidPullDate: string;
}

const mockOperators: Operator[] = [
  { id: 1, name: "תנופה", operatorId: 34, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "PROD_ENV\nPROD_ENV", lastQueryDate: "01/06/2024\n00:00:00", lastPullDate: "01/06/2024\n00:00:00", lastValidPullDate: "01/06/2024\n00:00:00" },
  { id: 2, name: "תבל", operatorId: 22, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "PROD_ENV\nPROD_ENV", lastQueryDate: "01/06/2024\n00:00:00", lastPullDate: "01/06/2024\n00:00:00", lastValidPullDate: "01/06/2024\n00:00:00" },
  { id: 3, name: "רכבת ישראל", operatorId: 2, managementStatus: "active", operationalStatus: "active", historyQuery: "לא", contactPerson: "AviB test", lastQueryDate: "31/10/2022\n14:40:05", lastPullDate: "23/02/2026\n12:05:48", lastValidPullDate: "23/02/2026\n12:05:48" },
  { id: 4, name: "קווים", operatorId: 18, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "כן", contactPerson: "3 1", lastQueryDate: "08/12/2022\n11:02:35", lastPullDate: "08/08/2024\n15:50:45", lastValidPullDate: "08/08/2024\n15:50:45" },
  { id: 5, name: "עפיפי - ש.א.מ", operatorId: 6, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "1 1", lastQueryDate: "09/11/2022\n13:46:28", lastPullDate: "08/08/2024\n15:50:45", lastValidPullDate: "08/08/2024\n15:50:45" },
  { id: 6, name: "עפיפי - נתיב אקספרס", operatorId: 14, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "1 1", lastQueryDate: "19/01/2020\n12:33:24", lastPullDate: "08/08/2024\n15:50:45", lastValidPullDate: "08/08/2024\n15:50:45" },
  { id: 7, name: "עפיפי - נסיעות ותייר...", operatorId: 7, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "1 1", lastQueryDate: "13/01/2020\n15:08:22", lastPullDate: "08/08/2024\n15:50:45", lastValidPullDate: "08/08/2024\n15:50:45" },
  { id: 8, name: "עפיפי - בית שמש", operatorId: 35, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "PROD_ENV\nPROD_ENV", lastQueryDate: "01/06/2024\n00:00:00", lastPullDate: "01/06/2024\n00:00:00", lastValidPullDate: "01/06/2024\n00:00:00" },
  { id: 9, name: "סופרבוס - שימקוסק", operatorId: 116, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "PROD_ENV\nPROD_ENV", lastQueryDate: "01/06/2024\n00:00:00", lastPullDate: "01/06/2024\n00:00:00", lastValidPullDate: "01/06/2024\n00:00:00" },
  { id: 10, name: "סופרבוס", operatorId: 16, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "1 1", lastQueryDate: "12/01/2023\n10:07:14", lastPullDate: "08/08/2024\n15:50:45", lastValidPullDate: "08/08/2024\n15:50:45" },
  { id: 11, name: "מטרופולין", operatorId: 15, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "1 1", lastQueryDate: "19/01/2020\n12:33:51", lastPullDate: "08/08/2024\n15:50:45", lastValidPullDate: "08/08/2024\n15:50:45" },
  { id: 12, name: "מזה ירושלים - רמאלל...", operatorId: 42, managementStatus: "disabled", operationalStatus: "disabled", historyQuery: "לא", contactPerson: "PROD_ENV\nPROD_ENV", lastQueryDate: "01/06/2024\n00:00:00", lastPullDate: "01/06/2024\n00:00:00", lastValidPullDate: "01/06/2024\n00:00:00" },
];

const StatusDot = ({ status }: { status: OperatorStatus }) => (
  <div className="flex items-center gap-2 justify-center">
    <span>{status === "active" ? "פעיל" : "מושבת"}</span>
    <span className={`inline-block w-3 h-3 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
  </div>
);

const Operators = () => {
  const [search, setSearch] = useState("");

  const filtered = mockOperators.filter((op) =>
    op.name.includes(search) || String(op.operatorId).includes(search)
  );

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
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
            <Input
              placeholder="חיפוש"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 w-56"
            />
          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <BarChart3 className="ml-2 h-4 w-4" />
            הצגת גרפים
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="ml-2 h-4 w-4" />
            הוספת מפעיל
          </Button>
        </div>
      </header>

      {/* Page heading */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <UserCog className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">ניהול מפעילים</h1>
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} מתוך {mockOperators.length}</span>
      </div>

      {/* Table */}
      <div className="px-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-right w-10"></TableHead>
              <TableHead className="text-right">
                <span className="flex items-center gap-1 justify-end">שם המפעיל <ChevronDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="text-center">מזהה מפעיל</TableHead>
              <TableHead className="text-center">סטטוס ניהולי</TableHead>
              <TableHead className="text-center">סטטוס תפעולי</TableHead>
              <TableHead className="text-center">תשאול היסטוריה</TableHead>
              <TableHead className="text-center">איש קשר</TableHead>
              <TableHead className="text-center">מועד שאילתת היסטוריה אחרונה</TableHead>
              <TableHead className="text-center">מועד שליפה אחרון</TableHead>
              <TableHead className="text-center">מועד שליפה תקינה אחרונה</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((op) => (
              <TableRow key={op.id} className="hover:bg-muted/30 border-b">
                <TableCell className="text-center">
                  <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TableCell>
                <TableCell className="text-right font-medium">
                  <div className="flex items-center gap-2 justify-end">
                    {op.name}
                    <span className="text-primary cursor-pointer">✓</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{op.operatorId}</TableCell>
                <TableCell className="text-center">
                  <StatusDot status={op.managementStatus} />
                </TableCell>
                <TableCell className="text-center">
                  <StatusDot status={op.operationalStatus} />
                </TableCell>
                <TableCell className="text-center">{op.historyQuery}</TableCell>
                <TableCell className="text-center whitespace-pre-line text-sm">{op.contactPerson}</TableCell>
                <TableCell className="text-center whitespace-pre-line text-sm">{op.lastQueryDate}</TableCell>
                <TableCell className="text-center whitespace-pre-line text-sm">{op.lastPullDate}</TableCell>
                <TableCell className="text-center whitespace-pre-line text-sm">{op.lastValidPullDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Operators;
