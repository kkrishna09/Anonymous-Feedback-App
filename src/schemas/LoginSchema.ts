import {z } from "zod"
export const loginSchema= z.object({
    indentifier:z.string(),
    password:z.string()
})