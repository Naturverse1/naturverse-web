import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

interface Stamp {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  category: string;
}

export default function Quests() {
  const { user } = useAuth();
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStamps();
  }, []);

  const loadStamps = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setError("");
      
      // Load stamps from Supabase
      const { data: stampsData, error: stampsError } = await supabase
        .from('stamps')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (stampsError) {
        throw stampsError;
      }
      
      // Transform Supabase data to match our interface
      const transformedStamps: Stamp[] = stampsData?.map(stamp => ({
        id: stamp.id,
        name: stamp.name,
        description: stamp.description,
        earned: stamp.earned || false,
        category: stamp.category || "general"
      })) || [];
      
      // If no stamps exist, create default ones
      if (transformedStamps.length === 0) {
        const defaultStamps = [
          { name: "🌱 First Steps", description: "Complete your first lesson", category: "learning" },
          { name: "🦋 Nature Observer", description: "Identify 5 different animals", category: "exploration" },
          { name: "🎨 Creative Spirit", description: "Create your first navatar", category: "creativity" },
          { name: "🧠 Quiz Master", description: "Score 100% on any quiz", category: "knowledge" },
          { name: "🌍 World Explorer", description: "Visit all zones in Thailandia", category: "exploration" },
          { name: "🎵 Music Maker", description: "Compose your first melody", category: "creativity" },
        ];
        
        // Insert default stamps
        const { data: insertedStamps, error: insertError } = await supabase
          .from('stamps')
          .insert(defaultStamps.map(stamp => ({
            ...stamp,
            user_id: user.id,
            earned: false
          })))
          .select();
          
        if (insertError) {
          console.warn('Could not create default stamps:', insertError);
          // Use mock data as fallback
          setStamps([
            { id: "1", name: "🌱 First Steps", description: "Complete your first lesson", earned: false, category: "learning" },
            { id: "2", name: "🦋 Nature Observer", description: "Identify 5 different animals", earned: false, category: "exploration" },
            { id: "3", name: "🎨 Creative Spirit", description: "Create your first navatar", earned: false, category: "creativity" },
            { id: "4", name: "🧠 Quiz Master", description: "Score 100% on any quiz", earned: false, category: "knowledge" },
            { id: "5", name: "🌍 World Explorer", description: "Visit all zones in Thailandia", earned: false, category: "exploration" },
            { id: "6", name: "🎵 Music Maker", description: "Compose your first melody", earned: false, category: "creativity" },
          ]);
        } else {
          setStamps(insertedStamps?.map(stamp => ({
            id: stamp.id,
            name: stamp.name,
            description: stamp.description,
            earned: stamp.earned || false,
            category: stamp.category || "general"
          })) || []);
        }
      } else {
        setStamps(transformedStamps);
      }
      
    } catch (err: any) {
      setError(err.message || "Failed to load stamps");
      console.error('Error loading stamps:', err);
      
      // Fallback to mock data
      setStamps([
        { id: "1", name: "🌱 First Steps", description: "Complete your first lesson", earned: false, category: "learning" },
        { id: "2", name: "🦋 Nature Observer", description: "Identify 5 different animals", earned: false, category: "exploration" },
        { id: "3", name: "🎨 Creative Spirit", description: "Create your first navatar", earned: false, category: "creativity" },
        { id: "4", name: "🧠 Quiz Master", description: "Score 100% on any quiz", earned: false, category: "knowledge" },
        { id: "5", name: "🌍 World Explorer", description: "Visit all zones in Thailandia", earned: false, category: "exploration" },
        { id: "6", name: "🎵 Music Maker", description: "Compose your first melody", earned: false, category: "creativity" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const earnedStamps = stamps.filter(s => s.earned);
  const totalStamps = stamps.length;
  const progress = (earnedStamps.length / totalStamps) * 100;

  if (loading) {
    return (
      <div className="min-h-screen magic-gradient py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your quests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            🏆 Quest & Stamp Tracker
          </h1>
          <p className="text-white/90 text-lg mb-6">
            Complete quests and collect stamps to show your achievements!
          </p>
          
          <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-fredoka text-forest mb-2">
                  {earnedStamps.length} / {totalStamps} Stamps Collected
                </div>
                <Progress value={progress} className="w-full max-w-md mx-auto h-3 mb-2" />
                <p className="text-forest/70">{Math.round(progress)}% Complete</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stamps.map((stamp) => (
            <Card 
              key={stamp.id}
              className={`transition-all duration-200 hover:scale-105 ${
                stamp.earned 
                  ? 'backdrop-blur-sm bg-nature/10 border-nature/30 shadow-lg' 
                  : 'backdrop-blur-sm bg-white/95 border-gray-200'
              }`}
              data-testid={`card-stamp-${stamp.id}`}
            >
              <CardHeader className="text-center pb-4">
                <div className={`text-4xl mb-2 ${stamp.earned ? 'animate-bounce-gentle' : 'opacity-50'}`}>
                  {stamp.name.split(' ')[0]}
                </div>
                <CardTitle className={`text-lg font-fredoka ${stamp.earned ? 'text-nature' : 'text-forest/50'}`}>
                  {stamp.name.split(' ').slice(1).join(' ')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className={`text-sm mb-3 ${stamp.earned ? 'text-forest' : 'text-forest/50'}`}>
                  {stamp.description}
                </p>
                <Badge 
                  variant={stamp.earned ? "default" : "secondary"}
                  className={stamp.earned ? 'bg-nature text-white' : ''}
                >
                  {stamp.earned ? '✅ Earned' : '⏳ Locked'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}