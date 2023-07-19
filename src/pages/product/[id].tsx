import { useRouter } from 'next/router'
import React from 'react'

const Product = () => {

  const {query} = useRouter()
  console.log(query)

  return (
    <div>Product</div>
  )
}

export default Product