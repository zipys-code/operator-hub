import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, UserCog } from "lucide-react";
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

const pageTitles: Record<string, string> = {
  "/operators": "ניהול מפעילים",
  "/developers": "ניהול מפתחים",
  "/signs": "ניהול שלטים",
  "/events": "ניהול אירועים",
  "/users": "ניהול משתמשים",
};

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = pageTitles[location.pathname] || "";

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ===== TOP BAR ===== */}
      <header className="flex items-center justify-between border-b px-4 py-2 bg-background shrink-0">
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

        {pageTitle && (
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary">{pageTitle}</h1>
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <UserCog className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}
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
