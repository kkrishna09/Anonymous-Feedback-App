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
                {status:400}
            )
        }

        if(user.verifyCode!=otp){

        }
    } catch (error) {
        
    }
    
}