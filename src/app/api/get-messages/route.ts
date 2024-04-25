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
    if(!session || !session.user){
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"Not authenticated"
            },{status:500}
        )
    }
    const user=session?.user
    const userId=new mongoose.Types.ObjectId(user._id)
    

    try {

        const user=await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:"$messages"},
            {$sort:{"$messages.createdAt":-1}},
            {$group:{_id:"$_id",messages:{$push:"$messages"}}}
        ])
        if(!user || user.length ===0){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"user not found",
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