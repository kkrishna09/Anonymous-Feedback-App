"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const data = [
  {
    title: "Message from User123",
    content: "Hey, how are you doing today?",
    received: "10 minutes ago",
  },
  {
    title: "Message from SecretAdmirer",
    content: "I really liked your recent post!",
    received: "2 hours ago",
  },
  {
    title: "Message from MysteryGuest",
    content: "Do you have any book recommendations?",
    received: "1 day ago",
  },
];

export default  function Home() {

  const{data:session}=useSession()
  const isUserAllowed = session?.user.isVerified
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex h-screen flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {data.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {isUserAllowed && <div>
        <Link href={"/dashboard"}><Button>View Dashboard</Button></Link>
        </div>}
      </main>
      
    </>
  );
}
