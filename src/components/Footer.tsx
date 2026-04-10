import { Heart } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.site_name || "YUMP";
  const fullName = settings?.site_full_name || "Yuva Utkrasta Mandal Persav";

  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-16">
      <div className="container text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5" fill="currentColor" />
          <span className="font-heading font-bold text-lg">{siteName}</span>
        </div>
        <p className="text-sm opacity-80">{fullName} — Serving Our Village Together</p>
        <p className="text-xs opacity-60 mt-2">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
