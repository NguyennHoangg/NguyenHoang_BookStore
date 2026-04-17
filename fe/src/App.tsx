import HomePage from "./pages/homepage"
import LoginPage from "./pages/loginpage"
import { Routes, Route } from "react-router-dom"
function App() {


  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  )   
}

export default App
