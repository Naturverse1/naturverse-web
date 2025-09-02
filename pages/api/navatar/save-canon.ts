import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId, name, imageUrl } = req.body || {};
    if (!userId || !imageUrl) return res.status(400).json({ error: "Missing fields" });

    const { data, error } = await supabaseBrowser
      .from("avatars")
      .insert({ user_id: userId, name: name || null, image_url: imageUrl, method: "canon" })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
}
