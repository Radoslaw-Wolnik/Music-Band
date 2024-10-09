import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Form from '@/components/common/Form';

interface UserProfileProps {
  user: User;
  isOwnProfile: boolean;
  onUpdateProfile?: (updatedData: Partial<User>) => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isOwnProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSubmit = async (data: Record<string, any>) => {
    if (onUpdateProfile) {
      await onUpdateProfile(data);
    }
    setIsEditing(false);
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter username' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden mr-4">
          <Image
            src={user.profilePicture || '/default-avatar.png'}
            alt={user.username}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
          <p className="text-gray-600">Member since {new Date(user.createdAt).getFullYear()}</p>
          <p className="text-gray-600 capitalize">{user.role.toLowerCase()}</p>
        </div>
      </div>
      {isOwnProfile && (
        <div className="mb-4">
          {isEditing ? (
            <Form
              fields={fields}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
            />
          ) : (
            <Button onClick={handleEdit}>Edit Profile</Button>
          )}
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Stats</h3>
        <p>Posts: {user._count.posts}</p>
        <p>Friends: {user._count.friends}</p>
      </div>
    </Card>
  );
};

export default UserProfile;