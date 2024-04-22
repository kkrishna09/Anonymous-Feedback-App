import {z} from 'zod'

export const usernameValidation=z
    .string()
    .min(5,"username must be atleast 5 characters")
    .max(20,"username must be not more than 20 characters")
    .regex(/^[2-zA-Z0-9_]+$/,"Username must not contain special Character")
export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invaild email address"}),
    password:z.string().min(8,{message:"password must be atleast 8 characters"}).max(20,{message:"password must be not more than 20 characters"})
})