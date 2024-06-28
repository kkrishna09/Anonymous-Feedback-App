'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

  function OtpVerification() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [otpData, setOtpData] = useState({ otp: "", username: "" });

    useEffect(() => {
        const usernameParam = searchParams.get("username") || "";
        setUsername(usernameParam);
        setOtpData((prev) => ({ ...prev, username: usernameParam }));
    }, [searchParams]);

    const handleSubmit = async () => {
        try {
            const { data: res } = await axios.post<ApiResponse>(`${process.env.DOMAIN}/api/otpVerification`, otpData);
            console.log(res);

            toast({
                title: res.success ? "Successful" : "Failed",
                description: res.message,
                variant: res.success ? "default" : "destructive",
            });

            if (res.success) {
                router.replace("/dashboard");
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="flex flex-col gap-5 px-20 pt-16 pb-7 bg-white border border-var(--border) shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-center text-black text-3xl font-bold">Anonymous-Feedback-App</h1>
                <h2 className="text-center text-black text-2xl font-bold">OTP Verification</h2>
                <div><h2>Enter your 6 digit OTP</h2></div>
                <div className="flex justify-center">
                    <InputOTP
                        onChange={(e) => setOtpData((prev) => ({ ...prev, otp: e }))}
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    >
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
                </div>
                <div>
                    <Button onClick={handleSubmit} disabled={otpData.otp.length !== 6}>
                        Submit
                    </Button>
                </div>
                <div className="mt-4">
                    Didn't Sign Up yet? <Link className="text-blue-500" href="/sign-up">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

function OtpVerificationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpVerification />
        </Suspense>
    );
}

export default OtpVerificationPage;