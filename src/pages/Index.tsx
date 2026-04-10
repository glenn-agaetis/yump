import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, Heart, Droplets, Users, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";

const features = [
  { icon: Calendar, title: "Community Events", desc: "Blood donation camps, festivals, and celebrations", link: "/events" },
  { icon: MessageSquare, title: "Raise Complaints", desc: "Report village issues & get them resolved", link: "/complaints" },
  { icon: Heart, title: "Donate & Support", desc: "Help YUMP serve the community better", link: "/donations" },
  { icon: Droplets, title: "Blood Donors", desc: "Find blood donors from our village instantly", link: "/blood-donors" },
];

const upcomingEvents = [
  { title: "Blood Donation Camp", date: "Jan 26, 2026", icon: Droplets },
  { title: "Children's Day Celebration", date: "Nov 14, 2026", icon: Users },
  { title: "Tree Plantation Drive", date: "Jun 5, 2026", icon: TreePine },
];

const Index = () => (
  <div>
    {/* Hero */}
    <section className="hero-gradient text-primary-foreground py-20 md:py-32">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Heart className="w-4 h-4" fill="currentColor" />
            <span className="text-sm font-semibold">Yuva Utkrasta Mandal Persav</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Serving Our Village<br />Together
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Empowering our community through events, services, and togetherness. Join us in making Persav a better place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-base font-bold px-8">
              <Link to="/events">View Events</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base font-bold px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/complaints">Raise Complaint</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="py-16">
      <div className="container">
        <SectionHeading title="What We Do" subtitle="YUMP works for the betterment of our village" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={f.link}
                className="block p-6 rounded-2xl bg-card card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Upcoming Events */}
    <section className="py-16 bg-muted/50">
      <div className="container">
        <SectionHeading title="Upcoming Events" icon={Calendar} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {upcomingEvents.map((e, i) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 card-shadow text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-3">
                <e.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">{e.title}</h3>
              <p className="text-muted-foreground text-sm">{e.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Index;
