import React, { Suspense } from 'react'
import DashBoardPage from './page'
import { BarLoader } from 'react-spinners'

const dashboardLayout = () => {
  return (
    <div>
        <h1 className='gradiant-title sm:text-6xl text-5xl mb-5'>Dashboard</h1>
        <Suspense fallback={<BarLoader className="h-4 w-[100%]"/>}>
            <DashBoardPage/>
        </Suspense>
    </div>
  )
}

export default dashboardLayout