import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

const SectionHeading = ({ title, subtitle, icon: Icon }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-center mb-10"
  >
    {Icon && (
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
        <Icon className="w-7 h-7" />
      </div>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
    {subtitle && <p className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto">{subtitle}</p>}
  </motion.div>
);

export default SectionHeading;
