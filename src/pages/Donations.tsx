import { motion } from "framer-motion";
import { Heart, QrCode, IndianRupee } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Donations = () => {
  const { data: settings } = useSiteSettings();
  const upiId = settings?.upi_id || "yump@upi";
  const qrCodeUrl = settings?.qr_code_url;

  const { data: donors = [] } = useQuery({
    queryKey: ["donors"],
    queryFn: async () => {
      const { data } = await supabase.from("donors").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

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
          </motion.div>

          {/* Donor list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 card-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <IndianRupee className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Our Generous Donors</h3>
            </div>
            <div className="space-y-3">
              {donors.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {d.name[0]}
                    </div>
                    <span className="font-semibold">{d.name}</span>
                  </div>
                  <span className="font-bold text-primary">{d.amount}</span>
                </motion.div>
              ))}
              {donors.length === 0 && <p className="text-muted-foreground text-center py-4">No donors yet.</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
