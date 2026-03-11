import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Plus, BarChart3, UserCog, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const menuItems = [
  { label: "ניהול מפתחים", path: "/developers" },
  { label: "ניהול מפעילים", path: "/operators" },
  { label: "ניהול שלטים", path: "/signs" },
  { label: "ניהול אירועים", path: "/events" },
  { label: "ניהול משתמשים", path: "/users" },
  { label: "ניהול פניות תפעול", path: "/operation-requests" },
  { label: "ניהול פרמטרי מערכת", path: "/system-params" },
  { label: "בקרה מערכתית", path: "/system-control" },
  { label: "ניהול תפקידים והרשאות", path: "/roles" },
  { label: "ניהול הגדרות תהליכים", path: "/process-settings" },
  { label: "ניהול תהליכים", path: "/processes" },
  { label: "ניתוח הפעלת ממשקים", path: "/interface-analysis" },
  { label: "ניהול טבלאות קוד", path: "/code-tables" },
  { label: "ניהול מערכות חיזוי", path: "/prediction-systems" },
  { label: "ניתוח מדדי איכות חיזוי", path: "/prediction-quality" },
  { label: "ניהול הגדרות קו רציף", path: "/continuous-line" },
  { label: "ניהול הגדרות אירועים", path: "/event-settings" },
  { label: "הצגת היסטוריה קו רציף", path: "/continuous-history" },
  { label: "ניתוח נסיעות אוטובוסים", path: "/bus-analysis" },
];

// Map routes to page titles and whether they show action buttons
const pageMeta: Record<string, { title: string; hasActions?: boolean }> = {
  "/operators": { title: "ניהול מפעילים", hasActions: true },
  "/developers": { title: "ניהול מפתחים" },
  "/signs": { title: "ניהול שלטים" },
  "/events": { title: "ניהול אירועים" },
  "/users": { title: "ניהול משתמשים" },
};

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentMeta = pageMeta[location.pathname] || { title: "" };
  const isOperators = location.pathname === "/operators";

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ===== TOP BAR ===== */}
      <header className="flex items-center justify-between border-b px-4 py-2 bg-background shrink-0">
        {/* Right side (RTL): hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            aria-label="פתח תפריט"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <UserCog className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">ZipyS</span>
          </div>
        </div>

        {/* Center: search */}
        <div className="hidden sm:block">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש"
              className="pr-9 w-56"
              id="global-search"
            />
          </div>
        </div>

        {/* Left side (RTL): title + action buttons */}
        <div className="flex items-center gap-3">
          {isOperators && (
            <>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <BarChart3 className="ml-2 h-4 w-4" />הצגת גרפים
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                id="add-operator-btn"
              >
                <Plus className="ml-2 h-4 w-4" />הוספת מפעיל
              </Button>
            </>
          )}
          {currentMeta.title && (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-primary">{currentMeta.title}</h1>
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ===== SIDE DRAWER ===== */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-right">תפריט</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col py-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                className={`px-6 py-3 text-right text-sm transition-colors hover:bg-muted ${
                  location.pathname === item.path
                    ? "text-primary font-semibold bg-primary/5"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="flex items-center justify-between border-t px-4 py-1.5 text-xs text-muted-foreground bg-background shrink-0">
        <span>Current Release: mrn_ver34 (dev-domian)</span>
        <span className="font-semibold">
          <span className="text-primary">Yael</span>
          <span>Software</span>
        </span>
      </footer>
    </div>
  );
}
