import { resend } from "@/lib/resend/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse} from "@/types/ApiResponse";
import { NextResponse } from "next/server";


export async function SendverificationEmail({
    email,username,otp
}:{
    email:string,username:string,otp:string
}){
    try {
        const emailRes=await resend.emails.send({
            from: 'onboarding@resend.dev', 
            to: email,
            subject: 'Verification Email',
            react: VerificationEmail({username,otp}) ,
          });
          console.log(emailRes)
        return NextResponse.json<ApiResponse>({
            success:true,
            message:"verification email send successfully.."
        },{status:200})
    } catch (error) {
        console.error("error in sending verification email",error)
        return NextResponse.json<ApiResponse>({success:false, message:"error in sending verification email",},{status:200})
    }
}