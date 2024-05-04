import dbConnect from "@/lib/db/dbConnect";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";

export const DELETE=async(request:NextRequest, {params}:{
    params:{messageId:string}
})=>{
    const messageId=params.messageId
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user= session?.user

    if(!session || !session.user.isVerified){
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"Not authenticated"
            },{status:401}
        )
    }

    try {
        const updatedResult =await UserModel.updateOne(
            {_id:user?._id},
            {$pull:{messages:{_id:messageId}}}
        )
        console.log("updated  ",updatedResult)
        if(updatedResult.modifiedCount==0){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"Message not found or already deleted"
                },{status:404}
            )
        }
        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"Message Deleted",
            },{status:200}
        )

    } catch (error:any) {
        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:error.message,
            },{status:500}
        )
    }
}