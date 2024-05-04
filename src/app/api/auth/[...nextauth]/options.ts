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
                        console.log("user not found")
                        return null
                    }
                    if (!user.isVerified){
                        console.log("user is not verified")
                        return null
                    }
                    const IsPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                    if(!IsPasswordCorrect){
                         console.log("Password is incorrect")
                        return null;
                    }
                    return user
                } catch (err:any) {
                    console.log(err.message)
                    return null
                }
              }
        }),
    ],
    callbacks:{
        
        async jwt({ token, user}) {
            if(user){
                token._id=user._id?.toString();
                token.isVerified=user.isVerified;
                token.username=user.username;
            }
        return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
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