import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Comment } from '@/lib/models/Comment';
import { withAuth } from '@/lib/utils/auth';
import { validateComment } from '@/lib/utils/validation';

export default withAuth(async function handler(
  req: any,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      // Validate input
      const { errors, isValid } = validateComment(req.body);
      if (!isValid) {
        return res.status(400).json({ errors });
      }

      const { content, blogId } = req.body;

      // Create new comment
      const comment = new Comment({
        content,
        blog: blogId,
        author: req.userId // From auth middleware
      });

      await comment.save();
      
      // Populate author details
      await comment.populate('author', 'username avatar');

      // Update blog's comment count
    //   await mongoose.model('Blog').findByIdAndUpdate(blogId, {
    //     $inc: { commentCount: 1 }
    //   });

      return res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
});