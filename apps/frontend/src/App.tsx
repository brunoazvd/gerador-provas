import { Button } from "@/components/ui/button"
import { ERROR_MESSAGES } from "@app/shared"

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
      <p className="text-primary">{ERROR_MESSAGES.TOKEN_EXPIRED}</p>
    </div>
  )
}

export default App