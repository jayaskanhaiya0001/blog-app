import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import connectDB from '../db';
import User from '../models/User';
import { getServerSession } from 'next-auth';
import Nextauth from '@/pages/api/auth/[...nextauth]';
export const signToken = (userId: string) => {
  // @ts-ignore
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const withAuth = (handler: Function) => async (
  req: any,
  res: NextApiResponse
) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    await connectDB();
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.userId = decoded.userId;
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const withAdminAuth = (handler: Function) => async (
  req: any,
  res: NextApiResponse
) => {
 
  let token = req.headers.authorization?.split(' ')[1];

  if (!token && req.cookies) {
    token = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];
  }
  await connectDB();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    // console.log("Ddecode token operstion",decoded);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.userId = decoded.userId;
    return handler(req, res);
  } catch (error) {
    console.log('ERROR', error)
    return res.status(401).json({ message: 'Invalid token' });
  }
};