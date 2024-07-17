import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Jwt } from 'hono/utils/jwt'
import { signupSchema } from '@bhavyajaiswal/common';
import { signinSchema } from '@bhavyajaiswal/common';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
    JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
    // const body:{
    //   name: string,
    //   email: string,
    //   password: string
    // } = await c.req.json();
  
    // if(!body.email || !body.password){
    //   return c.body('Details are required', 400);
    // }

    const body = await c.req.json();
    const { success} = signupSchema.safeParse(body);
    if(!success){
      return c.text('Invalid details', 400);
    }
  
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password
      }
    });
    const token= await Jwt.sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({token});
  }catch(error){
    return c.text('error occured while signing up', 403)
  }
  })

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
    // const body:{
    //   email: string,
    //   password: string
    // } = await c.req.json();
  
    // if(!body.email || !body.password){
    //   return c.body('Details are required', 400);
    // }

    const body = await c.req.json();
    const { success }= signinSchema.safeParse(body);
    if(!success){
      return c.text('Invalid details', 400);
    }
  
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      }
    });
  
    if(!user){
      return c.text('Invalid credentials', 403);
    }
  
    const token= await Jwt.sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({token, userId: user.id});
  }catch(error){
    return c.text('error occured while signing in', 403)
  }
  })