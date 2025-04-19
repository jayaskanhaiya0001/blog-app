import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Blog from '../../../../lib/models/Blog';
import { withAdminAuth } from '../../../../lib/utils/auth';
import { validateBlogInput } from '../../../../lib/utils/validation';

export default withAdminAuth(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const blogs = await Blog.find().populate('author', 'username');
            return res.status(200).json(blogs);
        } catch (error) {
            console.error(error , 'ERROR');
            return res.status(500).json({ message: 'Server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { errors, isValid } = validateBlogInput(req.body);
            if (!isValid) {
                return res.status(400).json(errors);
            }

            const { title, content, tags } = req.body;
            // @ts-ignore (we know userId exists because of withAdminAuth)
            const author = req.userId;

            const blog = new Blog({
                title,
                content,
                tags,
                author
            });

            await blog.save();
            return res.status(201).json(blog);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
});