export const dynamic = 'force-dynamic';
import dbConnect from "@/lib/db/dbConnect";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const userValidationSchema= z.object({
    username:usernameValidation
})


export async function GET(request:NextRequest) {
    dbConnect()
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = searchParams.get("username");
        // validation with zod
        if(!queryParams){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"invalid parameter"
                },
                {status:200}
            )
        }
        const decodeQueryParams=decodeURIComponent(queryParams!)
        // axios validation of schema
        const ValidationResult=userValidationSchema.safeParse({
            username:decodeQueryParams
        })


        if (!ValidationResult.success){
            const usernameError=ValidationResult.error.format().username?._errors|| []
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:usernameError?.length>0 ? usernameError.join(", "):"invalid query parameter"
                },
                {status:200}
            )
        }


        const {username}=ValidationResult.data
        const user= await UserModel.findOne({
            username,isVerified:true
        })
        if(user){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"Username already exist"
                },
                {status:200}
            )
        }
        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"Unique Username"
            },
            {status:200}
        )
    } catch (err:any) {
        console.log("error in checking username", err)
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"error in checking username"
            },{status:500}
        )
    }

}
