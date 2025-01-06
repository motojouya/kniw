import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "@/components/ui/provider"
// 上記でimportするには以下のコマンドが必要っぽい
// 要検討
// npx @chakra-ui/cli snippet add
// 普通にimportすると以下でやる感じだと思う
// import { ChakraProvider } from '@chakra-ui/react'

import { App } from "@motojouya/kniw/src/pages/battle/app"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
