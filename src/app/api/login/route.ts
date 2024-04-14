import dbConnect from "@/lib/db/dbConnect";
import UserModel from "@/model/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
export async function POST(request:NextRequest):Promise<NextResponse<ApiResponse>>{
   try {
        await dbConnect()
        const {indentifier,password}=await request.json()
        const isUser=await UserModel.findOne({$or:[{email:indentifier,isVerified:true},{username:indentifier,isVerified:true}]})

        if(!isUser){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"user does not exist with this email or username"
                },
                {status:400}
            )
        }
        const isPasswordCorrect= await bcrypt.compare(password,isUser._id) 
        
        if(!isPasswordCorrect){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"incorrect password"
                },
                {status:400}
            )
        }

        const tokenData={userId:isUser._id}
        const token = jwt.sign(tokenData,process.env.TOKEN_SECRET!)


        const response= NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"login successfully"
            },
            {status:200}
        )
        response.cookies.set("token",token,{httpOnly:true})
        
        return response
   } catch (error) {
    console.error("error registering user", error)
    return NextResponse.json<ApiResponse>(
        {
            success:false,
            message:"failed in login"
        },
        {status:500}
    )
   }
    
}