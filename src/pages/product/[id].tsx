import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ImageContainer, ProductContainer, ProductDetail } from '../../styles/pages/product'
import { GetStaticPaths, GetStaticProps } from 'next'
import { stripe } from '../../lib/stripe'
import Stripe from 'stripe'
import Image from 'next/image'
import axios from 'axios'

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {
  // const { isFallback, query } = useRouter()
  const [isCreatePaymentSession, setIsCreatePaymentSession] = useState(false)

  async function handlePriceId() {
    try {
      setIsCreatePaymentSession(true)
      const { data } = await axios.post('/api/payment', {
        priceId: product.defaultPriceId
      })
      const { checkoutUrl } = data
      window.location.href = checkoutUrl
    } catch (err) {
      setIsCreatePaymentSession(false)
      // Conectar com uma ferramenta de observabilidade (Datadog / Sentry)
      alert('Falha ao redirecionar ao checkout!')
    }
  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} />
      </ImageContainer>

      <ProductDetail>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button disabled={isCreatePaymentSession} onClick={handlePriceId}>Comprar agora</button>
      </ProductDetail>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking', //true
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount / 100),
        description: product.description,
        defaultPriceId: price.id
      }
    },
    revalidate: 60 * 60 * 1
  }
}