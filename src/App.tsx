import XTTSServerForm from '@/forms/xtts/form.tsx'
import { Provider } from '@/components/ui/provider.tsx'
import { Container } from '@chakra-ui/react'

function App() {
  return (
      <Provider>
        <Container className={'!py-6'}>
          <XTTSServerForm/>
        </Container>
      </Provider>
  )
}

export default App
