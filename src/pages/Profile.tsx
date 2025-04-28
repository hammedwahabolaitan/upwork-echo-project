import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/utils/toastUtils";
import { getProfile, updateProfile, User } from "@/services/api";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProfileContent from "@/components/profile/ProfileContent";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    skills: "",
    hourlyRate: "",
  });

  const isOwnProfile = !id || (currentUser && id === currentUser.id.toString());
  const userId = id ? parseInt(id) : currentUser?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        const data = await getProfile(userId);
        
        const mappedData = {
          id: data.id,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email,
          accountType: data.account_type,
          bio: data.bio || "",
          skills: data.skills || "",
          hourlyRate: data.hourly_rate
        };
        
        setProfile(mappedData);
        setFormData({
          firstName: mappedData.firstName,
          lastName: mappedData.lastName,
          bio: mappedData.bio || "",
          skills: mappedData.skills || "",
          hourlyRate: mappedData.hourlyRate?.toString() || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast("Error loading profile", {
          description: "Failed to load profile"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !isOwnProfile) {
      toast("Access denied", {
        description: "You can only update your own profile"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        skills: formData.skills,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      });
      
      setProfile({
        ...profile!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        skills: formData.skills,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      });
      
      setIsEditing(false);
      
      toast("Profile updated", {
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("Error updating profile", {
        description: "Failed to update profile"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch(`${API_URL}/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      setProfile(prev => prev ? {
        ...prev,
        avatarUrl: data.avatarUrl
      } : null);
      
      toast("Profile updated", {
        description: "Your profile picture has been updated successfully"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast("Error updating profile picture", {
        description: "Failed to update profile picture"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upwork-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p>The profile you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader
            profile={profile}
            isOwnProfile={isOwnProfile}
            isEditing={isEditing}
            onEditClick={() => setIsEditing(!isEditing)}
          />
          
          {isEditing && (
            <ProfileEditForm
              formData={formData}
              profile={profile}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onImageUpload={handleImageUpload}
              onCancel={() => setIsEditing(false)}
            />
          )}
          
          <ProfileContent
            profile={profile}
            isOwnProfile={isOwnProfile}
            isEditing={isEditing}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
