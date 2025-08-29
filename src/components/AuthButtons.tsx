import { useState } from "react";
import { sendMagicLink } from '@/lib/auth';
import { signInWithGoogle } from '@/lib/supabase-client';
import { useSupabase } from '@/lib/useSupabase';

type Props = {
  cta?: string;           // e.g., "Create account"
  variant?: "solid"|"outline";
  size?: "lg"|"md"|"sm";
  className?: string;
};

export default function AuthButtons({ cta = "Create account", variant="solid", size="lg", className="" }: Props) {
  const supabase = useSupabase();
  const [loading, setLoading] = useState<"ml"|"google"|"">("");

  const signInWithMagicLink = async () => {
    const email = window.prompt("Enter your email to receive a sign-in link")?.trim();
    if (!email) return;
    if (!supabase) {
      alert('Sign-in is unavailable in this preview. Please use production.');
      return;
    }
    setLoading("ml");
    sessionStorage.setItem("post-auth-redirect", window.location.pathname + window.location.search);
    const { error } = await sendMagicLink(email);
    setLoading("");
    if (error) alert(error.message);
    else alert("Check your inbox for the sign-in link ✉️");
  };

  const signInGoogle = async () => {
    if (!supabase) {
      alert('Sign-in is unavailable in this preview. Please use production.');
      return;
    }
    setLoading("google");
    sessionStorage.setItem("post-auth-redirect", window.location.pathname + window.location.search);
    await signInWithGoogle();
    setLoading("");
  };

  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition shadow-sm";
  const sizes = {
    lg: "h-12 px-5 text-base",
    md: "h-10 px-4 text-sm",
    sm: "h-9  px-3 text-sm",
  }[size];
  const variants = {
    solid:  "bg-[#2455FF] text-white hover:brightness-110",
    outline:"border border-[#2455FF]/30 text-[#2455FF] hover:bg-[#2455FF]/5",
  }[variant];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <button onClick={signInWithMagicLink}
        className={`${base} ${sizes} ${variants}`} disabled={!!loading}>
        {loading==="ml" ? "Sending…" : cta}
      </button>
      <button onClick={signInGoogle}
        className={`${base} ${sizes} bg-white text-[#2455FF] border border-[#2455FF]/30 hover:bg-[#2455FF]/5`}
        disabled={!!loading}>
        {loading==="google" ? "Opening…" : "Continue with Google"}
      </button>
    </div>
  );
}
