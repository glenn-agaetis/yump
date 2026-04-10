import { useState, useEffect } from "react";
import { Heart, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const DonorsTab = ({ toast, queryClient }: any) => {
  const [donors, setDonors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const load = () => supabase.from("donors").select("*").order("created_at", { ascending: false }).then(({ data }) => setDonors(data || []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name || !amount) return;
    await supabase.from("donors").insert({ name, amount });
    setName(""); setAmount("");
    load();
    queryClient.invalidateQueries({ queryKey: ["donors"] });
    toast({ title: "Donor added!" });
  };

  const startEdit = (d: any) => { setEditId(d.id); setEditName(d.name); setEditAmount(d.amount); };

  const saveEdit = async () => {
    if (!editName || !editAmount) return;
    await supabase.from("donors").update({ name: editName, amount: editAmount }).eq("id", editId);
    setEditId(null);
    load();
    queryClient.invalidateQueries({ queryKey: ["donors"] });
    toast({ title: "Donor updated!" });
  };

  const remove = async (id: string) => {
    await supabase.from("donors").delete().eq("id", id);
    load();
    queryClient.invalidateQueries({ queryKey: ["donors"] });
    toast({ title: "Donor removed" });
  };

  return (
    <div className="bg-card rounded-2xl p-6 card-shadow space-y-5 max-w-2xl">
      <h2 className="text-xl font-bold flex items-center gap-2"><Heart className="w-5 h-5" /> Donor Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <Input placeholder="Donor name" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Amount (e.g. ₹5,000)" value={amount} onChange={e => setAmount(e.target.value)} />
        <Button onClick={add} disabled={!name || !amount}><Plus className="w-4 h-4 mr-1" /> Add Donor</Button>
      </div>
      <div className="space-y-2">
        {donors.map(d => (
          <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            {editId === d.id ? (
              <>
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-8" />
                  <Input value={editAmount} onChange={e => setEditAmount(e.target.value)} className="h-8 w-32" />
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={saveEdit}><Check className="w-4 h-4 text-green-600" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
                </div>
              </>
            ) : (
              <>
                <div><span className="font-semibold">{d.name}</span> — <span className="text-primary font-bold">{d.amount}</span></div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(d)}><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorsTab;
