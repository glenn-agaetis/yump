import { motion } from "framer-motion";
import { Heart, QrCode, Gift, Users, Calendar } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Donations = () => {
  const { data: settings } = useSiteSettings();
  const upiId = settings?.upi_id || "yump@upi";
  const qrCodeUrl = settings?.qr_code_url;

  const { data: donorCount = 0 } = useQuery({
    queryKey: ["donors-count"],
    queryFn: async () => {
      const { count } = await supabase.from("donors").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const causes = [
    { icon: Gift, title: "Christmas Celebrations", description: "Help us organize community Christmas events with gifts, food, and joy for everyone in the village." },
    { icon: Users, title: "Community Development", description: "Support infrastructure improvements, educational programs, and welfare initiatives for our village." },
    { icon: Calendar, title: "Cultural Events", description: "Fund traditional festivals, sports events, and cultural programs that bring our community together." },
  ];

  return (
    <div className="py-16">
      <div className="container">
        <SectionHeading title="Support YUMP" subtitle="Your donation helps us serve the village better" icon={Heart} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* QR Code / UPI */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 card-shadow text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-4">Scan & Pay to Support YUMP</h3>
            <div className="w-56 h-56 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-muted-foreground text-sm p-4">
                  <QrCode className="w-20 h-20 mx-auto mb-2 opacity-40" />
                  <p className="font-medium">QR Code</p>
                  <p className="text-xs mt-1 opacity-70">Admin can upload QR code from dashboard</p>
                </div>
              )}
            </div>
            <div className="bg-muted rounded-xl p-4 mb-3">
              <p className="text-sm text-muted-foreground mb-1">UPI ID</p>
              <p className="font-bold text-lg text-secondary">{upiId}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <span className="font-semibold text-primary">{donorCount}+</span> generous donors have contributed so far
            </p>
          </motion.div>

          {/* What your donation supports */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" /> What Your Donation Supports
            </h3>
            {causes.map((cause, i) => (
              <motion.div
                key={cause.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <cause.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{cause.title}</h4>
                    <p className="text-sm text-muted-foreground">{cause.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="bg-muted/50 rounded-2xl p-6 text-center">
              <p className="text-muted-foreground text-sm">
                Every contribution, big or small, makes a difference. Thank you for supporting our village community! 🙏
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
