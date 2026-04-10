import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionHeading from "@/components/SectionHeading";
import { useToast } from "@/hooks/use-toast";

const issueTypes = [
  "Street Light",
  "Mosquito",
  "Trees",
  "Cleanliness",
  "Emergency",
  "Personal",
  "Other",
];

const Complaints = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission (will connect to Supabase later)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({ title: "Complaint Submitted!", description: "We will look into your issue soon." });
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="py-20">
        <div className="container max-w-lg text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">Your complaint has been submitted. We will address it soon.</p>
          <Button onClick={() => setSubmitted(false)}>Submit Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container max-w-2xl">
        <SectionHeading title="Complaints & Feedback" subtitle="Let us know about issues in the village" icon={MessageSquare} />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 md:p-8 card-shadow space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold mb-1.5">Your Name (Optional)</label>
            <Input placeholder="Enter your name" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Issue Type *</label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map(type => (
                  <SelectItem key={type} value={type.toLowerCase().replace(/ /g, "_")}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Description *</label>
            <Textarea placeholder="Describe the issue in detail..." rows={4} required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Upload Image (Optional)</label>
            <Input type="file" accept="image/*" />
          </div>

          <Button type="submit" size="lg" className="w-full text-base font-bold" disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Submitting..." : "Submit Complaint"}
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default Complaints;
