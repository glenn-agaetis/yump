import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, QrCode, Gift, Users, Calendar, Send, CheckCircle } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Donations = () => {
  const { data: settings } = useSiteSettings();
  const upiId = settings?.upi_id || "yump@upi";
  const qrCodeUrl = settings?.qr_code_url;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [donorName, setDonorName] = useState("");
  const [donorAmount, setDonorAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: donorCount = 0 } = useQuery({
    queryKey: ["donors-count"],
    queryFn: async () => {
      const { count } = await supabase.from("donors").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const handleDonorSubmit = async () => {
    if (!donorName.trim() || !donorAmount.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("donors").insert({ name: donorName.trim(), amount: donorAmount.trim() });
      if (error) throw error;
      setSubmitted(true);
      setDonorName("");
      setDonorAmount("");
      queryClient.invalidateQueries({ queryKey: ["donors-count"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      toast({ title: "Thank you! 🙏", description: "Your donation has been recorded." });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

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
          {/* QR Code / UPI + Donor Form */}
          <div className="space-y-6">
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

            {/* Donor self-registration form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 card-shadow"
            >
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" /> Already paid? Let us know!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                After completing your UPI payment, fill this form so we can record your contribution.
              </p>
              {submitted ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">Thank you for your generous donation! Your contribution has been recorded.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Your name"
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    maxLength={100}
                  />
                  <Input
                    placeholder="Amount paid (e.g. ₹500)"
                    value={donorAmount}
                    onChange={e => setDonorAmount(e.target.value)}
                    maxLength={50}
                  />
                  <Button
                    onClick={handleDonorSubmit}
                    disabled={submitting || !donorName.trim() || !donorAmount.trim()}
                    className="w-full"
                  >
                    {submitting ? "Submitting..." : "Submit Donation Details"}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

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
