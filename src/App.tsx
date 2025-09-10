import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center space-x-8 p-6">
        <a href="https://electron-vite.github.io" target="_blank">
          <img src={viteLogo} className="logo w-24 h-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react w-24 h-24" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold text-center">Vite + React</h1>
      <div className="card p-6 text-center">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          count is {count}
        </button>
        <p className="mt-1">
          Edit <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs text-center text-gray-500 dark:text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
