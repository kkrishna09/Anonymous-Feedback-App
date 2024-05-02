'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import MessageCard from '@/components/my_component/MessageCard'
import { Message } from '@/model/user.model'
import { acceptMessageSchema } from '@/schemas/AcceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const DashboadPage = () => {
  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const {toast}= useToast()

  const handleDeleteMessage= async(messageId:string)=>{
    setMessages(messages.filter((message)=> message._id !== messageId))
    try {
      setIsLoading(true)
      const {data:res}=await axios.delete<ApiResponse>(`/api/delete-messages/${messageId}`)
      setIsLoading(false)
      toast({
        title:res.success?"Success":"Failed",
        description:res.message,
        variant:res.success?"default":"destructive"
      })
    } catch (error:any) {
      setIsLoading(false)
      console.log(error)
      toast({
        title:"Failed to delete Message",
        description:error.message,
        variant:"destructive"
      })
    }
  }

  const{data:session}=useSession()
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema)
  })
  const {watch,register,setValue}=form
  const acceptMessages=watch("isAcceptingMessage")

  const handleGetIsAcceptingMessage=useCallback(async ()=>{

    try {
      const {data:res}=await axios.get<ApiResponse>("/api/accept-messages")
      if(!res.success){
        toast({
          title:res.success?"Success":"Failed",
          description:res.message,
          variant:res.success?"default":"destructive"
        })
        return
      }
      setValue("isAcceptingMessage",res.isAcceptingMessage!)
    } catch (error:any) {
      console.log(error)
      toast({
        title:"Error Occured",
        description:error.message,
        variant:"destructive"
      })
    }
  },[setValue])

  const handleMessage= useCallback( async (refresh: boolean = false) => {

    try {
      setIsLoading(true)
      const {data:res}=await axios.get<ApiResponse>("/api/get-messages")
      setMessages(res.messages || [])
      setIsLoading(false)
      if(!res.success){
        toast({
          title:"Failed to load Messages",
          description:res.message,
          variant:"destructive"
        })
        return
      }
      if (refresh) {
        toast({
          title: 'Refreshed',
          description: 'Showing latest messages',
        });
      }
    } catch (error:any) {
      console.log(error)
      toast({
        title:"Error Occured",
        description:error.message,
        variant:"destructive"
      })
    }
  },[messages])
  
  useEffect(() => {
    if (!session || !session.user) return;
    handleMessage()
    handleGetIsAcceptingMessage()
  }, [session])

  // handle switch change
  const handleIsacceptingMessageChange = async()=>{
    try {
      const {data:res}=await axios.post<ApiResponse>("/api/accept-messages",{isAcceptingMessage:!acceptMessages})
      if(res.success){
        setValue("isAcceptingMessage",! acceptMessages)
      }
      toast({
        title:res.success?"Success":"Failed",
        description:res.message,
        variant:res.success?"default":"destructive"
      })

    } catch (error:any) {
      console.log(error)
      toast({
        title:"Error Occured",
        description:error.message,
        variant:"destructive"
      })
    }
  }

  const username = session?.user.username
  const protocol = window.location.protocol
  const host =window.location.host
  const profileUrl = `${protocol}//${host}/u/${username}`

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl)
    toast({
      title:"Url Copied",
      description:"Profile url has been copied to clipboard"
    })
  }

  if(!session || !session.user){
    return <div>Please <Link href={"/sign-in"}>Sign In</Link></div>
  }

  return (
    <div className="my-8  h-auto min-h-screen mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("isAcceptingMessage")}
          checked={acceptMessages}
          onCheckedChange={handleIsacceptingMessageChange}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          handleMessage(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default DashboadPage