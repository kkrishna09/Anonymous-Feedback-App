import dbConnect from "@/lib/db/dbConnect";
import UserModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";


export async function GET(request:NextRequest) {
    await dbConnect()
    
    const session=await getServerSession(authOptions)
    console.log("session",session)
    if(!session || !session.user.isVerified){
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"Not authenticated"
            },{status:500}
        )
    }
    const user=session?.user
    // TODO session user is an object
    const userId=new mongoose.Types.ObjectId(user._id)
    

    try {
        const tempUser= await UserModel.findById(userId)
        if (!(tempUser?.messages.length)){
            console.log(tempUser?.messages)
            return NextResponse.json<ApiResponse>(
                {
                    success:true,
                    message:"No messages yet",
                    messages:[]
                },{status:200}
            )
        }

        const user=await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:"$_id",messages:{$push:"$messages"}}}
        ])
        
        if(!user || user.length ===0){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"No message",
                    messages:[]
                },{status:401}
            )
        }

        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"All messages get successfully",
                messages:user[0].messages,
            },{status:200}
        )


    } catch (error) {
        console.log("unexpected error inn get-messages",error)
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"falied to get-messages"
            },{status:500}
        )
    }
}