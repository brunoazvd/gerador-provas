import { useState } from 'react'
// import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-yellow-200 p-8">
      <div className="mx-auto w-fit flex gap-2">
        <div>
          <button
            onClick={() => setCount((count) => count - 1)}
            className="rounded bg-yellow-400 px-4 py-2 text-black hover:bg-yellow-300"
          >
            -
          </button>
        </div>
        <h1 className="text-3xl font-bold">Count {count}</h1>
        <div>
          <button
            onClick={() => setCount((count) => count + 1)}
            className="rounded bg-yellow-400 px-4 py-2 text-black hover:bg-yellow-300"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
