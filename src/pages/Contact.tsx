import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const Contact = () => (
  <div className="py-16">
    <div className="container max-w-4xl">
      <SectionHeading title="Contact Us" subtitle="Get in touch with YUMP" icon={Phone} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Address</h3>
                <p className="text-muted-foreground">
                  Jangal Mangal Maidan Parsav
                  <br />
                  Village Persav,
                  <br />
                  Maharashtra, India
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 card-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Phone</h3>
                <p className="text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 card-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-muted-foreground">yump.persav@gmail.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden card-shadow h-80 md:h-auto min-h-[320px]"
        >
          {/* <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.0!2d73.8!3d18.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMwJzAwLjAiTiA3M8KwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="YUMP Location"
          /> */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d790.9095465664875!2d72.78264637779532!3d19.44603445290473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7aa35060042af%3A0xf3feecb8a77acb33!2sJangal%20Mangal%20Maidan%20Parsav!5e0!3m2!1sen!2sin!4v1775804761500!5m2!1sen!2sin"
            width="600"
            height="450"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </div>
  </div>
);

export default Contact;
