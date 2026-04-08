import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import LandingFooter from "@/components/landing/LandingFooter";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-4"
            >
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                Contact Us
              </h1>
              <p className="font-body text-muted-foreground mt-3 text-base">
                Get in touch with us. We'd love to hear from you.
              </p>
            </motion.div>

            <div className="border-t border-border my-10" />

            <div className="grid md:grid-cols-3 gap-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Phone className="h-7 w-7 text-yellow-600" />
                </div>
                <div>
                  <a
                    href="tel:+15551234567"
                    className="font-body text-sm text-foreground hover:text-yellow-600 transition-colors"
                  >
                    Tel: 1 (555) 123-4567
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-yellow-600" />
                </div>
                <div className="font-body text-sm text-foreground leading-relaxed">
                  <p>Keeper Headquarters</p>
                  <p>Provo, UT 84064</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Mail className="h-7 w-7 text-yellow-600" />
                </div>
                <div>
                  <a
                    href="mailto:info@keeper.org"
                    className="font-body text-sm text-foreground hover:text-yellow-600 transition-colors"
                  >
                    Send us an email
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="border-t border-border mt-10" />
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
