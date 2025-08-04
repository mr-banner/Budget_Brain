import { statsData } from '@/data/LandingConstant'
import React from 'react'

const Home = () => {
  return (
    <section className='py-20 bg-blue-50'>
        <div className='inline-padding'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                {statsData.map((stats,index) => (
                    <div key={index} className='text-center'>
                        <h4 className='text-4xl font-bold text-primary mb-2'>{stats.value}</h4>
                        <p className='text-gray-600'>{stats.label}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default Home