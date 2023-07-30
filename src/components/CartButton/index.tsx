import { Handbag } from "phosphor-react";
import { CartButtonContainer } from "./styles";
import { ComponentProps } from "react";

type CartButtonProps = ComponentProps<typeof CartButtonContainer>

export function CartButton({ ...rest }: CartButtonProps, quantity: number) {
  return (
    <CartButtonContainer {...rest}>
      {quantity > 0 && <span>{quantity}</span> }
      <Handbag weight="bold" />
    </CartButtonContainer>
  );
}
