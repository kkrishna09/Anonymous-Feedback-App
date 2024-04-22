"use client"
import React, { useState } from 'react';
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


function signIn(){
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

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setLoading
    try {
        const {data:res}=await axios.post<ApiResponse>("/api/sign-up",values)
        toast({
            title:res.success?"Successful":"Failed",
            description:res.message
        })
        if(res.success){
            router.replace(`/otpVerification?username=${values.username}`)
        }
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <div className='p-5 bg-white border border-var(--border)  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-3">
                <FormDescription className="text-center text-2xl font-bold">
                Sign Up
                </FormDescription>
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input type='text' placeholder="Username" {...field} className="input-field" />
                    </FormControl>
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
                        <Input type='email' placeholder="Email" {...field} className="input-field" />
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
                <Button type="submit" className=" bg-black text-white border border-white py-3 rounded-md hover:bg-white hover:border-black hover:text-black transition duration-300">{loading? <Loader2 />:"Submit"} </Button>
                <FormDescription className="text-center">
                Already have an account? <Link className="text-blue-500" href={"http://localhost:3000/sign-in"}>Sign In</Link>
                </FormDescription>
            </form>
        </Form>
  </div>
  )
}

export default signIn