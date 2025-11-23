import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import nikImage from "@/assets/profile-nik.jpeg";

const members = [
  { name: "Nikhil Jesani", role: "CEO", initials: "NJ", img: nikImage },
  { name: "Alex P.", role: "CTO", initials: "AP", img: "https://i.pravatar.cc/160?u=alex.p" },
  { name: "Sam R.", role: "CMO", initials: "SR", img: "https://i.pravatar.cc/160?u=sam.r" },
  { name: "Jordan Lee", role: "COO", initials: "JL", img: "https://i.pravatar.cc/160?u=jordan.lee" },
  { name: "Morgan Chen", role: "CFO", initials: "MC", img: "https://i.pravatar.cc/160?u=morgan.chen" },
];

const Team = () => {
  return (
    <div className="min-h-screen bg-animated-gradient">
      <header className="sticky top-0 w-full z-40 glass-card border-b border-primary/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-orbitron font-bold">Our Team</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <section className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {members.map((m) => (
              <div key={m.name} className="glass-card p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={m.img} alt={m.name} />
                    <AvatarFallback className="font-orbitron">{m.initials}</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-xl font-orbitron font-semibold">{m.name}</h3>
                <p className="text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Team;
