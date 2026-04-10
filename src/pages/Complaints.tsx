import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionHeading from "@/components/SectionHeading";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const issueTypes = ["Street Light", "Mosquito", "Trees", "Cleanliness", "Emergency", "Personal", "Other"];

const Complaints = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!issueType || !description) return;
    setLoading(true);

    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const path = `${Date.now()}-${imageFile.name}`;
        await supabase.storage.from("complaints").upload(path, imageFile);
        const { data: urlData } = supabase.storage.from("complaints").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("complaints").insert({
        name: name || null,
        issue_type: issueType,
        description,
        image_url: imageUrl,
      });

      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Complaint Submitted!", description: "We will look into your issue soon." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
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
          <Button onClick={() => { setSubmitted(false); setName(""); setIssueType(""); setDescription(""); setImageFile(null); }}>Submit Another</Button>
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
            <Input placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Issue Type *</label>
            <Select value={issueType} onValueChange={setIssueType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Description *</label>
            <Textarea placeholder="Describe the issue in detail..." rows={4} required value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Upload Image (Optional)</label>
            <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          </div>

          <Button type="submit" size="lg" className="w-full text-base font-bold" disabled={loading || !issueType || !description}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Submitting..." : "Submit Complaint"}
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default Complaints;
