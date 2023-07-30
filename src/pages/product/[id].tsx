import { ImageContainer, ProductContainer, ProductDetail } from '../../styles/pages/product'
import { GetStaticPaths, GetStaticProps } from 'next'
import { stripe } from '../../lib/stripe'
import Stripe from 'stripe'
import Image from 'next/image'
import Head from 'next/head'
import { useCart } from '../../hooks/UseCart'
import { IProduct } from '../../contexts/CartContext'

interface ProductProps {
  product: IProduct
}

export default function Product({ product }: ProductProps) {
  // const { isFallback, query } = useRouter()

  const { addToCart, checkIfItemAlreadyExists } = useCart()

  const itemAlreadyExits = checkIfItemAlreadyExists(product.id)

  return (
    <>
      <Head>
        <title>{product?.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} />
        </ImageContainer>

        <ProductDetail>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button disabled={itemAlreadyExits} onClick={() => addToCart(product)}> {itemAlreadyExits ? 'Item já está adicionado na sacola' : 'Adicionar na sacola'} </button>
        </ProductDetail>
      </ProductContainer>
    </>
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
        numberPrice: price.unit_amount / 100,
        defaultPriceId: price.id
      }
    },
    revalidate: 60 * 60 * 1
  }
}