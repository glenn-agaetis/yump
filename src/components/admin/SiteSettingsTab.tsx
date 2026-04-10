import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

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
      if (qrFile) {
        const ext = qrFile.name.split(".").pop();
        const path = `qr-code.${ext}`;
        await supabase.storage.from("site-assets").upload(path, qrFile, { upsert: true });
        const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(path);
        settings.qr_code_url = urlData.publicUrl;
      }
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

export default SiteSettingsTab;
