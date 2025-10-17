import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>EventBuddy</h1>
        <p>Your Event Management Solution</p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Welcome to EventBuddy! This is the foundation for your event management application.
          </p>
        </div>
        <p className="read-the-docs">
          Click on the button above to test React functionality
        </p>
      </header>
    </div>
  )
}

export default App