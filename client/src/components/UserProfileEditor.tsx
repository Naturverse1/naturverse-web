import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "../lib/supabaseClient";

interface UserProfileEditorProps {
  className?: string;
}

export default function UserProfileEditor({ className }: UserProfileEditorProps) {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Get current user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw authError;
      }

      if (!authUser) {
        throw new Error("No authenticated user found");
      }

      setUser(authUser);

      // Get user profile from users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('name, avatar_url')
        .eq('id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Set current values
      setName(userProfile?.name || "");
      setAvatarUrl(userProfile?.avatar_url || "");
    } catch (err: any) {
      setError(err.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;

    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/public/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { 
        cacheControl: '3600',
        upsert: true 
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let newAvatarUrl = avatarUrl;

      // Upload new avatar if selected
      if (avatarFile) {
        setUploading(true);
        
        // Ensure avatars bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const avatarsBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
        
        if (!avatarsBucketExists) {
          const { error: createError } = await supabase.storage.createBucket('avatars', { 
            public: true 
          });
          if (createError && !createError.message.includes('already exists')) {
            throw createError;
          }
        }

        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl;
        }
        setUploading(false);
      }

      // Update users table
      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: name || null,
          avatar_url: newAvatarUrl,
          email: user.email,
          updated_at: new Date().toISOString(),
        });

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setAvatarUrl(newAvatarUrl || "");
      setAvatarFile(null);
      setAvatarPreview("");
      setSuccess("Profile updated successfully!");

    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature mx-auto mb-2"></div>
            <p className="text-forest">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl font-fredoka text-forest">
          🌟 Edit Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-nature/20 bg-nature/10">
            <AlertDescription className="text-forest">{success}</AlertDescription>
          </Alert>
        )}

        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarPreview || avatarUrl || undefined} />
            <AvatarFallback className="text-2xl bg-nature/10 text-forest">
              {name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-center space-y-2">
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer bg-turquoise hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              📷 Choose New Avatar
            </Label>
            <p className="text-sm text-forest/60 text-center">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-forest font-medium">
            Display Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-nature/20 focus:border-nature focus:ring-nature/20"
            data-testid="input-name"
          />
        </div>

        {/* Email (readonly) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-forest font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="bg-gray-50 border-nature/10"
            data-testid="input-email"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving || uploading}
          className="w-full bg-nature hover:bg-forest text-white transition-colors duration-200 py-3"
          data-testid="button-save"
        >
          {uploading 
            ? "📤 Uploading Avatar..." 
            : saving 
            ? "💾 Saving Profile..." 
            : "✨ Save Profile"
          }
        </Button>
      </CardContent>
    </Card>
  );
}