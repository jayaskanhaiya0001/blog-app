import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Comment } from '@/lib/models/Comment';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { blogId } = req.query;
  console.log('API endpoint hit', req.url, req.method, req.query);
  if (req.method === 'GET') {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const comments = await Comment.find({ blog: blogId })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Comment.countDocuments({ blog: blogId });

      return res.status(200).json({
        data: comments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}