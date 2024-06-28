'use client'

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
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';


function SignInPage(){
  const [loading,setLoading]=useState(false)
  const { toast } = useToast()
  const router=useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
      identifier: "",
      password: "",
      },
  })
    



  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading(true)
    try {
      const res =await signIn("credentials",{
        identifier:values.identifier,
        password:values.password,
        redirect:false,
      })
      setLoading(false)
      console.log(res)
      if(res?.error){
        console.log(res.error)
        toast({
          title:"Failed to Sign in",
          description:"Check Credentials and password",
          variant:"destructive"
        })
      }
      if(res?.ok){
        toast({
          title:"Success",
          description:"Sign in Successfully"
        })
        router.replace("/dashboard")
      }
      
    } catch (error) {
      setLoading(false)
        toast({
            title:"error ",
            description:"an error occurred in sign in",
            variant:"destructive"
        })
    }
  }
  return (
    <div className='min-h-screen'>
        <div className='p-5 bg-white border border-var(--border) shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-3">
                  <h1 className='text-center  text-black  text-3xl font-bold'>Anonymous-Feedback-App</h1>
                  <FormDescription className="text-center  text-black  text-2xl font-bold">
                  Sign In
                  </FormDescription>
                  <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Email or Username</FormLabel>
                      <FormControl>
                          <Input type='text' placeholder="Email or Username" {...field}  className="input-field" />
                      </FormControl>
                      <FormMessage  about='identifier'/>
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
                  <Button disabled={ loading } type="submit" className=" bg-black text-white border border-white py-3 rounded-md hover:bg-white hover:border-black hover:text-black transition duration-300">{loading? <Loader2 className='animate-spin' />:"Sign In"} </Button>
                  <FormDescription className="text-center">
                  Don't have an account? <Link className="text-blue-500" href={"http://localhost:3000/sign-up"}>Sign Up</Link>
                  </FormDescription>
              </form>
          </Form>
    </div>
    </div>
  )
}

export default SignInPage