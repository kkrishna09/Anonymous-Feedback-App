'use client'
import React, { LegacyRef, useRef, useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot,} from "@/components/ui/input-otp"
 
import { Button } from "@/components/ui/button"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'

export default function otpVerification() {
    const {toast}=useToast()
    const queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString); 
    const username = urlParams.get('username')
    const [otpData,setOtpData]=useState({
        otp:"",
        username
    })
    const handleSubmit=async()=>{
        try {

            const {data:res} =await axios.post<ApiResponse>(`http://localhost:3000/api/otpVerification`,otpData)
            console.log(res)

            toast({
                title:res.success?"Successful":"Failed",
                description:res.message
            })
            
        } catch (error) {
            
        }
    }
  return (

    <div>
    <InputOTP onChange={(e)=> setOtpData(prev => ({...prev,otp: e}))}
     maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
        <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
        </InputOTPGroup>
    </InputOTP>
    <div>
    <Button onClick={handleSubmit} disabled={otpData.otp.length===6? false:true}>
        Submit
    </Button>
    </div>
    </div>
  )
}
