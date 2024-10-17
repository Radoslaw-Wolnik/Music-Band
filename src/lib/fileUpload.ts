import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { BadRequestError } from './errors';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export type UploadResult = {
  filePath: string;
  fileUrl: string;
};

export async function uploadFile(file: Express.Multer.File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']): Promise<UploadResult> {
  if (!file) {
    throw new BadRequestError('No file provided');
  }

  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestError('Invalid file type');
  }

  const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
  const filePath = path.join(UPLOAD_DIR, uniqueFilename);

  try {
    if (file.mimetype.startsWith('image/')) {
      await sharp(file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .toFile(filePath);
    } else {
      await writeFile(filePath, file.buffer);
    }

    const fileUrl = `/uploads/${uniqueFilename}`;
    return { filePath, fileUrl };
  } catch (error) {
    throw new BadRequestError('Error uploading file');
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const filePath = path.join(process.cwd(), 'public', fileUrl);
  try {
    await unlink(filePath);
  } catch (error) {
    throw new BadRequestError('Error deleting file');
  }
}