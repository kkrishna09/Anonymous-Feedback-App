import { SendverificationEmail } from "@/helpers/sendVerificationEmail"
import dbConnect from "@/lib/db/dbConnect"
import UserModel from "@/model/user.model"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
export async function POST(request:NextRequest):Promise<NextResponse<ApiResponse>>{
    await dbConnect()
    try {
        const {username,email,password} =await request.json()
        const isUser= await UserModel.findOne({$or:[{email},{username}]})

        if(isUser){
            return NextResponse.json(
                {
                    success:false,
                    message:"User already exist with these email or username"
                },
                {status:400}
            )
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=new UserModel({
            username,
            password:hashedPassword,
            email,
            // verifyCodeExpiry,
            // verifyCode,
        })
        
        await newUser.save()
        // have to work on otp
        await SendverificationEmail({email,username,otp:""})
        const tokenData={userId:newUser._id}
        const token= jwt.sign(tokenData,process.env.TOKEN_SECRET!)
        const response=NextResponse.json(
            {
                success:true,
                message:"suceesfully signup"
            },
            {status:200}
        )
        response.cookies.set("token",token,{httpOnly:true})
        
        return response
    } catch (error) {
        console.error("error registering user", error)
        return NextResponse.json(
            {
                success:false,
                message:"failed in signup"
            },
            {status:500}
        )
    }
}