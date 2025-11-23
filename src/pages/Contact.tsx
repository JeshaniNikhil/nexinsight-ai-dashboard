import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

const Contact = () => {
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Thanks! We'll get back to you shortly.");
  };

  return (
    <div className="min-h-screen bg-animated-gradient">
      <header className="sticky top-0 w-full z-40 glass-card border-b border-primary/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-orbitron font-bold">Contact Us</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto glass-card p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="How can we help?" rows={5} required />
            </div>
            <Button variant="neon" type="submit" className="w-full">Send</Button>
            {status && (
              <p className="text-center text-success font-medium">{status}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Contact;
