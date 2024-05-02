"use client"

import { useToast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/schemas/messageSchema'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
const page = ({params}:{params:{username:string}}) => {
    const [isLoading,SetIsLoading]=useState(false)
    const {toast}= useToast()
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    })
    const {watch}= form
    const content = watch("content")
    const onSubmit=async()=>{
        try {
            SetIsLoading(true)
            const {data:res}=await axios.post<ApiResponse>("/api/send-messages",{username:params.username,content})
            SetIsLoading(false)            
            toast({
                title:res.success?"Success":"Failed",
                description:res.message,
                variant:res.success?"default":"destructive"
            })

        } catch (error:any) {
            SetIsLoading(false)
            console.log(error)
            toast({
                title:"Error Occured",
                description:error.message,
                variant:"destructive"
            })
        }
    }
    
    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                        <FormItem>
                        <FormLabel>Enter Message for {params.username}</FormLabel>
                        <FormControl>
                            <Input placeholder="Message" {...field} />
                        </FormControl>
                        <FormMessage about='content' />
                        </FormItem>
                    )}
                    />
                    <Button disabled={isLoading} type="submit">{isLoading? <Loader2 className='animate-spin' />: "Send"}</Button>
                </form>
            </Form>
        </div>
      );
}

export default page