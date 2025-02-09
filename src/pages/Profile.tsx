import { useState, useEffect } from "react";
import PageContainer from "@/components/ui/page-container";
import { ProfileHeader } from "@/components/profile/profile-header";
import { StatsOverview } from "@/components/profile/stats-overview";
import { BadgeGallery } from "@/components/profile/badge-gallery";
import { ActivityFeed } from "@/components/profile/activity-feed";
import { type UserProfile } from "@/types/profile";
import defaultAvatar from "@/assets/default.png";

const mockProfile: UserProfile = {
  id: "1",
  username: "demo_user",
  avatar: defaultAvatar,
  bio: "This is a demo profile",
  level: {
    name: "Level 1",
    color: "#FF0000",
    currentXp: 100,
    nextLevelXp: 200
  },
  stats: {
    totalXp: 100,
    lessonsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    portfolioValue: 0,
    portfolioGrowth: 0
  },
  badges: [
    { 
      id: "1", 
      name: "Early Adopter", 
      icon: "🎉",
      description: "One of the first users to join",
      earned: true,
      earnedAt: new Date().toISOString()
    }
  ],
  achievements: [
    { 
      id: "1", 
      title: "First Login", 
      description: "Welcome to Investiverse!", 
      icon: "🚀",
      earnedAt: new Date().toISOString(),
      featured: false
    }
  ],
  friends: {
    count: 0,
    following: 0,
    followers: 0
  },
  settings: {
    notifications: {
      achievements: true,
      friendRequests: true,
      dailyQuests: true
    },
    privacy: {
      showPortfolio: true,
      showAchievements: true,
      showFriends: true
    }
  }
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: Replace with actual API call when ready
        // For now, simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setProfile(mockProfile);

        // When API is ready, uncomment this:
        // const response = await fetch('/api/profile');
        // if (!response.ok) throw new Error('Failed to fetch profile');
        // const data = await response.json();
        // setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="p-4">Loading...</div>;
  }

  const handleEditProfile = () => {
    setIsEditing(true);
    // If you have a modal component:
    // setIsEditModalOpen(true);
    
    // Or if you prefer navigation:
    // router.push('/profile/edit');
  };

  const handleAvatarChange = async (file: File) => {
    try {
      // Create a FormData instance
      const formData = new FormData();
      formData.append('avatar', file);

      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/profile/avatar', {
      //   method: 'POST',
      //   body: formData
      // });

      // For now, just preview the image locally
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => prev ? {
        ...prev,
        avatar: imageUrl
      } : null);

      // Show success message
      console.log('Avatar updated successfully');
    } catch (err) {
      console.error('Failed to update avatar:', err);
      // Handle error appropriately
    }
  };

  return (
    <PageContainer className="space-y-6">
      <ProfileHeader
        profile={profile}
        onEditProfile={handleEditProfile}
        onAvatarChange={handleAvatarChange}
      />
      <StatsOverview profile={profile} />
      <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Badges</h2>
        <BadgeGallery badges={profile.badges} />
      </div>
      <ActivityFeed achievements={profile.achievements} />
    </PageContainer>
  );
};

export default Profile;
