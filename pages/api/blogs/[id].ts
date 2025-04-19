import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Blog from '../../../lib/models/Blog';
import { withAuth } from '../../../lib/utils/auth';

export default withAuth(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  try {
    const blog = await Blog.findById(req.query.id).populate('author', 'username');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});