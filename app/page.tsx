import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
    redirect('/home')
}

export default page