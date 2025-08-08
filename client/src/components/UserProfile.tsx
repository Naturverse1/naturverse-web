import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface UserData {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      // Get current authenticated user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        setError("No authenticated user found");
        return;
      }

      setUser(authData.user);

      // Fetch user data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, avatar_url')
        .eq('id', authData.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      // If user doesn't exist in users table, create with default values
      if (!userData) {
        const newUserData = {
          id: authData.user.id,
          username: null,
          avatar_url: null
        };

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert([newUserData])
          .select('id, username, avatar_url')
          .single();

        if (createError) {
          throw createError;
        }

        setUserData(createdUser);
        setUsername(createdUser.username || "");
        setAvatarUrl(createdUser.avatar_url || "");
      } else {
        setUserData(userData);
        setUsername(userData.username || "");
        setAvatarUrl(userData.avatar_url || "");
      }

    } catch (err: any) {
      setError(err.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData) return;

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: username.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setUserData({
        ...userData,
        username: username.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });

      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-gray-600">Loading user profile...</div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-red-600">Please log in to view your profile</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* User Email (readonly) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email || ""}
            disabled
            className="bg-gray-50"
            data-testid="input-email"
          />
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="input-username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              type="url"
              placeholder="Enter your avatar URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              data-testid="input-avatar-url"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updating}
            data-testid="button-update-user"
          >
            {updating ? "Updating..." : "Update Profile"}
          </Button>
        </form>

        {/* Current User Data */}
        {userData && (
          <div className="pt-4 border-t space-y-2">
            <h3 className="font-semibold text-sm text-gray-600">Current Data:</h3>
            <div className="text-sm space-y-1">
              <div><strong>ID:</strong> {userData.id}</div>
              <div><strong>Username:</strong> {userData.username || "Not set"}</div>
              <div><strong>Avatar URL:</strong> {userData.avatar_url || "Not set"}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}