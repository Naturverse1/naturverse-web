
import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env, params, next, data }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  
  try {
    // Parse request body
    const body = await request.json();
    const { email, password, type } = body;

    if (!email || !password || !type) {
      return new Response(JSON.stringify({ 
        error: "Missing required fields: email, password, type" 
      }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    if (type !== 'signIn' && type !== 'signUp') {
      return new Response(JSON.stringify({ 
        error: "Invalid type. Must be 'signIn' or 'signUp'" 
      }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    let result;
    
    if (type === 'signUp') {
      // Sign up new user
      result = await supabase.auth.signUp({
        email,
        password,
      });
    } else {
      // Sign in existing user
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    }

    const { data, error } = result;

    if (error) {
      return new Response(JSON.stringify({ 
        error: error.message 
      }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Return successful authentication data
    return new Response(JSON.stringify({
      user: data.user,
      session: data.session,
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  } catch (error) {
    console.error('Error in auth endpoint:', error);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
