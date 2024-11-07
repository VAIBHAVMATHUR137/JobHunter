import express, { Request, Response, NextFunction } from 'express';
import cloudinary from "../cloudinaryConfig"
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post(
  '/upload-pdf',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
      }

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw',
      });

      // Return the URL of the uploaded PDF
      res.json({ url: result.secure_url });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload PDF', error });
      next(error); 
    }
  }
);

export default router;
