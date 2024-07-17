import z from "Zod";

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
});

export type SignupType = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type SigninType = z.infer<typeof signinSchema>;

export const createBlogSchema = z.object({
    title: z.string(),
    content: z.string(),
});

export type CreateBlogType = z.infer<typeof createBlogSchema>;

export const updateBlogSchema = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number(),
});

export type UpdateBlogType = z.infer<typeof updateBlogSchema>;