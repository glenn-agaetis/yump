import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const categories = ["All", "Events", "Village", "Community"];

const photos = [
  { id: 1, src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600", title: "Community Gathering", category: "Community" },
  { id: 2, src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600", title: "Village Festival", category: "Events" },
  { id: 3, src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600", title: "Blood Donation Camp", category: "Events" },
  { id: 4, src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600", title: "Village Landscape", category: "Village" },
  { id: 5, src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600", title: "Tree Plantation", category: "Community" },
  { id: 6, src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600", title: "Celebration Day", category: "Events" },
  { id: 7, src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600", title: "Morning in Persav", category: "Village" },
  { id: 8, src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600", title: "Volunteers at Work", category: "Community" },
  { id: 9, src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600", title: "Village Fields", category: "Village" },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);

  const filtered = activeCategory === "All" ? photos : photos.filter(p => p.category === activeCategory);

  return (
    <div className="py-16">
      <div className="container">
        <SectionHeading title="Photo Gallery" subtitle="Moments captured from our village and events" icon={Camera} />

        {/* Category Filter */}
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

        {/* Photo Grid */}
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
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
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

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground cursor-pointer"
              >
                <X className="w-8 h-8" />
              </button>
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
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