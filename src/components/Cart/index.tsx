import * as Dialog from '@radix-ui/react-dialog'
import { CartButton } from "../CartButton";
import { CartClose, CartContent, CartFinalization, CartProduct, CartProductDetails, CartProductImage, FinalizationDetails } from './styles';
import { X } from 'phosphor-react';
import Image from 'next/image';
import { useCart } from '../../hooks/UseCart';
import { useState } from 'react';
import axios from 'axios';

export function Cart() {
  const [isCreatePaymentSession, setIsCreatePaymentSession] = useState(false)
  const { cartItems, removeCartItem, cartTotal } = useCart()
  const cartQuantity = cartItems.length

  const formattedCartTotal = new Intl.NumberFormat('pt-BR', {
    style: "currency",
    currency: 'BRL'
  }).format(cartTotal)

  function handleRemoveCartItem (productId: string) {
    removeCartItem(productId)
  }

  async function handlePayment() {
    try {
      setIsCreatePaymentSession(true)
      const { data } = await axios.post('/api/payment', {
        products: cartItems
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
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <CartButton />
      </Dialog.Trigger>
      <Dialog.Portal>
        <CartContent>
          <CartClose>
            <X size={24} weight='bold' />
          </CartClose>
          <h2>Sacola de Compras</h2>

          <section>
            {cartQuantity <= 0 && <p>Pareceque seu carrinho está vazio :(</p>}
            {cartItems.map(cartItem => (
              <CartProduct key={cartItem.id}> 
                <CartProductImage>
                  <Image width={100} height={93} alt='' src={cartItem.imageUrl} />
                </CartProductImage>
                <CartProductDetails>
                  <p>{cartItem.name}</p>
                  <strong>{cartItem.price}</strong>
                  <button onClick={() => handleRemoveCartItem(cartItem.id)}>Remover</button>
                </CartProductDetails>
              </CartProduct>
            ))}
          </section>
          <CartFinalization>
            <FinalizationDetails>
              <div>
                <span>Quantidade</span>
                <p>{cartQuantity} {cartQuantity === 1 ? 'item' : 'itens'}</p>
              </div>
              <div>
                <span>Preço</span>
                <p>{formattedCartTotal}</p>
              </div>
            </FinalizationDetails>
            <button onClick={() => handlePayment()}>Finalzar Compra</button>
          </CartFinalization>
        </CartContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
