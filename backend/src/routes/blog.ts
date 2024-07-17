import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Jwt } from 'hono/utils/jwt'
import { createBlogSchema } from '@bhavyajaiswal/common';
import { updateBlogSchema } from '@bhavyajaiswal/common';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
    JWT_SECRET: string
    },
    Variables: {
        userId: number
    }
}>();

//middleware to check if user is authenticated
blogRouter.use('/*', async (c, next) => {
	const authHeader = c.req.header('authorization');
	if (!authHeader) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token: string = authHeader.split(' ')[1];
    try{
	const payload = await Jwt.verify(token, c.env.JWT_SECRET);
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set('userId', payload.id as number);
	await next();
}catch(error){
    return c.text('error occured while authenticating user', 403)
}
})
//ending of middleware

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try{
    // const body:{
    //     title: string,
    //     content: string,
    //     userId: number
    //     } = await c.req.json();

    // if(!body.title || !body.content){
    //     return c.body('Details are required', 400);
    // }

    const body = await c.req.json();
    console.log(body);
    const { success} = createBlogSchema.safeParse(body);
    console.log(success);
    if(!success){
        return c.text('Invalid details', 400);
    }

    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: body.userId
        }
    });
    console.log(blog);
    return c.json({
        msg: 'Blog created successfully',
        blog
    });
  }catch(error){
    return c.text('error occured while creating blog', 403)
  }
  })

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
//   const body:{
//     title: string,
//     content: string,
//     userId: number
//     } = await c.req.json();

//     if(!body.title || !body.content){
//         return c.body('Details are required', 400);
//     }

    const body = await c.req.json();
    const { success} = updateBlogSchema.safeParse(body);
    if(!success){
        return c.text('Invalid details', 400);
    }

    const blog = await prisma.blog.update({
        where: {
            id: body.userId
        },
        data: {
            title: body.title,
            content: body.content,
        }
    });
    return c.json({
        msg: 'Blog updated successfully',
        blog
    });
}catch(error){  
    return c.text('error occured while updating blog', 403)
}
  })

  blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

    try{
        const blogs=await prisma.blog.findMany({
            select: {
                title: true,
                content: true,
                id: true,
                author:{
                    select: {
                        name: true
                    }
                }
            }
        });
        return c.json(blogs);
    }catch(error){
        return c.text('error occured while fetching blogs', 403)
    }
  })

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try{
    const blog= await prisma.blog.findUnique({
        where: {
            id: Number(c.req.param("id"))
        },
        select: {
            id: true,
            title: true,
            content: true,
            author:{
                select: {
                    name: true
                }
            }
        }
    });

    if(!blog){
        return c.text('Blog not found', 404);
    }

    return c.json(blog);
  }catch(error){
    return c.text('error occured while fetching blog', 403)
  }
  })

