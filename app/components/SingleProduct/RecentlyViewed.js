import React from 'react'

const RecentlyViewed = () => {
     return (
          <div className='mt-[52px] w-full'>
               <div className='w-full flex items-center justify-between gap-3'>
                    <h2 className='text-black text-[24px] font-semibold leading-[23px]'>Recently Viewed</h2>
                    <button className='bg-white rounded-[30px] w-fit h-[31px] px-3 text-[16px] font-normal leading-[19px]'>Clear all</button>
               </div>
          </div>
     )
}

export default RecentlyViewed