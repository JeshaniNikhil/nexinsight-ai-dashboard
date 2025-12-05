import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Zap, Target, TrendingUp, Shield, Sparkles, ArrowRight, BarChart3 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import nikImage from "@/assets/profile-nik.jpeg";
import khushiImage from "@/assets/profile-khushi.png";
import priyaImage from "@/assets/profile-priyanshi.jpeg";
import aakarshImage from "@/assets/profile-aakarsh.jpeg";
import kavyaImage from "@/assets/profile-kavya.jpeg";
import gauravImage from "@/assets/profile-gaurav.png";
const Landing = () => {
  return (
    <div className="min-h-screen bg-animated-gradient overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-card border-b border-primary/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
            <h1 className="text-2xl font-orbitron font-bold text-neon">Nexinsight AI</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="/#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="/#demo" className="text-foreground hover:text-primary transition-colors">Demo</a>
            <a href="/#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="/#team" className="text-foreground hover:text-primary transition-colors">Team</a>
            <a href="/#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </nav>
          <Link to="/auth">
            <Button variant="neon" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="px-4 py-2 rounded-full glass-card text-sm text-accent font-semibold">
                  🚀 AI-Powered Intelligence
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-orbitron font-bold leading-tight">
                <span className="text-neon">Smarter</span> Project<br />
                Decisions & Higher<br />
                <span className="text-neon-aqua">Win Ratios</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Nexinsight AI analyzes freelancing projects with advanced AI to predict profitability, 
                assess risks, and maximize your success rate. Win more. Work smarter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button variant="neon" size="xl" className="w-full sm:w-auto group">
                    Start Free Trial
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/proposal-generator">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    Watch Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon">89%</div>
                  <div className="text-sm text-muted-foreground">Avg Win Rate</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-aqua">3.2x</div>
                  <div className="text-sm text-muted-foreground">ROI Boost</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">12k+</div>
                  <div className="text-sm text-muted-foreground">Projects Analyzed</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="cyber-border animate-pulse-glow">
                <div className="cyber-border-inner p-4">
                  <img 
                    src={heroBanner} 
                    alt="Nexinsight AI Dashboard"
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              Agentic Ai <span className="text-neon">Intelligence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered features that give you the competitive edge in the freelancing marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "AI Win Prediction",
                description: "Advanced algorithms analyze project history, client behavior, and competition to predict your success probability.",
                color: "primary"
              },
              {
                icon: TrendingUp,
                title: "NexScore Analysis",
                description: "Proprietary scoring system evaluates profitability, effort, and risk for every project opportunity.",
                color: "accent"
              },
              {
                icon: Shield,
                title: "Risk Detection",
                description: "Real-time assessment of payment risks, scope creep, and client reliability with instant alerts.",
                color: "success"
              },
              {
                icon: BarChart3,
                title: "Portfolio Insights",
                description: "Track your win rates, revenue trends, and skill demand with beautiful neon-styled analytics.",
                color: "primary"
              },
              {
                icon: Zap,
                title: "Auto-Bid Agent",
                description: "AI agent submits optimized proposals automatically based on your criteria and availability.",
                color: "accent"
              },
              {
                icon: Sparkles,
                title: "Smart Proposals",
                description: "Generate winning proposals with AI that adapts to client tone, project requirements, and your voice.",
                color: "success"
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="glass-card p-8 hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:shadow-glow-purple transition-all`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-orbitron font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              Choose Your <span className="text-neon-aqua">Power Level</span>
            </h2>
            <p className="text-xl text-muted-foreground">Transparent pricing with no hidden costs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Pay as You Go",
                priceText: "Pay only for usage",
                features: ["$0 base fee", "$0.50 per analysis", "No commitment", "Cancel anytime"],
                popular: false
              },
              {
                name: "Freelancer",
                price: "29",
                features: ["100 Project Analyses/mo", "Basic Win Prediction", "Email Support", "Portfolio Analytics"],
                popular: false
              },
              {
                name: "Pro",
                price: "79",
                features: ["Unlimited Analyses", "Advanced AI Insights", "Auto-Bid Agent", "Priority Support", "Custom Proposals"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "199",
                features: ["Team Collaboration", "API Access", "White-label Options", "Dedicated Manager", "Custom Integrations"],
                popular: false
              }
            ].map((plan, idx) => (
              <div 
                key={idx}
                className={`glass-card p-8 ${plan.popular ? 'cyber-border scale-105' : ''} hover:scale-105 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="cyber-border-inner p-8">
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                    <h3 className="text-2xl font-orbitron font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      {"priceText" in plan && plan.priceText ? (
                        <span className="text-3xl font-bold text-neon">{plan.priceText}</span>
                      ) : (
                        <>
                          <span className="text-5xl font-bold text-neon">${plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <Sparkles className="w-4 h-4 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="neon" className="w-full" size="lg">
                      Get Started
                    </Button>
                  </div>
                )}
                {!plan.popular && (
                  <>
                    <div className="mb-4 h-6"></div>
                    <h3 className="text-2xl font-orbitron font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      {"priceText" in plan && plan.priceText ? (
                        <span className="text-3xl font-bold">{plan.priceText}</span>
                      ) : (
                        <>
                          <span className="text-5xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <Sparkles className="w-4 h-4 text-accent mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full" size="lg">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              About <span className="text-neon">Nexinsight AI</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We help freelancers and agencies make smarter project decisions with AI-driven insights. Analyze opportunities, assess risks, and maximize win rates.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Accuracy", desc: "Proprietary scoring models tuned for service marketplaces." },
              { title: "Speed", desc: "Evaluate opportunities in seconds, not hours." },
              { title: "Trust", desc: "Transparent metrics for confident decisions." },
            ].map((item, i) => (
              <div key={i} className="glass-card p-8">
                <h3 className="font-orbitron font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              Meet the <span className="text-neon-aqua">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground">Builders passionate about AI and outcomes.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Nikhil Jesani", role: "CEO", initials: "NJ", img: nikImage },
              { name: "Priya Sharma", role: "CTO", initials: "PS", img: priyaImage },
              { name: "Khushi Pathak", role: "CMO", initials: "KP", img: khushiImage },
              { name: "Aakarsh Raj Singh", role: "COO", initials: "AR", img: aakarshImage },
              { name: "Kavya Sharma", role: "CFO", initials: "KS", img: kavyaImage },
              { name: "Gaurav Chopra", role: "CISO", initials: "GC", img: gauravImage },
            ].map((m) => (
              <div key={m.name} className="glass-card p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-40 w-40 md:h-48 md:w-48">
                    <AvatarImage className="object-contain" src={m.img} alt={m.name} />
                    <AvatarFallback className="font-orbitron">{m.initials}</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-xl font-orbitron font-semibold">{m.name}</h3>
                <p className="text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              Contact <span className="text-neon">Us</span>
            </h2>
            <p className="text-lg text-muted-foreground">Have questions? Send us a message.</p>
          </div>
          <div className="max-w-2xl mx-auto glass-card p-8">
            <form className="space-y-6">
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
              <Button variant="neon" className="w-full" type="submit">Send</Button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="cyber-border max-w-4xl mx-auto">
            <div className="cyber-border-inner p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
                Ready to <span className="text-neon">Dominate</span> Your Market?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of freelancers using AI to win more projects and increase revenue
              </p>
              <Link to="/auth">
                <Button variant="neon" size="xl" className="group">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-orbitron font-bold text-lg">Nexinsight AI</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="/#about" className="hover:text-primary transition-colors">About</a>
              <a href="/#team" className="hover:text-primary transition-colors">Team</a>
              <a href="/#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground">
            &copy; 2025 Nexinsight AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
