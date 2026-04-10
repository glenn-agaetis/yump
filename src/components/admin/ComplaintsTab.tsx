import { useState, useEffect } from "react";
import { MessageSquare, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ComplaintsTab = ({ toast }: any) => {
  const [complaints, setComplaints] = useState<any[]>([]);

  const load = () => supabase.from("complaints").select("*").order("created_at", { ascending: false }).then(({ data }) => setComplaints(data || []));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("complaints").update({ status }).eq("id", id);
    load();
    toast({ title: `Complaint marked as ${status}` });
  };

  return (
    <div className="bg-card rounded-2xl p-6 card-shadow space-y-5">
      <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Complaints ({complaints.length})</h2>
      {complaints.length === 0 && <p className="text-muted-foreground">No complaints yet.</p>}
      <div className="space-y-3">
        {complaints.map(c => (
          <div key={c.id} className="p-4 rounded-xl bg-muted/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === "pending" ? "bg-yellow-100 text-yellow-800" : c.status === "resolved" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                  {c.status}
                </span>
                <span className="font-bold">{c.issue_type}</span>
                {c.name && <span className="text-muted-foreground text-sm">by {c.name}</span>}
              </div>
              <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm">{c.description}</p>
            {c.image_url && <img src={c.image_url} alt="complaint" className="w-32 h-32 object-cover rounded-lg" />}
            <div className="flex gap-2">
              {c.status !== "resolved" && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(c.id, "resolved")}>
                  <Check className="w-3 h-3 mr-1" /> Resolve
                </Button>
              )}
              {c.status !== "pending" && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(c.id, "pending")}>
                  <X className="w-3 h-3 mr-1" /> Reopen
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsTab;
