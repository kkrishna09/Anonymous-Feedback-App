import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/db/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from 'bcryptjs'

export const authOptions:NextAuthOptions={
    secret:process.env.NEXT_AUTH_SECRET,
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                credential: { label: "Credential", type: "text", placeholder: "Email or Username" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credential:any):Promise<any>{
                await dbConnect()
                try {
                    const user =await UserModel.findOne({
                        $or:[
                            {email:credential.identifier.email},
                            {username:credential.identifier.username}
                        ]
                    })
                    if (!user){
                         throw new Error("user not found")
                    }
                    if (user.isVerified){
                        throw new Error("user is not verified")
                    }
                    const IsPasswordCorrect=await bcrypt.compare(credential.password,user.password)
                    if(IsPasswordCorrect){
                        throw new Error("Password is incorrect")
                    }
                    return user
                } catch (err:any) {
                    throw new Error(err)
                }
              }
        }),
    ],
    callbacks:{
        async jwt({ token, user}) {
            if(user){
                token._id=user._id?.toString();
                token.isVerified=user.isVerified;
                token.isAcceptingMessage=user.isAcceptingMessage;
                token.username=user.username;
            }
        return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMessage=token.isAcceptingMessage;
                session.user.username=token.username;
            }
        return session
        },
    },
    pages:{
        signIn:'sign-in'
    },
    session:{
        strategy:"jwt"
    },
}