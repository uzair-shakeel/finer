import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className="mt-[100px] flex flex-col items-center">
            <div className="relative max-w-[960px] w-full">
                <Image 
                    src="/assets/not-found-page-bg.webp"  
                    alt="404 Background"
                    width={960}
                    height={500}
                    className="w-full"
                    priority
                />

                {/* Content */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-[128px] font-medium text-black leading-[180px]">404</h1>
                    <h3 className="mb-12 text-4xl font-normal text-black">Error</h3>
                    <Link href="/">
                        <span className="bg-[#017EFE] px-10 py-2.5 rounded-[60px] text-white text-base font-medium cursor-pointer">
                            Return to main page
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
