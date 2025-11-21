import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Zap, Bot, Activity } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

interface AgentConfig {
  id: string;
  agent_name: string;
  webhook_url: string;
  is_active: boolean;
  config: any;
}

const Agents = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");

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

  useEffect(() => {
    if (user) {
      fetchAgents();
    }
  }, [user]);

  const fetchAgents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("agent_configs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAgent = async (agentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("agent_configs")
        .update({ is_active: !currentStatus })
        .eq("id", agentId);

      if (error) throw error;
      
      toast.success(!currentStatus ? "Agent activated" : "Agent deactivated");
      fetchAgents();
    } catch (error) {
      console.error("Error toggling agent:", error);
      toast.error("Failed to update agent status");
    }
  };

  const handleAddWebhook = async () => {
    if (!user || !newWebhookUrl.trim()) {
      toast.error("Please enter a webhook URL");
      return;
    }

    try {
      const { error } = await supabase.from("agent_configs").insert({
        user_id: user.id,
        agent_name: "n8n Auto-Bid Agent",
        webhook_url: newWebhookUrl,
        is_active: false,
        config: {}
      });

      if (error) throw error;
      
      toast.success("Webhook added successfully!");
      setNewWebhookUrl("");
      fetchAgents();
    } catch (error) {
      console.error("Error adding webhook:", error);
      toast.error("Failed to add webhook");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-animated-gradient">
      {/* Header */}
      <header className="glass-card border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8 text-primary animate-pulse-glow" />
              <h1 className="text-2xl font-orbitron font-bold text-neon">AI Agents</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Add Webhook Section */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-orbitron font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            Connect n8n Webhook
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your n8n workflow to enable automated bidding and real-time project synchronization.
          </p>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="webhook">Webhook URL</Label>
              <Input
                id="webhook"
                placeholder="https://your-n8n-instance.com/webhook/..."
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddWebhook}>
                <Zap className="w-4 h-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </div>
        </div>

        {/* Agents List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : agents.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-4">No agents configured yet.</p>
              <p className="text-sm text-muted-foreground">Add your first webhook above to get started.</p>
            </div>
          ) : (
            agents.map((agent) => (
              <div key={agent.id} className="glass-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{agent.agent_name}</h3>
                      {agent.is_active && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                          <span className="text-xs text-success">Active</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Webhook: <code className="bg-background/50 px-2 py-1 rounded">{agent.webhook_url}</code>
                    </p>
                    
                    {/* Agent Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="cyber-border">
                        <div className="cyber-border-inner p-3 text-center">
                          <div className="text-2xl font-bold text-neon">0</div>
                          <div className="text-xs text-muted-foreground">Bids Sent</div>
                        </div>
                      </div>
                      <div className="cyber-border">
                        <div className="cyber-border-inner p-3 text-center">
                          <div className="text-2xl font-bold text-success">0</div>
                          <div className="text-xs text-muted-foreground">Projects Won</div>
                        </div>
                      </div>
                      <div className="cyber-border">
                        <div className="cyber-border-inner p-3 text-center">
                          <div className="text-2xl font-bold text-accent">0%</div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`agent-${agent.id}`}>Enable</Label>
                      <Switch
                        id={`agent-${agent.id}`}
                        checked={agent.is_active}
                        onCheckedChange={() => handleToggleAgent(agent.id, agent.is_active)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Activity className="w-4 h-4 mr-2" />
                      View Logs
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Agents;
