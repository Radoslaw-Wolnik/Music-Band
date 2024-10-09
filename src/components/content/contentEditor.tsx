import React from 'react';
import dynamic from 'next/dynamic';
import { BlogPost } from '@/types';
import Form from '@/components/common/Form';
import ImageUpload from '@/components/common/ImageUpload';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface ContentEditorProps {
  initialContent?: BlogPost;
  onSave: (content: Partial<BlogPost>) => Promise<void>;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ initialContent, onSave }) => {
  const [content, setContent] = React.useState(initialContent?.content || '');

  const fields = [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter post title' },
    { 
      name: 'accessTier', 
      label: 'Access Tier', 
      type: 'select',
      options: [
        { value: 'FREE', label: 'Free' },
        { value: 'BASIC', label: 'Basic' },
        { value: 'PREMIUM', label: 'Premium' },
      ]
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    await onSave({
      ...data,
      content,
    });
  };

  const handleImageUpload = (files: File[]) => {
    // Implement image upload logic here
    console.log('Uploaded files:', files);
  };

  return (
    <div className="space-y-6">
      <Form fields={fields} onSubmit={handleSubmit} submitLabel="Save Post" />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <ReactQuill value={content} onChange={setContent} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
        <ImageUpload onUpload={handleImageUpload} multiple />
      </div>
    </div>
  );
};

export default ContentEditor;