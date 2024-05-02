import dbConnect from "@/lib/db/dbConnect";
import UserModel from "@/model/user.model";
import {Message} from "@/model/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
    await dbConnect()
    const {username,content}:{content:string,username:string}=await request.json()
    try {
        const user = await UserModel.findOne({username, isVerified:true})
        if(!user){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"user not found",
                },{status:200}
            )
        }

        // is user Accepting messages
        if(!user.isAcceptingMessage){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"user is not accepting messages",
                },{status:200}
            )
        }
        const newMessage={content,createdAt:new Date()} 
        user.messages.push(newMessage as Message)
        await user.save()


        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"message send successfully"
            },{status:200}
        )

    } catch (error:any) {
        console.log("unexpected error inn send-messages",error)
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"falied to send-messages"
            },{status:500}
        )
    }

}
