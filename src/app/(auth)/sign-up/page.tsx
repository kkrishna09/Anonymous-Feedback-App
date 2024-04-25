"use client"
import React, { useEffect, useState } from 'react';
 import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpSchema } from '@/schemas/signUpSchema';
import Link from 'next/link';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { debounce } from '@/helpers/debounce';

let count=0
function signUp(){
    count++
    console.log(count)
    const [isUsernameUnique,setIsUsernameUnique]=useState({
        unique:false,
        message:""
    })
    const [loading,setLoading]=useState(false)
    const { toast } = useToast()
    const router=useRouter()

    // 1. Define your form.
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
        username: "",
        email: "",
        password: "",
        },
    })
    

    const {watch}=form
    


    const uniqueUsername = async (username:string)=>{
        if(username.length>6){
            try {
                const {data}=await axios.get<ApiResponse>(`/api/check-user-unique?username=${username}`)
                setIsUsernameUnique({unique:data.success,message:data.message})
            } catch (error) {
                console.log("error in check-user-unique debounce",error)
            }
        }else{
            setIsUsernameUnique({unique:false,message:""})
        }
    }
    const debounced= debounce(uniqueUsername,500)

    useEffect(()=>{
        const subscription=watch((values:any)=>{
            if(values?.username?.length>6){
                debounced(values.username)
            }
        })
        return ()=> subscription.unsubscribe()
    },[watch])



  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setLoading(true)
    try {
        const {data:res}=await axios.post<ApiResponse>("/api/sign-up",values)
        setLoading(false)
        toast({
            title:res.success?"Successful":"Failed",
            description:res.message,
            variant:res.success?"default":"destructive"
        })
        if(res.success){
            router.replace(`/otpVerification?username=${values.username}`)
        }
    } catch (error) {
        setLoading(false)
        console.log(error)
        toast({
            title:"error ",
            description:"an error occurred in sign up",
            variant:"destructive"
        })
    }
  }
  return (
    <div className='p-5 bg-white border border-var(--border) shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-3">
                <h1 className='text-center  text-black  text-3xl font-bold'>Anonymous-Feedback-App</h1>
                <FormDescription className="text-center  text-black  text-2xl font-bold">
                Sign Up
                </FormDescription>
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input type='text' placeholder="Username" {...field}  className="input-field" />
                    </FormControl>
                    <FormMessage className={cn(isUsernameUnique.unique?"text-blue-500":"text-red-500")}>
                       {isUsernameUnique.message}
                    </FormMessage>
                    <FormMessage  about='username'/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type='email' placeholder="Email" {...field}  className="input-field" />
                    </FormControl>
                    <FormMessage  about='email'/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type='password' placeholder="Password" {...field} className="input-field" />
                    </FormControl>
                    <FormMessage  about='password'/>
                    </FormItem>
                )}
                />
                <Button disabled={!isUsernameUnique.unique || loading } type="submit" className=" bg-black text-white border border-white py-3 rounded-md hover:bg-white hover:border-black hover:text-black transition duration-300">{loading? <Loader2 className='animate-spin' />:"Sign Up"} </Button>
                <FormDescription className="text-center">
                Already have an account? <Link className="text-blue-500" href={"http://localhost:3000/sign-in"}>Sign In</Link>
                </FormDescription>
            </form>
        </Form>
  </div>
  )
}

export default signUp