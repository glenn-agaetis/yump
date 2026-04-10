import { motion } from "framer-motion";
import { Heart, QrCode, IndianRupee } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const donors = [
  { name: "Rajesh Patil", amount: "₹5,000" },
  { name: "Suman Devi", amount: "₹2,000" },
  { name: "Anil Kumar", amount: "₹3,500" },
  { name: "Meena Bai", amount: "₹1,000" },
  { name: "Anonymous", amount: "₹10,000" },
];

const Donations = () => (
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
          <div className="w-48 h-48 bg-muted rounded-xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center text-muted-foreground text-sm">
              <QrCode className="w-16 h-16 mx-auto mb-2 opacity-40" />
              <p>UPI QR Code</p>
            </div>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">UPI ID</p>
            <p className="font-bold text-lg text-primary">yump@upi</p>
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
                key={d.name}
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
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default Donations;
