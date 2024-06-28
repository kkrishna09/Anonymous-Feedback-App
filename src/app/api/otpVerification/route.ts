import UserModel from "@/model/user.model";
import dbConnect from "@/lib/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request:NextRequest) {
    await dbConnect()
    try {
        const {otp,username}=await request.json()
        const user =await UserModel.findOne({username})
        if(!user){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"username is valid"
                },
                {status:500}
            )
        }

    if(user.isVerified){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"User already verified"
                },
                {status:200}
            )
        }
        
        const isCodeValid=user.verifyCode===otp
        if(!isCodeValid){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"incorrect OTP"
                },
            )
        }
        const isVerifyCodeExpiry= new Date(user.verifyCodeExpiry)> new Date()
        if(!isVerifyCodeExpiry){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"OTP has been expired"
                },
                {status:400}
            )
        }

        user.isVerified=true
        await user.save()
        
        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"OTP verified successfully"
            },
            {status:200}
        )

    } catch (error:any) {
        console.log("error in checking username", error.message)
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"error in otp verification"
            },{status:500}
        )
    }
    
}