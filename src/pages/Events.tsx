import { motion } from "framer-motion";
import { Calendar, Droplets, PartyPopper, Users, Baby } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const events = [
  {
    title: "Blood Donation Camp",
    date: "January 26, 2026",
    description: "Join us in saving lives. Donate blood and be a hero for someone in need.",
    icon: Droplets,
    upcoming: true,
  },
  {
    title: "Christmas Celebration",
    date: "December 25, 2025",
    description: "Community Christmas celebration with carols, gifts, and festive food for all villagers.",
    icon: PartyPopper,
    upcoming: false,
  },
  {
    title: "Parents Day",
    date: "July 23, 2025",
    description: "Honoring and celebrating all the wonderful parents of Persav village.",
    icon: Users,
    upcoming: false,
  },
  {
    title: "Children's Day Celebration",
    date: "November 14, 2025",
    description: "Fun activities, games, and prizes for the children of our village.",
    icon: Baby,
    upcoming: false,
  },
];

const Events = () => (
  <div className="py-16">
    <div className="container">
      <SectionHeading title="Events" subtitle="Community events organized by YUMP" icon={Calendar} />

      {/* Upcoming */}
      {events.filter(e => e.upcoming).length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
            Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.filter(e => e.upcoming).map((event, i) => (
              <EventCard key={event.title} event={event} index={i} highlight />
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      <h3 className="text-xl font-bold text-muted-foreground mb-6">Past Events</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.filter(e => !e.upcoming).map((event, i) => (
          <EventCard key={event.title} event={event} index={i} />
        ))}
      </div>
    </div>
  </div>
);

const EventCard = ({ event, index, highlight }: { event: typeof events[0]; index: number; highlight?: boolean }) => (
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
      <event.icon className="w-6 h-6" />
    </div>
    <h3 className="font-bold text-xl mb-1">{event.title}</h3>
    <p className={`text-sm mb-3 font-semibold ${highlight ? "opacity-80" : "text-secondary"}`}>{event.date}</p>
    <p className={`text-sm ${highlight ? "opacity-90" : "text-muted-foreground"}`}>{event.description}</p>
  </motion.div>
);

export default Events;
