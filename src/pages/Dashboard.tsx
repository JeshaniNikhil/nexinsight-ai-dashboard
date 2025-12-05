import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingUp, Target, Zap, ArrowRight, Sparkles } from "lucide-react";
import { LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { toast } from "sonner";
import type { User, Session } from "@supabase/supabase-js";

interface DashboardAgentConfig {
  id: string;
  agent_name: string;
  webhook_url: string;
  is_active: boolean;
}

interface WebhookBid {
  id: string;
  title: string;
  platform?: string;
  url: string;
  budget?: string;
  score?: number;
  summary?: string;
  proposal?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [activeAgent, setActiveAgent] = useState<DashboardAgentConfig | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    website: "",
    focus: "",
    differentiator: "",
  });
  const [isSubmittingCompany, setIsSubmittingCompany] = useState(false);
  const [insightSummary, setInsightSummary] = useState<string>("");
  const [insightHighlights, setInsightHighlights] = useState<string[]>([]);
  const [insightMetrics, setInsightMetrics] = useState<{ label: string; value: string }[]>([]);
  const [bids, setBids] = useState<WebhookBid[]>([]);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [proposalLoadingId, setProposalLoadingId] = useState<string | null>(null);
  const [insightsGeneratedAt, setInsightsGeneratedAt] = useState<string | null>(null);

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

  useEffect(() => {
    if (!user) {
      setActiveAgent(null);
      return;
    }

    const loadActiveAgent = async () => {
      setAgentLoading(true);
      try {
        const { data, error } = await supabase
          .from("agent_configs")
          .select("id, agent_name, webhook_url, is_active")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) throw error;

        setActiveAgent(data && data.length > 0 ? (data[0] as DashboardAgentConfig) : null);
      } catch (loadError) {
        console.error("Error loading active agent:", loadError);
        toast.error("Unable to load active n8n webhook. Please try again.");
        setActiveAgent(null);
      } finally {
        setAgentLoading(false);
      }
    };

    loadActiveAgent();
  }, [user]);

  useEffect(() => {
    if (selectedBidId && !bids.some((bid) => bid.id === selectedBidId)) {
      setSelectedBidId(null);
    }
  }, [bids, selectedBidId]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCompanySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!companyDetails.name.trim() || !companyDetails.focus.trim()) {
      toast.error("Please provide your company name and primary focus.");
      return;
    }

    if (!activeAgent?.webhook_url) {
      toast.error("No active n8n webhook found. Connect your automation first.");
      return;
    }

    setIsSubmittingCompany(true);
    setInsightSummary("");
    setInsightHighlights([]);
    setInsightMetrics([]);
    setBids([]);
    setSelectedBidId(null);
    setInsightsGeneratedAt(null);

    try {
      const payload = {
        action: "generate_insights",
        company: {
          name: companyDetails.name,
          website: companyDetails.website,
          focus: companyDetails.focus,
          differentiator: companyDetails.differentiator,
        },
        user: {
          id: user?.id,
          email: user?.email,
        },
      };

      const response = await fetch(activeAgent.webhook_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      const rawText = await response.text();
      let parsedResponse: any = {};
      try {
        parsedResponse = rawText ? JSON.parse(rawText) : {};
      } catch (parseError) {
        throw new Error("Received invalid JSON from n8n webhook.");
      }

      const result = parsedResponse?.data ?? parsedResponse;
      const insightsSource = result?.insights ?? result?.ai_insights ?? result?.project?.ai_insights ?? null;

      let summary = "";
      let highlights: string[] = [];
      let metrics: { label: string; value: string }[] = [];

      if (insightsSource) {
        if (typeof insightsSource === "string") {
          summary = insightsSource;
        } else if (Array.isArray(insightsSource)) {
          highlights = insightsSource.map((item) => (typeof item === "string" ? item : JSON.stringify(item)));
        } else if (typeof insightsSource === "object") {
          if (typeof insightsSource.summary === "string") {
            summary = insightsSource.summary;
          }

          if (Array.isArray(insightsSource.highlights)) {
            highlights = insightsSource.highlights.map((item: unknown) => String(item));
          }

          if (Array.isArray(insightsSource.metrics)) {
            metrics = insightsSource.metrics.map((metric: any, index: number) => ({
              label: String(metric?.label ?? metric?.name ?? metric?.title ?? `Metric ${index + 1}`),
              value: String(metric?.value ?? metric?.score ?? metric?.amount ?? metric?.percentage ?? "-"),
            }));
          } else if (insightsSource.metrics && typeof insightsSource.metrics === "object") {
            metrics = Object.entries(insightsSource.metrics).map(([label, value]) => ({
              label,
              value: String(value),
            }));
          }

          if (!summary && insightsSource.overview) {
            summary = String(insightsSource.overview);
          }
        }
      }

      setInsightSummary(summary);
      setInsightHighlights(highlights);
      setInsightMetrics(metrics);

      const bidsSource = result?.top_bids ?? result?.topBids ?? result?.bids ?? result?.opportunities ?? [];
      if (Array.isArray(bidsSource)) {
        const normalizedBids: WebhookBid[] = bidsSource.map((bid: any, index: number) => {
          const url: string = String(bid?.url ?? bid?.link ?? bid?.project_url ?? bid?.href ?? "");
          const platform = bid?.platform ?? bid?.source ?? (url.includes("upwork") ? "Upwork" : url.includes("fiverr") ? "Fiverr" : undefined);
          let budget: string | undefined;
          if (typeof bid?.budget === "string") {
            budget = bid.budget;
          } else if (bid?.budget_min && bid?.budget_max) {
            budget = `$${bid.budget_min} - $${bid.budget_max}`;
          } else if (bid?.price_range) {
            budget = String(bid.price_range);
          }

          const scoreValue = bid?.score ?? bid?.nex_score ?? bid?.win_probability;

          return {
            id: String(bid?.id ?? bid?.bid_id ?? `bid-${index + 1}`),
            title: String(bid?.title ?? bid?.name ?? `Opportunity ${index + 1}`),
            platform,
            url,
            budget,
            score: typeof scoreValue === "number" ? scoreValue : Number(scoreValue) || undefined,
            summary: typeof bid?.summary === "string" ? bid.summary : bid?.description ?? bid?.brief ?? "",
            proposal: bid?.proposal ?? bid?.proposal_output ?? bid?.proposal_agent_output ?? bid?.generated_proposal ?? "",
          };
        });

        setBids(normalizedBids);
      } else {
        setBids([]);
      }

      setInsightsGeneratedAt(new Date().toISOString());
      toast.success("Insights generated from your n8n workflow.");
    } catch (error) {
      console.error("Error fetching automation insights:", error);
      toast.error(error instanceof Error ? error.message : "Failed to contact the n8n webhook.");
    } finally {
      setIsSubmittingCompany(false);
    }
  };

  const handleBidSelect = async (bid: WebhookBid) => {
    setSelectedBidId((prev) => (prev === bid.id ? prev : bid.id));

    if (bid.proposal) {
      return;
    }

    if (!activeAgent?.webhook_url) {
      toast.error("No active n8n webhook found. Connect your automation first.");
      return;
    }

    setProposalLoadingId(bid.id);
    try {
      const payload = {
        action: "generate_proposal",
        bid,
        user: {
          id: user?.id,
          email: user?.email,
        },
      };

      const response = await fetch(activeAgent.webhook_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      const rawText = await response.text();
      let parsedResponse: any = {};
      try {
        parsedResponse = rawText ? JSON.parse(rawText) : {};
      } catch (parseError) {
        throw new Error("Received invalid JSON from proposal agent.");
      }

      const result = parsedResponse?.data ?? parsedResponse;
      const proposalText = result?.proposal ?? result?.proposal_output ?? result?.generated_proposal ?? result?.content ?? "";

      if (proposalText) {
        setBids((prev) =>
          prev.map((existingBid) =>
            existingBid.id === bid.id ? { ...existingBid, proposal: proposalText } : existingBid,
          ),
        );
        toast.success("Proposal agent response ready.");
      } else {
        toast.error("Proposal agent did not return any content.");
      }
    } catch (error) {
      console.error("Error generating proposal:", error);
      toast.error(error instanceof Error ? error.message : "Failed to contact the proposal agent.");
    } finally {
      setProposalLoadingId(null);
    }
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
            <h1 className="text-2xl font-orbitron font-bold text-neon">Nexinsight AI</h1>
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

        {/* Company Intake & Automation */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 xl:col-span-2">
            <h3 className="text-xl font-orbitron font-semibold text-neon mb-2">Tell us about your company</h3>
            <p className="text-sm text-muted-foreground">
              Share a bit about your company and services. We&apos;ll send this information to your connected n8n workflow
              to tailor insights and bidding recommendations automatically.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleCompanySubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    placeholder="Acme Studios"
                    value={companyDetails.name}
                    onChange={(event) => setCompanyDetails((prev) => ({ ...prev, name: event.target.value }))}
                    className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="company-website">Website</Label>
                  <Input
                    id="company-website"
                    placeholder="https://example.com"
                    value={companyDetails.website}
                    onChange={(event) => setCompanyDetails((prev) => ({ ...prev, website: event.target.value }))}
                    className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-focus">Primary Service Focus</Label>
                <Input
                  id="company-focus"
                  placeholder="e.g. AI-powered web applications"
                  value={companyDetails.focus}
                  onChange={(event) => setCompanyDetails((prev) => ({ ...prev, focus: event.target.value }))}
                  className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="company-differentiator">What makes you different?</Label>
                <Textarea
                  id="company-differentiator"
                  placeholder="Share your strengths, past wins, or delivery approach..."
                  value={companyDetails.differentiator}
                  onChange={(event) => setCompanyDetails((prev) => ({ ...prev, differentiator: event.target.value }))}
                  rows={5}
                  className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={isSubmittingCompany || agentLoading}>
                {isSubmittingCompany ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background mr-2"></div>
                    Sending to n8n...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Insights
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xl font-orbitron font-semibold">Automation Status</h3>
            {agentLoading ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                Checking your n8n configuration...
              </div>
            ) : activeAgent ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-success text-sm">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  Active webhook connected
                </div>
                <div className="text-xs text-muted-foreground break-all border border-primary/10 rounded-md p-2 bg-background/40">
                  {activeAgent.webhook_url}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No active n8n webhook found for your account. Configure your automation to enable bid insights.
              </div>
            )}

            {insightsGeneratedAt && (
              <div className="text-xs text-muted-foreground">
                Last synced: {new Date(insightsGeneratedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Insights Display */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-xl font-orbitron font-semibold">Automation Insights</h3>
            {insightsGeneratedAt && (
              <span className="text-xs text-muted-foreground">Updated {new Date(insightsGeneratedAt).toLocaleTimeString()}</span>
            )}
          </div>

          {insightSummary || insightHighlights.length > 0 || insightMetrics.length > 0 ? (
            <div className="space-y-6">
              {insightSummary && (
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {insightSummary}
                </p>
              )}

              {insightMetrics.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neon uppercase tracking-wide mb-2">Key Metrics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {insightMetrics.map((metric, index) => (
                      <div key={`${metric.label}-${index}`} className="cyber-border">
                        <div className="cyber-border-inner p-4">
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">{metric.label}</div>
                          <div className="text-2xl font-bold text-neon mt-1">{metric.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {insightHighlights.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neon uppercase tracking-wide mb-2">Highlights</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {insightHighlights.map((highlight, index) => (
                      <li key={`${highlight}-${index}`} className="flex items-start gap-2">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Provide your company information to generate tailored insights and recommendations.
            </div>
          )}
        </div>

        {/* Top Bids Display */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-xl font-orbitron font-semibold mb-4">Top Bids from n8n</h3>
          {bids.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {bids.map((bid) => (
                  <div key={bid.id} className="cyber-border">
                    <div className="cyber-border-inner p-4 space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground uppercase tracking-wide">{bid.platform ?? "Opportunity"}</div>
                        <h4 className="text-lg font-semibold text-neon mt-1">{bid.title}</h4>
                      </div>
                      {bid.summary && <p className="text-sm text-muted-foreground line-clamp-3">{bid.summary}</p>}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {bid.score !== undefined && <span>Score: {Math.round(bid.score)}</span>}
                        {bid.budget && <span>{bid.budget}</span>}
                      </div>
                      <Button
                        variant={selectedBidId === bid.id ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleBidSelect(bid)}
                        disabled={proposalLoadingId === bid.id}
                      >
                        {proposalLoadingId === bid.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background mr-2"></div>
                            Generating proposal...
                          </>
                        ) : selectedBidId === bid.id ? (
                          "Viewing proposal"
                        ) : (
                          "View proposal"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Once your automation returns bid opportunities, they will appear here with direct links and proposal drafts.
            </div>
          )}
        </div>

        {selectedBidId && (
          (() => {
            const selectedBid = bids.find((bid) => bid.id === selectedBidId);
            if (!selectedBid) {
              return null;
            }

            return (
              <div className="glass-card p-6 mb-8">
                <h3 className="text-xl font-orbitron font-semibold mb-4">Bid Details &amp; Proposal Agent Output</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">{selectedBid.platform ?? "Opportunity"}</div>
                    <h4 className="text-2xl font-semibold text-neon mt-1">{selectedBid.title}</h4>
                  </div>

                  {selectedBid.summary && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedBid.summary}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {selectedBid.score !== undefined && <span>Score: {Math.round(selectedBid.score)}</span>}
                    {selectedBid.budget && <span>Budget: {selectedBid.budget}</span>}
                    {selectedBid.url ? (
                      <a
                        href={selectedBid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Open opportunity
                      </a>
                    ) : (
                      <span>No external link provided</span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-neon mb-2">Proposal Agent Output</h4>
                    {proposalLoadingId === selectedBid.id ? (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                        Waiting for agent response...
                      </div>
                    ) : selectedBid.proposal ? (
                      <div className="bg-background/30 border border-primary/20 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                          {selectedBid.proposal}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Click on "View proposal" to request a tailored proposal from your agent.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()
        )}

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
              <button 
                className="cyber-border hover:scale-105 transition-all group"
                onClick={() => navigate("/projects")}
              >
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

              <button 
                className="cyber-border hover:scale-105 transition-all group"
                onClick={() => navigate("/proposal-generator")}
              >
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

              <button 
                className="cyber-border hover:scale-105 transition-all group"
                onClick={() => navigate("/analytics")}
              >
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
