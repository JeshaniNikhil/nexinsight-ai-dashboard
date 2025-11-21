import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    console.log('Received webhook data:', body);

    // Validate required fields
    const { title, description, platform, budget_min, budget_max, skills_required } = body;
    
    if (!title || !platform) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, platform' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate NexScore and win probability (mock calculation)
    const nex_score = Math.floor(Math.random() * 30) + 70; // 70-100
    const win_probability = Math.floor(Math.random() * 40) + 60; // 60-100
    const risk_level = nex_score >= 85 ? 'low' : nex_score >= 70 ? 'medium' : 'high';

    // Insert project into database
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        platform,
        budget_min: budget_min || 0,
        budget_max: budget_max || 0,
        skills_required: skills_required || [],
        nex_score,
        win_probability,
        risk_level,
        client_rating: body.client_rating || null,
        client_history: body.client_history || null,
        project_url: body.project_url || null,
        ai_insights: body.ai_insights || {},
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Project created:', data);

    return new Response(
      JSON.stringify({
        success: true,
        project: data,
        message: 'Project synchronized successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
