import HomePage from "./pages/homepage"
import LoginPage from "./pages/loginpage"
import NotFoundPage from "./pages/notfoundpage"
import { Routes, Route } from "react-router-dom"
function App() {


  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )   
}

export default App
