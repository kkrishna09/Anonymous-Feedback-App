import dbConnect from "@/lib/db/dbConnect";
import UserModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request:NextRequest) {
    await dbConnect()
    
    const session=await getServerSession(authOptions)
    if(!session || !session.user.isVerified){
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"Not authenticated"
            },{status:500}
        )
    }
    const user=session?.user
    const userId=user._id
    const {isAcceptingMessage}=await request.json()
    try {
        const updatedUser=await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage,
        },{new:true})
        if(!updatedUser){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"falied to update and save user accepting messages"
                },{status:500}
            )
        }

        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"Accepting messages status updated sucessfully",
                isAcceptingMessage:updatedUser.isAcceptingMessage
            },{status:200}
        )


    } catch (error) {
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"falied to update user accepting messages"
            },{status:500}
        )
    }
    

}

export async function GET(request:NextRequest) {
    await dbConnect()
    
    const session=await getServerSession(authOptions)
    if(!session || !session.user.isVerified){
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"Not authenticated"
            },{status:200}
        )
    }
    const user=session?.user
    const userId=user._id
    

    try {

        const CurrentUser=await UserModel.findById(userId)
        if(!CurrentUser){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"current user not found",
                    messages:[]
                },{status:200}
            )
        }

        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"Accepting messages status updated sucessfully",
                isAcceptingMessage:CurrentUser.isAcceptingMessage
            },{status:200}
        )


    } catch (error) {
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"falied to update user accepting messages"
            },{status:500}
        )
    }
}