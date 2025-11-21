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
    console.log('Received bid status update:', body);

    const { proposal_id, status, user_id } = body;
    
    if (!proposal_id || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: proposal_id, status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update proposal status
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .update({
        status,
        submitted_at: status === 'submitted' ? new Date().toISOString() : undefined
      })
      .eq('id', proposal_id)
      .select()
      .single();

    if (proposalError) {
      console.error('Error updating proposal:', proposalError);
      throw proposalError;
    }

    // Update analytics if bid was won or lost
    if (user_id && (status === 'won' || status === 'lost')) {
      const { data: analytics, error: analyticsError } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (!analyticsError && analytics) {
        const newWins = status === 'won' ? (analytics.total_wins || 0) + 1 : analytics.total_wins;
        const newLosses = status === 'lost' ? (analytics.total_losses || 0) + 1 : analytics.total_losses;
        const totalProposals = (analytics.total_proposals || 0);
        const winRatio = totalProposals > 0 ? (newWins / totalProposals) * 100 : 0;

        await supabase
          .from('analytics')
          .update({
            total_wins: newWins,
            total_losses: newLosses,
            win_ratio: winRatio
          })
          .eq('user_id', user_id);
      }
    }

    console.log('Bid status updated:', proposalData);

    return new Response(
      JSON.stringify({
        success: true,
        proposal: proposalData,
        message: 'Bid status updated successfully'
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
