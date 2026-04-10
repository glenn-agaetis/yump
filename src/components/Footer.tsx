import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground py-8 mt-16">
    <div className="container text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Heart className="w-5 h-5" fill="currentColor" />
        <span className="font-heading font-bold text-lg">YUMP</span>
      </div>
      <p className="text-sm opacity-80">Yuva Utkrasta Mandal Persav — Serving Our Village Together</p>
      <p className="text-xs opacity-60 mt-2">© {new Date().getFullYear()} YUMP. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
