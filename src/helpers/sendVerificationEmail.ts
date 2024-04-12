import { resend } from "@/lib/resend/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse} from "@/types/ApiResponse";


export async function SendverificationEmail({
    email,username,otp
}:{
    email:string,username:string,otp:string
}):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', 
            to: email,
            subject: 'Verification Email',
            react: VerificationEmail({username,otp}) ,
          });
        return {success:true, message:"verification email send successfully.."}
    } catch (error) {
        console.error("error in sending verification email",error)
        return {success:false, message:"error in sending verification email"}
    }
}