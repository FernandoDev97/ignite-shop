import { HeaderContainer } from './styles';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/logo.svg'
import { Cart } from '../Cart';
import { useRouter } from 'next/router';

export function Header() {

  const { pathname } = useRouter()

  const showCartButton = pathname !== '/success'
  return (
    <HeaderContainer>
      <Link href='/'>
        <a>
          <Image src={logo} alt="" />
        </a>
      </Link>
      {showCartButton && <Cart />}
    </HeaderContainer>
  );
}
