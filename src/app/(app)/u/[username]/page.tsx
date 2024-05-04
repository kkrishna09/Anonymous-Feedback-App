"use client";

import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import { z } from "zod";
import { Link, Loader2 } from "lucide-react";
import { useCompletion } from "ai/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";

const specialChar = "||"
 
const parseStringMessages= (prompt:string): string[]=>{
    return prompt.split(specialChar)
}
const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";
const page = ({ params }: { params: { username: string } }) => {
    const {
        complete,
        completion,
        isLoading: isSuggestLoading,
        error,
      } = useCompletion({
        api: '/api/suggest-messages',
        initialCompletion: initialMessageString,
      });

      const fetchSuggestedMessages = async () => {
        try {
          complete('');
        } catch (error) {
          console.error('Error fetching messages:', error);
          // Handle error appropriately
        }
      };

  const [isLoading, SetIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const { watch,setValue } = form;
  const content = watch("content");
  const handleMessageClick=(message:string)=>{
    setValue("content",message)
  }

  const onSubmit = async () => {
    try {
      SetIsLoading(true);
      const { data: res } = await axios.post<ApiResponse>(
        "/api/send-messages",
        { username: params.username, content }
      );
      SetIsLoading(false);
      toast({
        title: res.success ? "Success" : "Failed",
        description: res.message,
        variant: res.success ? "default" : "destructive",
      });
    } catch (error: any) {
      SetIsLoading(false);
      console.log(error);
      toast({
        title: "Error Occured",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
                <FormMessage about="content" />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            {isLoading ? <Loader2 className="animate-spin" /> : "Send"}
          </Button>
        </form>
      </Form>
      
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
