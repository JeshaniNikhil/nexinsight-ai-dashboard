import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Target, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { User } from "@supabase/supabase-js";

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Mock data
  const performanceData = [
    { month: 'Jan', proposals: 12, wins: 8, revenue: 4500 },
    { month: 'Feb', proposals: 15, wins: 10, revenue: 6200 },
    { month: 'Mar', proposals: 18, wins: 14, revenue: 8100 },
    { month: 'Apr', proposals: 22, wins: 16, revenue: 9800 },
    { month: 'May', proposals: 25, wins: 19, revenue: 12400 },
    { month: 'Jun', proposals: 28, wins: 22, revenue: 15600 },
  ];

  const platformData = [
    { name: 'Upwork', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Freelancer', value: 30, color: 'hsl(var(--accent))' },
    { name: 'Fiverr', value: 25, color: 'hsl(var(--success))' },
  ];

  const skillsData = [
    { skill: 'React', projects: 15 },
    { skill: 'Node.js', projects: 12 },
    { skill: 'Python', projects: 10 },
    { skill: 'UI/UX', projects: 8 },
    { skill: 'Mobile', projects: 6 },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-animated-gradient">
      {/* Header */}
      <header className="glass-card border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-primary animate-pulse-glow" />
              <h1 className="text-2xl font-orbitron font-bold text-neon">Analytics</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-primary" />
              <span className="text-sm text-success">+15%</span>
            </div>
            <div className="text-3xl font-bold text-neon mb-1">120</div>
            <div className="text-sm text-muted-foreground">Total Proposals</div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-success" />
              <span className="text-sm text-success">+22%</span>
            </div>
            <div className="text-3xl font-bold text-success mb-1">89</div>
            <div className="text-sm text-muted-foreground">Projects Won</div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-accent" />
              <span className="text-sm text-success">+8%</span>
            </div>
            <div className="text-3xl font-bold text-accent mb-1">74%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-neon-aqua" />
              <span className="text-sm text-success">+35%</span>
            </div>
            <div className="text-3xl font-bold text-neon-aqua mb-1">$56k</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trend */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-orbitron font-semibold mb-6">Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <defs>
                  <linearGradient id="proposalsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="winsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="proposals"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  name="Proposals"
                />
                <Line
                  type="monotone"
                  dataKey="wins"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--success))', r: 5 }}
                  name="Wins"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-orbitron font-semibold mb-6">Platform Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-orbitron font-semibold mb-6">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <defs>
                  <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
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
                <Bar dataKey="revenue" fill="url(#revenueBarGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Skills */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-orbitron font-semibold mb-6">Top Skills by Projects</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="skill" type="category" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="projects" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
