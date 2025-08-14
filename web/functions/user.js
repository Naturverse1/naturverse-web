
import { createClient } from '@supabase/supabase-js';

export async function onRequestGet({ request, env, params, next, data }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  
  try {
    // Get JWT from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const jwt = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Get user from JWT
    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    
    if (error || !user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Return user info
    return new Response(JSON.stringify({ 
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata
      }
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
    
  } catch (error) {
    console.error('Error in user endpoint:', error);
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
}
