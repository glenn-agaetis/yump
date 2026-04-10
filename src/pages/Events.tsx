import { motion } from "framer-motion";
import { Calendar, Droplets, PartyPopper, Users, Baby } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, any> = { Droplets, PartyPopper, Users, Baby, Calendar };

const Events = () => {
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const upcoming = events.filter(e => e.is_upcoming);
  const past = events.filter(e => !e.is_upcoming);

  return (
    <div className="py-16">
      <div className="container">
        <SectionHeading title="Events" subtitle="Community events organized by YUMP" icon={Calendar} />

        {upcoming.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
              Upcoming Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((event, i) => <EventCard key={event.id} event={event} index={i} highlight />)}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <>
            <h3 className="text-xl font-bold text-muted-foreground mb-6">Past Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event, index, highlight }: { event: any; index: number; highlight?: boolean }) => {
  const Icon = iconMap[event.icon_name] || Calendar;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl p-6 card-shadow transition-all duration-300 hover:-translate-y-1 hover:card-shadow-hover ${
        highlight ? "bg-primary text-primary-foreground" : "bg-card"
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
        highlight ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-xl mb-1">{event.title}</h3>
      <p className={`text-sm mb-3 font-semibold ${highlight ? "opacity-80" : "text-secondary"}`}>{event.date}</p>
      <p className={`text-sm ${highlight ? "opacity-90" : "text-muted-foreground"}`}>{event.description}</p>
    </motion.div>
  );
};

export default Events;
