import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/db/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from 'bcryptjs'

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                
                identifier: { label: "identifier", type: "text", placeholder: "Email or Username" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                    const user =await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if (!user){
                        return  new Error("user not found")
                    }
                    if (user.isVerified){
                        return new Error("user is not verified")
                    }
                    const IsPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                    if(!IsPasswordCorrect){
                        return new Error("Password is incorrect")
                    }
                    return user
                } catch (err:any) {
                    return new Error(err)
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
    secret:process.env.NEXT_AUTH_SECRET,
    pages:{
        signIn:'sign-in'
    },
    session:{
        strategy:"jwt"
    },
}