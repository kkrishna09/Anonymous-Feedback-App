'use client'

import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { User } from 'next-auth'
import { Button } from '../ui/button'
const Navbar = () => {
    const {data:session} = useSession()
    const user:User = session?.user as User
return (
    <nav className="p-4 md:p-6 fixed left-0 right-0 top-0 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
        Anonymous FeedBack App
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user.username || user.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <div className='flex right-0 gap-3'>
            <Link href="/sign-in">
                <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Sign In</Button>
            </Link>
            <Link href="/sign-up">
                <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>

)
}

export default Navbar