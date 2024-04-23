import { resend } from "@/lib/resend/resend";
import VerificationEmail from "../../emails/verificationEmail";



export async function sendverificationEmail({
    email,username,otp
}:{
    email:string,username:string,otp:string
}){
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', 
            to: email,
            subject: 'Verification Email',
            react: VerificationEmail({username,otp}) ,
        });

        return {
            success:true,
            message:"verification email send successfully.."
        }
    } catch (error) {
        console.log("error in sending verification email",error)
        return {success:false, message:"error in sending verification email"}
    }
}