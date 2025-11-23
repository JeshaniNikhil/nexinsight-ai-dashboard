import { Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-animated-gradient">
      <header className="sticky top-0 w-full z-40 glass-card border-b border-primary/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-orbitron font-bold">About NexInsight AI</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="glass-card p-8">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground text-lg">
              NexInsight AI helps freelancers and agencies make smarter project decisions with AI-driven insights. We analyze opportunities, estimate profitability, and reduce risk so you can focus on winning and delivering great work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Accuracy", desc: "Proprietary scoring models tuned for marketplaces and service work." },
              { title: "Speed", desc: "Evaluate opportunities in seconds, not hours." },
              { title: "Trust", desc: "Transparent metrics, no black boxes for critical decisions." },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="font-orbitron font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
