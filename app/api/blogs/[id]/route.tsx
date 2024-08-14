// pages/api/blogs/[id].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req:any, res:any) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Fetch a single blog by ID
    try {
      const post = await prisma.blog.findUnique({
        where: { id },
        include: {
          sections: true,
        },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  } 
}
