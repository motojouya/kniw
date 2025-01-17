import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
// FIXME v3だと以下のようにする
// npx @chakra-ui/cli snippet add
// import { Provider } from "@/components/ui/provider"
import { App } from "@motojouya/kniw/src/pages/app"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
