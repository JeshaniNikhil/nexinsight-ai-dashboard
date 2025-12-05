import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { dummyProjectDetails, type ProjectDetail } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, ExternalLink, MapPin, Calendar, Target } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low":
      return "bg-success/10 text-success border-success/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted/10 text-muted-foreground border-border/20";
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "upwork":
      return "bg-primary/10 text-primary border-primary/20";
    case "freelancer":
      return "bg-accent/10 text-accent border-accent/20";
    case "fiverr":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-muted/10 text-muted-foreground border-border/20";
  }
};

type ProjectRow = Partial<ProjectDetail> & {
  id: string;
  title: string;
  description: string;
  platform: string;
  budget_min: number;
  budget_max: number;
  skills_required: string[];
  nex_score: number;
  win_probability: number;
  risk_level: string;
  project_url: string;
  posted_at?: string | null;
  client_location?: string | null;
  client_history?: string | null;
  deliverables?: string[] | null;
  requirements?: string[] | null;
};

const normaliseProject = (project: ProjectRow): ProjectDetail => ({
  id: project.id,
  title: project.title,
  description: project.description,
  platform: project.platform,
  budget_min: project.budget_min,
  budget_max: project.budget_max,
  skills_required: project.skills_required ?? [],
  nex_score: project.nex_score,
  win_probability: project.win_probability,
  risk_level: project.risk_level,
  project_url: project.project_url,
  posted_at: project.posted_at ?? new Date().toISOString(),
  client_location: project.client_location ?? undefined,
  client_history: project.client_history ?? undefined,
  deliverables: project.deliverables ?? undefined,
  requirements: project.requirements ?? undefined,
});

const formatDate = (isoDate: string) => {
  try {
    return new Date(isoDate).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch (error) {
    console.error("Error formatting date", error);
    return isoDate;
  }
};

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectDetail | null>(null);

  const fallbackProject = useMemo(
    () => dummyProjectDetails.find((p) => p.id === projectId) ?? null,
    [projectId]
  );

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
    if (!user || !projectId) return;

    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProject(normaliseProject(data as ProjectRow));
        } else if (fallbackProject) {
          setProject(fallbackProject);
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error("Error fetching project detail:", err);
        setProject(fallbackProject ?? null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [fallbackProject, projectId, user]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-animated-gradient flex flex-col items-center justify-center gap-6 text-center px-6">
        <h1 className="text-3xl font-orbitron text-neon">Project not found</h1>
        <p className="text-muted-foreground max-w-md">
          We couldn't locate the project you're looking for. It may have been removed or is unavailable right now.
        </p>
        <Button variant="outline" onClick={() => navigate("/projects")}>Back to Browse</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animated-gradient">
      <header className="glass-card border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
            <h1 className="text-2xl font-orbitron font-bold text-neon">Project Detail</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/projects")}>Back to Browse</Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="glass-card p-8 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={getPlatformColor(project.platform)}>{project.platform}</Badge>
                <Badge className={getRiskColor(project.risk_level)}>{project.risk_level} risk</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 text-foreground">
                {project.title}
              </h2>
              <p className="text-muted-foreground max-w-3xl leading-relaxed">{project.description}</p>
            </div>
            <div className="flex flex-col gap-2 min-w-[220px]">
              <div className="text-sm text-muted-foreground">Budget</div>
              <div className="text-2xl font-bold text-neon-aqua">
                ${project.budget_min} - ${project.budget_max}
              </div>
              <div className="text-sm text-muted-foreground">Win Probability</div>
              <div className="text-xl font-semibold text-success">{project.win_probability}%</div>
              <div className="text-sm text-muted-foreground">NexScore</div>
              <div className="text-xl font-semibold text-neon">{project.nex_score}/100</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Posted {formatDate(project.posted_at)}</span>
              </div>
              {project.client_location && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{project.client_location}</span>
                </div>
              )}
              {project.client_history && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>{project.client_history}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.skills_required.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs uppercase tracking-wide">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {project.requirements && project.requirements.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                {project.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>
          )}

          {project.deliverables && project.deliverables.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Deliverables</h3>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                {project.deliverables.map((deliverable) => (
                  <li key={deliverable}>{deliverable}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => navigate("/projects")}
              className="sm:min-w-[160px]">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Browse
            </Button>
            {project.project_url && (
              <Button className="sm:min-w-[160px]" asChild>
                <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                  View Original Listing <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
