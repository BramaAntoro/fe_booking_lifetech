import { Navigate, Route, Routes } from "react-router-dom"

import "./App.css"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
