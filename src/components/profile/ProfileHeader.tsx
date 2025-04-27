
import { User } from "@/services/api";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  profile: User;
  isOwnProfile: boolean;
  isEditing: boolean;
  onEditClick: () => void;
}

const ProfileHeader = ({ profile, isOwnProfile, isEditing, onEditClick }: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
            {profile.firstName?.charAt(0) || "?"}{profile.lastName?.charAt(0) || "?"}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                {profile.firstName || ""} {profile.lastName || ""}
              </h1>
              <p className="text-gray-600 mt-1 capitalize">
                {profile.accountType || ""} {profile.accountType === 'freelancer' && profile.hourlyRate && `• $${profile.hourlyRate}/hr`}
              </p>
            </div>
            
            {isOwnProfile && (
              <Button
                variant="outline"
                onClick={onEditClick}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            )}
          </div>
          
          {profile.bio && !isEditing && (
            <div className="mt-4">
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}
          
          {profile.skills && !isEditing && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {profile.skills.split(",").map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
