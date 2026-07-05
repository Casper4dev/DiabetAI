import { NavLink, useNavigate } from "react-router-dom";
import { Activity, LayoutDashboard, User, CalendarDays, ClipboardList, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patient-portal", label: "Patient Portal", icon: User },
  { to: "/consultations", label: "Consultations", icon: CalendarDays },
  { to: "/next-steps", label: "Next Steps", icon: ClipboardList },
];

const GlobalNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="gradient-navy px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="bg-teal rounded-lg p-1.5">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-primary-foreground tracking-tight leading-tight">DiabetAI</h1>
            <p className="text-[10px] text-primary-foreground/50 hidden sm:block">Early Detection System</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"
                )
              }
            >
              <l.icon className="h-3.5 w-3.5" />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="sm:ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:inline text-[11px] text-primary-foreground/70 truncate max-w-[180px]">
                {user.email}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSignOut}
                className="h-7 px-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 text-xs gap-1"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </Button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className="text-xs text-primary-foreground/80 hover:text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary-foreground/10"
            >
              Clinician Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default GlobalNav;
