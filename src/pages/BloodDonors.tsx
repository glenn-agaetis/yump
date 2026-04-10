import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionHeading from "@/components/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodDonors = () => {
  const [filter, setFilter] = useState("all");

  const { data: donorsList = [] } = useQuery({
    queryKey: ["blood-donors"],
    queryFn: async () => {
      const { data } = await supabase.from("blood_donors").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const filtered = filter === "all" ? donorsList : donorsList.filter(d => d.blood_group === filter);

  return (
    <div className="py-16">
      <div className="container max-w-3xl">
        <SectionHeading title="Blood Donors" subtitle="Find blood donors from our village" icon={Droplets} />

        <div className="mb-8 flex justify-center">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Groups</SelectItem>
              {bloodGroups.map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((donor, i) => (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-card card-shadow hover:card-shadow-hover transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center font-bold text-lg shrink-0">
                {donor.blood_group}
              </div>
              <div>
                <p className="font-bold text-lg">{donor.name}</p>
                <p className="text-sm text-muted-foreground">Blood Group: {donor.blood_group}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10">No donors found for this blood group.</p>
        )}
      </div>
    </div>
  );
};

export default BloodDonors;
