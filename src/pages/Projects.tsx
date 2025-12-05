import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { dummyProjectDetails } from "@/data/projects";
import { Sparkles, Search, Filter, Grid, List, ExternalLink } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Project {
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
}

const fallbackProjects: Project[] = dummyProjectDetails.map(
  ({ id, title, description, platform, budget_min, budget_max, skills_required, nex_score, win_probability, risk_level, project_url }) => ({
    id,
    title,
    description,
    platform,
    budget_min,
    budget_max,
    skills_required,
    nex_score,
    win_probability,
    risk_level,
    project_url
  })
);

const Projects = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

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
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(fallbackProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-success/10 text-success border-success/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-border/20";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "upwork": return "bg-primary/10 text-primary border-primary/20";
      case "freelancer": return "bg-accent/10 text-accent border-accent/20";
      case "fiverr": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/10 text-muted-foreground border-border/20";
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.skills_required?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-animated-gradient">
      {/* Header */}
      <header className="glass-card border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
              <h1 className="text-2xl font-orbitron font-bold text-neon">Browse Projects</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Search & Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search projects by title, description, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <div className="flex border border-primary/20 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <Badge className={getPlatformColor(project.platform)}>
                    {project.platform}
                  </Badge>
                  <Badge className={getRiskColor(project.risk_level)}>
                    {project.risk_level} risk
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-neon transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Budget */}
                <div className="mb-4">
                  <span className="text-sm text-muted-foreground">Budget: </span>
                  <span className="text-lg font-bold text-neon-aqua">
                    ${project.budget_min} - ${project.budget_max}
                  </span>
                </div>

                {/* NexScore */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">NexScore</span>
                    <div className="text-2xl font-bold text-neon">{project.nex_score}/100</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Win Probability</span>
                    <div className="text-2xl font-bold text-success">{project.win_probability}%</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills_required?.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {project.skills_required?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.skills_required.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm" onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/projects/${project.id}`);
                  }}>
                    View Details
                  </Button>
                  {project.project_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground mb-4">No projects found matching your criteria.</p>
            <Button onClick={() => setSearchQuery("")}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
