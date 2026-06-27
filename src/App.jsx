import { Navigate, Route, Routes } from "react-router-dom"

import "./App.css"
import { Dashboard } from "@/pages/Dashboard"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
