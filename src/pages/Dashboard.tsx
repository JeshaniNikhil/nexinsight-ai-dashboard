import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Target, Zap, ArrowRight, Sparkles } from "lucide-react";
import { LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { User, Session } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Mock data for charts
  const winRateData = [
    { month: 'Jan', rate: 65 },
    { month: 'Feb', rate: 72 },
    { month: 'Mar', rate: 78 },
    { month: 'Apr', rate: 82 },
    { month: 'May', rate: 85 },
    { month: 'Jun', rate: 89 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 26000 },
    { month: 'Jun', revenue: 31000 },
  ];

  const riskData = [
    { risk: 'Low', value: 65, fill: 'hsl(var(--success))' },
    { risk: 'Medium', value: 25, fill: 'hsl(var(--warning))' },
    { risk: 'High', value: 10, fill: 'hsl(var(--destructive))' },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-animated-gradient">
      {/* Top Navigation */}
      <header className="glass-card border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
            <h1 className="text-2xl font-orbitron font-bold text-neon">NexInsight AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-2">
            Welcome back, <span className="text-neon">Commander</span>
          </h2>
          <p className="text-muted-foreground">Your AI intelligence dashboard is ready</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:shadow-glow-purple transition-all">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-success">+12%</span>
            </div>
            <div className="text-3xl font-bold text-neon mb-1">89%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>

          <div className="glass-card p-6 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:shadow-glow-aqua transition-all">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <span className="text-sm text-success">+24%</span>
            </div>
            <div className="text-3xl font-bold text-neon-aqua mb-1">$31k</div>
            <div className="text-sm text-muted-foreground">Monthly Revenue</div>
          </div>

          <div className="glass-card p-6 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center group-hover:shadow-glow-green transition-all">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <span className="text-sm text-success">+8%</span>
            </div>
            <div className="text-3xl font-bold text-success mb-1">156</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </div>

          <div className="glass-card p-6 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:shadow-glow-purple transition-all">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-accent">Live</span>
            </div>
            <div className="text-3xl font-bold mb-1">94</div>
            <div className="text-sm text-muted-foreground">NexScore Avg</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Win Rate Chart */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-orbitron font-semibold">Win Rate Trend</h3>
              <span className="text-sm text-success">+24% this month</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={winRateData}>
                <defs>
                  <linearGradient id="winRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: 'var(--glow-purple)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-orbitron font-semibold">Revenue Growth</h3>
              <span className="text-sm text-accent">$31,000 total</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Distribution */}
          <div className="glass-card p-6 lg:col-span-1">
            <h3 className="text-xl font-orbitron font-semibold mb-6">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart 
                innerRadius="30%" 
                outerRadius="100%" 
                data={riskData} 
                startAngle={180} 
                endAngle={0}
              >
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                <RadialBar 
                  background 
                  dataKey="value" 
                  cornerRadius={10}
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {riskData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span>{item.risk} Risk</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6 lg:col-span-2">
            <h3 className="text-xl font-orbitron font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="cyber-border hover:scale-105 transition-all group">
                <div className="cyber-border-inner p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:shadow-glow-purple transition-all">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Browse Projects</div>
                    <div className="text-sm text-muted-foreground">Find new opportunities</div>
                  </div>
                  <ArrowRight className="ml-auto text-primary" />
                </div>
              </button>

              <button className="cyber-border hover:scale-105 transition-all group">
                <div className="cyber-border-inner p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:shadow-glow-aqua transition-all">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Generate Proposal</div>
                    <div className="text-sm text-muted-foreground">AI-powered writing</div>
                  </div>
                  <ArrowRight className="ml-auto text-accent" />
                </div>
              </button>

              <button className="cyber-border hover:scale-105 transition-all group">
                <div className="cyber-border-inner p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center group-hover:shadow-glow-green transition-all">
                    <Zap className="w-6 h-6 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Auto-Bid Agent</div>
                    <div className="text-sm text-muted-foreground">Enable automation</div>
                  </div>
                  <ArrowRight className="ml-auto text-success" />
                </div>
              </button>

              <button className="cyber-border hover:scale-105 transition-all group">
                <div className="cyber-border-inner p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:shadow-glow-purple transition-all">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">View Analytics</div>
                    <div className="text-sm text-muted-foreground">Detailed insights</div>
                  </div>
                  <ArrowRight className="ml-auto text-primary" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
