import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"
import { Container } from "../styles/pages/app"
import { Header } from "../components/Header"

globalStyles()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header/>
      <Component {...pageProps} />
    </Container>
  )
}

export default MyApp
