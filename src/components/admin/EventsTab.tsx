import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const EventsTab = ({ toast, queryClient }: any) => {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsUpcoming, setEditIsUpcoming] = useState(true);

  const load = () => supabase.from("events").select("*").order("created_at", { ascending: false }).then(({ data }) => setEvents(data || []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title || !date || !description) return;
    await supabase.from("events").insert({ title, date, description, is_upcoming: isUpcoming });
    setTitle(""); setDate(""); setDescription(""); setIsUpcoming(true);
    load();
    queryClient.invalidateQueries({ queryKey: ["events"] });
    toast({ title: "Event added!" });
  };

  const startEdit = (ev: any) => {
    setEditId(ev.id); setEditTitle(ev.title); setEditDate(ev.date);
    setEditDescription(ev.description); setEditIsUpcoming(ev.is_upcoming);
  };

  const saveEdit = async () => {
    if (!editTitle || !editDate || !editDescription) return;
    await supabase.from("events").update({ title: editTitle, date: editDate, description: editDescription, is_upcoming: editIsUpcoming }).eq("id", editId);
    setEditId(null);
    load();
    queryClient.invalidateQueries({ queryKey: ["events"] });
    toast({ title: "Event updated!" });
  };

  const remove = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    load();
    queryClient.invalidateQueries({ queryKey: ["events"] });
    toast({ title: "Event removed" });
  };

  return (
    <div className="bg-card rounded-2xl p-6 card-shadow space-y-5 max-w-2xl">
      <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="w-5 h-5" /> Event Management</h2>
      <div className="space-y-3">
        <Input placeholder="Event title" value={title} onChange={e => setTitle(e.target.value)} />
        <Input placeholder="Date (e.g. January 26, 2026)" value={date} onChange={e => setDate(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={isUpcoming} onChange={e => setIsUpcoming(e.target.checked)} className="rounded" />
          Mark as upcoming
        </label>
        <Button onClick={add} disabled={!title || !date || !description}><Plus className="w-4 h-4 mr-1" /> Add Event</Button>
      </div>
      <div className="space-y-2">
        {events.map(ev => (
          <div key={ev.id} className="p-3 rounded-xl bg-muted/50 space-y-2">
            {editId === ev.id ? (
              <div className="space-y-2">
                <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="h-8" />
                <Input value={editDate} onChange={e => setEditDate(e.target.value)} className="h-8" />
                <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="min-h-[60px]" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editIsUpcoming} onChange={e => setEditIsUpcoming(e.target.checked)} className="rounded" />
                  Upcoming
                </label>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={saveEdit}><Check className="w-3 h-3 mr-1" /> Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}><X className="w-3 h-3 mr-1" /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{ev.title}</span>
                  <span className="text-muted-foreground text-sm ml-2">{ev.date}</span>
                  {ev.is_upcoming && <span className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">Upcoming</span>}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(ev)}><Pencil className="w-4 h-4 text-muted-foreground" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(ev.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsTab;
