import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='absolute sm:top-[20%] sm:left-[38%] top-[15%] left-[4%] pb-30'>{children}</div>
  )
}

export default AuthLayout;