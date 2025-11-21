import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Copy, Download, Send } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const ProposalGenerator = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerate = async () => {
    if (!projectDescription.trim()) {
      toast.error("Please enter a project description");
      return;
    }

    setIsGenerating(true);
    try {
      // Mock AI generation - replace with actual edge function call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockProposal = `Dear Hiring Manager,

I am writing to express my strong interest in your project. With extensive experience in the field, I am confident that I can deliver exceptional results that exceed your expectations.

Project Understanding:
${projectDescription}

My Approach:
I will tackle this project with a systematic methodology, ensuring clear communication, timely delivery, and high-quality output. My expertise aligns perfectly with your requirements.

Why Choose Me:
- Proven track record of successful projects
- Strong technical skills and attention to detail
- Clear and consistent communication
- Commitment to meeting deadlines
- 100% client satisfaction guaranteed

I look forward to the opportunity to work with you on this exciting project. Please feel free to review my portfolio and reach out with any questions.

Best regards`;

      setGeneratedProposal(mockProposal);
      toast.success("Proposal generated successfully!");
    } catch (error) {
      console.error("Error generating proposal:", error);
      toast.error("Failed to generate proposal");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    toast.success("Proposal copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([generatedProposal], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proposal.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Proposal downloaded!");
  };

  const handleSave = async () => {
    if (!user || !generatedProposal) return;
    
    try {
      const { error } = await supabase.from("proposals").insert({
        user_id: user.id,
        content: generatedProposal,
        tone,
        status: "draft"
      });

      if (error) throw error;
      toast.success("Proposal saved to drafts!");
    } catch (error) {
      console.error("Error saving proposal:", error);
      toast.error("Failed to save proposal");
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
              <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
              <h1 className="text-2xl font-orbitron font-bold text-neon">AI Proposal Generator</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-orbitron font-semibold mb-6 text-neon">Project Details</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Paste the project description here..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={10}
                  className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="length">Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger id="length" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Proposal
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-orbitron font-semibold mb-6 text-neon">Generated Proposal</h2>
            
            {generatedProposal ? (
              <div className="space-y-4">
                <div className="bg-background/30 border border-primary/20 rounded-lg p-6 max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                    {generatedProposal}
                  </pre>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Send className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Your AI-generated proposal will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;
