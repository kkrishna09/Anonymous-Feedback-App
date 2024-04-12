import {z } from "zod"
export const mEssageSchema= z.object({
    content:z.
        string()
        .min(10,{message:"content must contains 10 character"})
        .max(300,{message:"content must be no longer than 300 character"})
})