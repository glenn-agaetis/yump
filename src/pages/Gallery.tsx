import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const categories = ["All", "Events", "Village", "Community"];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const { data: photos = [] } = useQuery({
    queryKey: ["gallery-photos"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_photos").select("*").order("display_order");
      return data || [];
    },
  });

  const filtered = activeCategory === "All" ? photos : photos.filter(p => p.category === activeCategory);

  return (
    <div className="py-16">
      <div className="container">
        <SectionHeading title="Photo Gallery" subtitle="Moments captured from our village and events" icon={Camera} />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">No photos yet. Admin can add photos from the dashboard.</p>}

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedPhoto(photo)}
                className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3]"
              >
                <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p className="text-primary-foreground font-bold text-sm">{photo.title}</p>
                    <p className="text-primary-foreground/70 text-xs">{photo.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground cursor-pointer">
                <X className="w-8 h-8" />
              </button>
              <motion.img
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                src={selectedPhoto.image_url} alt={selectedPhoto.title}
                className="max-w-full max-h-[85vh] rounded-xl object-contain"
                onClick={e => e.stopPropagation()}
              />
              <div className="absolute bottom-6 text-center text-primary-foreground">
                <p className="font-bold text-lg">{selectedPhoto.title}</p>
                <p className="text-sm opacity-70">{selectedPhoto.category}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;
