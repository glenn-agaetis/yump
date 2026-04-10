import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, Home, Calendar, MessageSquare, CreditCard, Droplets, Phone, Camera, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/events", label: "Events", icon: Calendar },
  { path: "/complaints", label: "Complaints", icon: MessageSquare },
  { path: "/donations", label: "Donations", icon: CreditCard },
  { path: "/blood-donors", label: "Blood Donors", icon: Droplets },
  { path: "/gallery", label: "Gallery", icon: Camera },
  { path: "/contact", label: "Contact", icon: Phone },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const siteName = settings?.site_name || "YUMP";
  const logoUrl = settings?.logo_url;

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="w-8 h-8 object-contain" />
          ) : (
            <Heart className="w-7 h-7 text-primary" fill="currentColor" />
          )}
          <span className="font-heading font-bold text-xl text-primary">{siteName}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link to="/admin-login" className="px-2 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Shield className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="container py-3 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                      active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/admin-login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold text-muted-foreground hover:bg-muted"
              >
                <Shield className="w-5 h-5" />
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
