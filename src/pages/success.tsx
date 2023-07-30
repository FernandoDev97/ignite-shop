import React from 'react'
import { ImagesContainer, SuccessContainer } from '../styles/pages/success'
import { ImageContainer } from '../styles/pages/success'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { stripe } from '../lib/stripe'
import Stripe from 'stripe'
import Image from 'next/image'
import Head from 'next/head'

interface SuccessProps {
  customerName: string
  productsImages: string[]
}

const Success = ({ customerName, productsImages }: SuccessProps) => (
  <>
    <Head>
      <title>Compra efetuada | Ignite Shop</title>
      <meta name='robots' content='noindex' />
    </Head>
    <SuccessContainer>
      <ImagesContainer>  
        {productsImages.map((productImage) => (
          <ImageContainer key={productImage}>
            <Image src={productImage} width={120} height={110} alt='' />
          </ImageContainer>
        ))}
      </ImagesContainer>

      <h1>Compra efetuada!</h1>

      <p>
        Uhuuul <strong>{customerName}</strong>, sua compra de <strong>{productsImages.length}</strong>
        {productsImages.length === 1 ? ' camiseta' : ' camisetas'} já esta a caminho da sua casa.
      </p>
      <Link href='/'>
        Voltar ao catálogo
      </Link>
    </SuccessContainer>
  </>
)

export default Success

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  const session = query.session_id

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const sessionId = String(query.session_id)

  const response = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = response.customer_details.name
  const productsImages = response.line_items.data.map(item => {
    const product = item.price.product as Stripe.Product
    return product.images[0]
  })

  return {
    props: {
      customerName,
      productsImages,
    }
  }
}