
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log for debugging startup
console.log("Application starting...");

const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found! Check your index.html");
} else {
  console.log("Root element found, mounting application");
  createRoot(root).render(<App />);
}
