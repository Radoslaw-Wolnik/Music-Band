import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { BadRequestError, InternalServerError } from './errors';

const BASE_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

type AllowedFileType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/svg+xml';

type UploadType = 'users' | 'posts' | 'events' | 'band-members' | 'merch';

interface UploadConfig {
  type: UploadType;
  subDirectory?: string;
  allowedTypes?: AllowedFileType[];
  maxSize?: number; // in bytes
  resize?: { width: number; height: number };
}

const uploadConfigs: Record<UploadType, UploadConfig> = {
  users: {
    type: 'users',
    subDirectory: 'profile',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    resize: { width: 400, height: 400 },
  },
  posts: {
    type: 'posts',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 10 * 1024 * 1024, // 10MB
    resize: { width: 1200, height: 1200 },
  },
  events: {
    type: 'events',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 10 * 1024 * 1024, // 10MB
    resize: { width: 1200, height: 1200 },
  },
  'band-members': {
    type: 'band-members',
    subDirectory: 'page',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 8 * 1024 * 1024, // 8MB
    resize: { width: 800, height: 800 },
  },
  merch: {
    type: 'merch',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 8 * 1024 * 1024, // 8MB
    resize: { width: 800, height: 800 },
  },
};

export async function uploadFile(
  file: File,
  uploadType: UploadType,
  id: string | number
): Promise<string> {
  const config = uploadConfigs[uploadType];

  if (!file) {
    throw new BadRequestError('No file provided');
  }

  if (!config.allowedTypes?.includes(file.type as AllowedFileType)) {
    throw new BadRequestError('Invalid file type');
  }

  if (file.size > config.maxSize!) {
    throw new BadRequestError(`File size exceeds the limit of ${config.maxSize! / (1024 * 1024)}MB`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
  
  const uploadDir = path.join(BASE_UPLOAD_DIR, config.type, id.toString(), config.subDirectory || '');
  const filePath = path.join(uploadDir, uniqueFilename);

  try {
    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    if (file.type === 'image/svg+xml') {
      await writeFile(filePath, buffer);
    } else if (file.type.startsWith('image/')) {
      await sharp(buffer)
        .resize(config.resize!.width, config.resize!.height, { fit: 'inside', withoutEnlargement: true })
        .toFile(filePath);
    } else {
      await writeFile(filePath, buffer);
    }

    return `/uploads/${config.type}/${id}${config.subDirectory ? `/${config.subDirectory}` : ''}/${uniqueFilename}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new InternalServerError('Error uploading file');
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const filePath = path.join(process.cwd(), 'public', fileUrl);
  try {
    await unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new InternalServerError('Error deleting file');
  }
}