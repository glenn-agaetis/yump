import { useState, useEffect } from "react";
import { Droplets, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodDonorsTab = ({ toast, queryClient }: any) => {
  const [donors, setDonors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBloodGroup, setEditBloodGroup] = useState("O+");
  const [editPhone, setEditPhone] = useState("");

  const load = () => supabase.from("blood_donors").select("*").order("created_at", { ascending: false }).then(({ data }) => setDonors(data || []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name) return;
    await supabase.from("blood_donors").insert({ name, blood_group: bloodGroup, phone: phone || null });
    setName(""); setPhone("");
    load();
    queryClient.invalidateQueries({ queryKey: ["blood-donors"] });
    toast({ title: "Blood donor added!" });
  };

  const startEdit = (d: any) => { setEditId(d.id); setEditName(d.name); setEditBloodGroup(d.blood_group); setEditPhone(d.phone || ""); };

  const saveEdit = async () => {
    if (!editName) return;
    await supabase.from("blood_donors").update({ name: editName, blood_group: editBloodGroup, phone: editPhone || null }).eq("id", editId);
    setEditId(null);
    load();
    queryClient.invalidateQueries({ queryKey: ["blood-donors"] });
    toast({ title: "Blood donor updated!" });
  };

  const remove = async (id: string) => {
    await supabase.from("blood_donors").delete().eq("id", id);
    load();
    queryClient.invalidateQueries({ queryKey: ["blood-donors"] });
    toast({ title: "Donor removed" });
  };

  return (
    <div className="bg-card rounded-2xl p-6 card-shadow space-y-5 max-w-2xl">
      <h2 className="text-xl font-bold flex items-center gap-2"><Droplets className="w-5 h-5" /> Blood Donor Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <Select value={bloodGroup} onValueChange={setBloodGroup}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{groups.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
        </Select>
        <Input placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
        <Button onClick={add} disabled={!name}><Plus className="w-4 h-4 mr-1" /> Add</Button>
      </div>
      <div className="space-y-2">
        {donors.map(d => (
          <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            {editId === d.id ? (
              <>
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-8" />
                  <Select value={editBloodGroup} onValueChange={setEditBloodGroup}>
                    <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>{groups.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="Phone" className="h-8 w-32" />
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={saveEdit}><Check className="w-4 h-4 text-green-600" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-sm">{d.blood_group}</span>
                  <span className="font-semibold">{d.name}</span>
                  {d.phone && <span className="text-muted-foreground text-sm">{d.phone}</span>}
                </div>
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

export default BloodDonorsTab;
