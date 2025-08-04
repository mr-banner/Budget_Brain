import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const notFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[100vh] text-center'>
        <h1 className='text-8xl font-extrabold gradiant-title'>404</h1>
        <h2 className='text-4xl font-light mb-2 animate-caret-blink duration-700'>Page Not Found</h2>
        <p className='text-gray-600 font-normal text-xs md:text-md mb-8'>Oops! The page you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href={"/"}>
        <Button className='animate-bounce cursor-pointer hover:shadow-xl/80 hover:shadow-[#d5caff] bg-[#7f5efd] hover:bg-[#7f5efd] transition-all duration-500 ease-in-out'>Redirect to home</Button>
        </Link>
    </div>
  )
}

export default notFound