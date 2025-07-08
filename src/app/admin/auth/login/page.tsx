import LoginForm from '@/components/Admin/auth/LoginForm'
import SignUpForm from '@/components/Admin/auth/SignUpForm'
import React from 'react'

function page() {
  return (
    <div><LoginForm />
      {/* uncomment the signUp form to create an admin account hide it back */}
      {/* <SignUpForm /> */}
      </div>
  )
}

export default page