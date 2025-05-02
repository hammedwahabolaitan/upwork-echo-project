import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile, updateProfile, User } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/upwork/Layout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import { toast } from "@/utils/toastUtils";
import { useNotifications } from "@/contexts/NotificationContext";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    skills: "",
    hourlyRate: ""
  });
  
  // Determine if this is the current user's profile
  const isOwnProfile = !id || (currentUser && id === currentUser.id.toString());
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // If no ID is specified, fetch the current user's profile
        const userId = id || (currentUser?.id.toString() || '');
        
        if (!userId) {
          navigate("/login");
          return;
        }
        
        const userData = await getProfile(userId);
        setProfile(userData);
        
        // Initialize form data
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          bio: userData.bio || "",
          skills: userData.skills || "",
          hourlyRate: userData.hourlyRate ? userData.hourlyRate.toString() : ""
        });
        
        // Demonstrate notification (in real app, this would be triggered by backend events)
        if (isOwnProfile && userData.accountType === 'freelancer' && Math.random() > 0.5) {
          setTimeout(() => {
            addNotification({
              message: "A client viewed your profile",
              type: "system",
              link: "/profile"
            });
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast("Error fetching profile", {
          description: "Failed to load profile information"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, currentUser, navigate, isOwnProfile, addNotification]);
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = async (file: File) => {
    // In a real app, this would upload the file to a server
    // For this example, we just update the UI locally
    if (profile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => prev ? { 
          ...prev, 
          avatarUrl: e.target?.result as string 
        } : null);
      };
      reader.readAsDataURL(file);
      
      toast("Image uploaded", {
        description: "Profile picture updated successfully"
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setIsLoading(true);
    
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        skills: formData.skills,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined
      });
      
      // Update local profile state
      setProfile(prev => prev ? {
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        skills: formData.skills,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined
      } : null);
      
      setIsEditing(false);
      
      toast("Profile updated", {
        description: "Your profile has been updated successfully"
      });
      
      // Add a notification
      addNotification({
        message: "Your profile was updated successfully",
        type: "system",
        link: "/profile"
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("Error updating profile", {
        description: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !profile) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upwork-green"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-700">Profile not found</h1>
            <p className="mt-2 text-gray-600">The requested profile could not be found.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <ProfileHeader 
          profile={profile}
          isOwnProfile={isOwnProfile}
          isEditing={isEditing}
          onEditClick={() => setIsEditing(!isEditing)}
        />
        
        {isEditing ? (
          <ProfileEditForm
            formData={formData}
            profile={profile}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            onImageUpload={handleImageUpload}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileContent 
            profile={profile}
            isOwnProfile={isOwnProfile}
            isEditing={isEditing}
          />
        )}
      </div>
    </Layout>
  );
};

export default Profile;
