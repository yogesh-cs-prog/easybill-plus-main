import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-mark.png";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Nimbus Invoices logo" className="h-7 w-7" loading="lazy" />
            <span className="font-semibold">Nimbus Invoices</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard">
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} size="sm">Dashboard</Button>
              )}
            </NavLink>
            <NavLink to="/bills">
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} size="sm">Bills</Button>
              )}
            </NavLink>
            <NavLink to="/customers">
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} size="sm">Customers</Button>
              )}
            </NavLink>
            <div className="w-px h-6 bg-border mx-2" />
            <NavLink to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </NavLink>
            <NavLink to="/register">
              <Button variant="hero" size="sm">Register</Button>
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nimbus Invoices — All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
