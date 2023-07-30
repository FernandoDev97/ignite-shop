import Image from "next/image";
import { HomeContainer, Product, SliderContainer } from "../styles/pages/home";
import { GetStaticProps } from "next";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import Link from "next/link";
import Head from "next/head";
import useEmblaCarousel from 'embla-carousel-react'
import { CartButton } from "../components/CartButton";
import { useCart } from "../hooks/UseCart";
import { IProduct } from "../contexts/CartContext";
import { MouseEvent } from "react";

interface HomeProps {
  products: IProduct[]
}

export default function Home({ products }: HomeProps) {

  const {addToCart, checkIfItemAlreadyExists} = useCart()

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  })

  function handleAddProductToCart(e: MouseEvent<HTMLButtonElement>, product: IProduct) {
    e.preventDefault()
    addToCart(product)
  }

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <div style={{ overflow: "hidden", width: '100%' }}>
        <HomeContainer>
          <div className="embla" ref={emblaRef}>
            <SliderContainer className="embla__container container">
              {products.map(product => (
                <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
                  <Product className="embla__slide" >
                    <Image src={product.imageUrl} alt="" width={520} height={480} />
                    <footer>
                      <div>
                        <strong>{product.name}</strong>
                        <span>{product.price}</span>
                      </div>
                      <CartButton 
                        onClick={(e) => handleAddProductToCart(e, product)} 
                        color="green" 
                        size='large'
                        disabled={checkIfItemAlreadyExists(product.id)}
                      />
                    </footer>
                  </Product>
                </Link>
              ))}
            </SliderContainer>
          </div>
        </HomeContainer>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })
  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-br', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount / 100),
      numberPrice: price.unit_amount / 100,
      defaultPriceId: price.id,
    }
  })
  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2
  }
}
