import { Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type UserProfile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditProfile: () => void;
  onAvatarChange: (file: File) => void;
}

export function ProfileHeader({ profile, onEditProfile, onAvatarChange }: ProfileHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <div className="relative w-24 h-24 mx-auto">
        <Avatar className="w-24 h-24 border-2 border-primary">
          <AvatarImage src={profile.avatar} alt={profile.username} />
          <AvatarFallback>{profile.username[0]}</AvatarFallback>
        </Avatar>
        <label 
          htmlFor="avatar-upload" 
          className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90"
        >
          <Camera className="w-4 h-4" />
          <input 
            id="avatar-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onAvatarChange(e.target.files[0])}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
        <p className="text-gray-600">{profile.bio || "No bio yet"}</p>
        <div className={`text-sm font-medium ${profile.level.color}`}>
          {profile.level.name}
        </div>
      </div>

      <div className="max-w-sm mx-auto space-y-2">
        <Progress 
          value={(profile.level.currentXp / profile.level.nextLevelXp) * 100} 
          className="h-2"
        />
        <div className="text-sm text-gray-600">
          {profile.level.currentXp.toLocaleString()} / {profile.level.nextLevelXp.toLocaleString()} XP
          to next level
        </div>
      </div>

      <Button variant="outline" className="gap-2" onClick={onEditProfile}>
        <Settings className="w-4 h-4" /> Edit Profile
      </Button>
    </div>
  );
}
