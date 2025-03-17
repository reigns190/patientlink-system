
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log for debugging startup
console.log("Application starting...");
console.log("Current base URL:", import.meta.env.BASE_URL);

const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found! Check your index.html");
} else {
  console.log("Root element found, mounting application");
  try {
    createRoot(root).render(<App />);
    console.log("Application successfully mounted");
  } catch (error) {
    console.error("Error mounting application:", error);
  }
}
