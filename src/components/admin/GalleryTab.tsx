import { useState, useEffect } from "react";
import { Image, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const GalleryTab = ({ toast, queryClient }: any) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Community");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = () => supabase.from("gallery_photos").select("*").order("display_order").then(({ data }) => setPhotos(data || []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!files || files.length === 0 || !title) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `${Date.now()}-${i}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("gallery").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
        const photoTitle = files.length > 1 ? `${title} (${i + 1})` : title;
        await supabase.from("gallery_photos").insert({ title: photoTitle, category, image_url: urlData.publicUrl, display_order: photos.length + i });
      }
      setTitle(""); setFiles(null); setCategory("Community");
      // Reset file input
      const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      load();
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      toast({ title: `${files.length} photo(s) added!` });
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
        <Input placeholder="Photo title (shared for bulk)" value={title} onChange={e => setTitle(e.target.value)} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Events">Events</SelectItem>
            <SelectItem value="Village">Village</SelectItem>
            <SelectItem value="Community">Community</SelectItem>
          </SelectContent>
        </Select>
        <Input id="gallery-file-input" type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} />
        <Button onClick={add} disabled={uploading || !files || files.length === 0 || !title}>
          <Upload className="w-4 h-4 mr-1" /> {uploading ? "Uploading..." : `Add ${files?.length || 0} Photo(s)`}
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

export default GalleryTab;
