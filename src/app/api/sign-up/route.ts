import { sendverificationEmail} from "@/helpers/sendVerificationEmail"
import dbConnect from "@/lib/db/dbConnect"
import UserModel from "@/model/user.model"

import { ApiResponse } from "@/types/ApiResponse"
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
export async function POST(request:NextRequest):Promise<NextResponse<ApiResponse>>{
    await dbConnect()
    try {
        const {username,email,password} =await request.json()

        // finding a user which exist and also verified
        const isUserVerifiedExist= await UserModel.findOne({$or:[{email,isVerified:true},{username,isVerified:true}]})

        if(isUserVerifiedExist){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"User already exist with these email or username"
                },
                {status:200}
            )
        }

        const verifyCode=Math.floor(100000+Math.random() * 900000).toString()
        const verifyCodeExpiry=new Date()
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours()+1)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        // finding a user which exist but not verified

        const isUser= await UserModel.findOne({$or:[{email,isVerified:false},{username,isVerified:false}]})
        if(isUser){
            isUser.email=email
            isUser.username=username
            isUser.password=hashedPassword
            isUser.verifyCode=verifyCode
            isUser.verifyCodeExpiry=verifyCodeExpiry
            await isUser.save()
        }else{
            const newUser=new UserModel({
                username,
                password:hashedPassword,
                email,
                verifyCodeExpiry,
                verifyCode,
                messages:[],
            })
            
            await newUser.save()
        }
        
        
        const emailResponse =await sendverificationEmail({email,username,otp:verifyCode})
          console.log(emailResponse)
        if(!emailResponse.success){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"failed in sending verification code"
                },
                {status:200}
            )
        }
        
        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"Verification Otp has been send to your email"
            },
            {status:200}
        )
        // const tokenData={userId:newUser._id}
        // const token= jwt.sign(tokenData,process.env.TOKEN_SECRET!)
        // response.cookies.set("token",token,{httpOnly:true})
        
    } catch (error) {
        console.error("error registering user", error)
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"failed in signup"
            },
            {status:500}
        )
    }
}