import React from 'react';
import { BlogPost } from '@/types';
import Card from '@/components/common/Card';

interface ContentDisplayProps {
  post: BlogPost;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ post }) => {
  return (
    <Card className="p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-4">
        <span>By {post.user.username} | </span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </Card>
  );
};

export default ContentDisplay;