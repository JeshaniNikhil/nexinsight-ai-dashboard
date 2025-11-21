import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Mail, Lock, User as UserIcon } from "lucide-react";
import aiBrain from "@/assets/ai-brain.jpg";
import type { User, Session } from "@supabase/supabase-js";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to NexInsight AI",
        });
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-animated-gradient">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-3 justify-center mb-8">
              <Sparkles className="w-10 h-10 text-primary animate-pulse-glow" />
              <h1 className="text-3xl font-orbitron font-bold text-neon">NexInsight AI</h1>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-orbitron font-bold">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Enter your credentials to access your dashboard" 
                  : "Sign up to start winning more projects"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-cyber pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-cyber pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-cyber pl-10"
                    required
                  />
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="neon"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative">
        <div className="relative max-w-lg">
          <div className="cyber-border animate-pulse-glow">
            <div className="cyber-border-inner p-6">
              <img 
                src={aiBrain} 
                alt="AI Intelligence" 
                className="rounded-lg w-full"
              />
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          
          {/* Floating Stats */}
          <div className="absolute top-10 -left-20 glass-card p-4 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="text-2xl font-bold text-neon">89%</div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
          
          <div className="absolute bottom-10 -right-20 glass-card p-4 animate-float" style={{ animationDelay: '1.5s' }}>
            <div className="text-2xl font-bold text-neon-aqua">3.2x</div>
            <div className="text-xs text-muted-foreground">ROI Boost</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
