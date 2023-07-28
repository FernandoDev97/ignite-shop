import React from 'react'
import { SuccessContainer } from '../styles/pages/success'
import { ImageContainer } from '../styles/pages/success'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { stripe } from '../lib/stripe'
import Stripe from 'stripe'
import Image from 'next/image'
import Head from 'next/head'

interface SuccessProps {
  customerName: string
  product: {
    name: string
    imageUrl: string
  }
}

const Success = ({ customerName, product }: SuccessProps) => (
  <>
    <Head>
      <title>Compra efetuada | Ignite Shop</title>
      <meta name='robots' content='noindex' />
    </Head>
    <SuccessContainer>
      <h1>Compra efetuada!</h1>
      <ImageContainer>
        <Image src={product.imageUrl} width={120} height={110} alt='' />
      </ImageContainer>

      <p>
        Uhuuul <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já esta a caminho da sua casa.
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
  const product = response.line_items.data[0].price.product as Stripe.Product

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      }
    }
  }
}