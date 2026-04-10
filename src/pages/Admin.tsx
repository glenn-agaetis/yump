import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Settings, Image, Heart, Calendar, Droplets, MessageSquare, LogOut, Upload, Trash2, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin-login");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1">
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1" /> Settings</TabsTrigger>
            <TabsTrigger value="gallery"><Image className="w-4 h-4 mr-1" /> Gallery</TabsTrigger>
            <TabsTrigger value="donations"><Heart className="w-4 h-4 mr-1" /> Donors</TabsTrigger>
            <TabsTrigger value="events"><Calendar className="w-4 h-4 mr-1" /> Events</TabsTrigger>
            <TabsTrigger value="blood"><Droplets className="w-4 h-4 mr-1" /> Blood</TabsTrigger>
            <TabsTrigger value="complaints"><MessageSquare className="w-4 h-4 mr-1" /> Complaints</TabsTrigger>
          </TabsList>

          <TabsContent value="settings"><SiteSettingsTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="gallery"><GalleryTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="donations"><DonorsTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="events"><EventsTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="blood"><BloodDonorsTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="complaints"><ComplaintsTab toast={toast} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// --- Site Settings Tab ---
const SiteSettingsTab = ({ toast, queryClient }: any) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").then(({ data }) => {
      const s: Record<string, string> = {};
      data?.forEach(r => { s[r.key] = r.value; });
      setSettings(s);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      // Upload QR code if selected
      if (qrFile) {
        const ext = qrFile.name.split(".").pop();
        const path = `qr-code.${ext}`;
        await supabase.storage.from("site-assets").upload(path, qrFile, { upsert: true });
        const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(path);
        settings.qr_code_url = urlData.publicUrl;
      }
      // Upload logo if selected
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `logo.${ext}`;
        await supabase.storage.from("site-assets").upload(path, logoFile, { upsert: true });
        const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(path);
        settings.logo_url = urlData.publicUrl;
      }
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from("site_settings").update({ value }).eq("key", key);
      }
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Settings saved!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div className="bg-card rounded-2xl p-6 card-shadow max-w-2xl space-y-5">
      <h2 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5" /> Site Settings</h2>
      <div>
        <label className="block text-sm font-semibold mb-1">Site Name</label>
        <Input value={settings.site_name || ""} onChange={e => setSettings({ ...settings, site_name: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Full Name / Tagline</label>
        <Input value={settings.site_full_name || ""} onChange={e => setSettings({ ...settings, site_full_name: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">UPI ID</label>
        <Input value={settings.upi_id || ""} onChange={e => setSettings({ ...settings, upi_id: e.target.value })} placeholder="yump@upi" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">QR Code Image</label>
        {settings.qr_code_url && <img src={settings.qr_code_url} alt="QR" className="w-32 h-32 object-contain mb-2 rounded-lg border" />}
        <Input type="file" accept="image/*" onChange={e => setQrFile(e.target.files?.[0] || null)} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Logo Image</label>
        {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="w-20 h-20 object-contain mb-2 rounded-lg border" />}
        <Input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
      </div>
      <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
    </div>
  );
};

// --- Gallery Tab ---
const GalleryTab = ({ toast, queryClient }: any) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Community");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = () => supabase.from("gallery_photos").select("*").order("display_order").then(({ data }) => setPhotos(data || []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!file || !title) return;
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage.from("gallery").upload(path, file);
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
      await supabase.from("gallery_photos").insert({ title, category, image_url: urlData.publicUrl, display_order: photos.length });
      setTitle(""); setFile(null); setCategory("Community");
      load();
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      toast({ title: "Photo added!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const remove = async (id: string) => {
    await supabase.from("gallery_photos").delete().eq("id", id);
    load();
    queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
    toast({ title: "Photo removed" });
  };

  return (
    <div className="bg-card rounded-2xl p-6 card-shadow space-y-5">
      <h2 className="text-xl font-bold flex items-center gap-2"><Image className="w-5 h-5" /> Gallery Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <Input placeholder="Photo title" value={title} onChange={e => setTitle(e.target.value)} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Events">Events</SelectItem>
            <SelectItem value="Village">Village</SelectItem>
            <SelectItem value="Community">Community</SelectItem>
          </SelectContent>
        </Select>
        <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        <Button onClick={add} disabled={uploading || !file || !title}>
          <Upload className="w-4 h-4 mr-1" /> {uploading ? "Uploading..." : "Add Photo"}
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map(p => (
          <div key={p.id} className="relative group rounded-xl overflow-hidden aspect-[4/3]">
            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-foreground/70 text-primary-foreground p-2 text-xs font-semibold">{p.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Donors Tab ---
const DonorsTab = ({ toast, queryClient }: any) => {
  const [donors, setDonors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

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
            <div><span className="font-semibold">{d.name}</span> — <span className="text-primary font-bold">{d.amount}</span></div>
            <Button size="sm" variant="ghost" onClick={() => remove(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Events Tab ---
const EventsTab = ({ toast, queryClient }: any) => {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isUpcoming, setIsUpcoming] = useState(true);

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
          <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div>
              <span className="font-semibold">{ev.title}</span>
              <span className="text-muted-foreground text-sm ml-2">{ev.date}</span>
              {ev.is_upcoming && <span className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">Upcoming</span>}
            </div>
            <Button size="sm" variant="ghost" onClick={() => remove(ev.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Blood Donors Tab ---
const BloodDonorsTab = ({ toast, queryClient }: any) => {
  const [donors, setDonors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [phone, setPhone] = useState("");

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

  const remove = async (id: string) => {
    await supabase.from("blood_donors").delete().eq("id", id);
    load();
    queryClient.invalidateQueries({ queryKey: ["blood-donors"] });
    toast({ title: "Donor removed" });
  };

  const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-sm">{d.blood_group}</span>
              <span className="font-semibold">{d.name}</span>
              {d.phone && <span className="text-muted-foreground text-sm">{d.phone}</span>}
            </div>
            <Button size="sm" variant="ghost" onClick={() => remove(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Complaints Tab ---
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

export default Admin;
