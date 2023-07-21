import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"
import logo from '../assets/logo.svg'
import { Container, Header } from "../styles/pages/app"
import Image from "next/image"

globalStyles()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image src={logo} alt="" />
      </Header>
      <Component {...pageProps} />
    </Container>
  )
}

export default MyApp
