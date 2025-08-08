import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const categories = [
  { id: "fruit", name: "🍎 Fruit", description: "Sweet and colorful fruit avatars" },
  { id: "animal", name: "🦁 Animal", description: "Wild and wonderful creatures" },
  { id: "spirit", name: "✨ Spirit", description: "Mystical and magical beings" },
  { id: "insect", name: "🦋 Insect", description: "Tiny but mighty creatures" },
];

export default function NavatarCreator() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateNavatar = async () => {
    if (!selectedCategory || !user) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Create navatar in Supabase avatars table
      const categoryData = categories.find(c => c.id === selectedCategory);
      const { data, error: insertError } = await supabase
        .from('avatars')
        .insert({
          user_id: user.id,
          name: `${categoryData?.name} Avatar`,
          category: selectedCategory,
          image_url: null, // Will be set when user uploads custom image
          appearance_data: {
            category: selectedCategory,
            emoji: categoryData?.name.split(' ')[0],
            createdAt: new Date().toISOString()
          }
        })
        .select()
        .single();
        
      if (insertError) {
        throw insertError;
      }
      
      setSuccess(`🎉 Your ${categoryData?.name.split(' ')[1]} navatar has been created successfully!`);
      setSelectedCategory(null);
      
    } catch (err: any) {
      setError(err.message || "Failed to create navatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            🎨 Navatar Creator
          </h1>
          <p className="text-white/90 text-lg">
            Create your magical nature avatar to represent you in The Naturverse!
          </p>
          
          {error && (
            <Alert variant="destructive" className="mt-4 max-w-md mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mt-4 max-w-md mx-auto border-nature/20 bg-nature/10">
              <AlertDescription className="text-forest">{success}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-nature bg-nature/10' 
                  : 'backdrop-blur-sm bg-white/95'
              }`}
              onClick={() => setSelectedCategory(category.id)}
              data-testid={`card-category-${category.id}`}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-fredoka text-forest">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-forest/80">{category.description}</p>
                {selectedCategory === category.id && (
                  <Badge className="mt-2 bg-nature text-white">Selected</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCategory && (
          <div className="text-center">
            <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-nature/20 to-turquoise/20 rounded-full flex items-center justify-center text-6xl mb-4">
                    {categories.find(c => c.id === selectedCategory)?.name.split(' ')[0]}
                  </div>
                  <p className="text-forest/80 mb-4">
                    Your {categories.find(c => c.id === selectedCategory)?.name.split(' ')[1]} navatar will be created!
                  </p>
                </div>
                
                <Button
                  onClick={handleCreateNavatar}
                  disabled={loading}
                  className="bg-nature hover:bg-forest text-white px-8 py-3"
                  data-testid="button-create-navatar"
                >
                  {loading ? "✨ Creating..." : "🎨 Create My Navatar"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}