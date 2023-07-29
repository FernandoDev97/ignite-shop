import { HeaderContainer } from './styles';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/logo.svg'
import { Cart } from '../Cart';

export function Header() {
  return (
    <HeaderContainer>
      <Link href='/'>
        <a>
          <Image src={logo} alt="" />
        </a>
      </Link>
      <Cart />
    </HeaderContainer>
  );
}
