import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { LoginForm } from "@/components/login-form"
import { api } from "@/lib/axios"

function getErrorMessage(error) {
  return (
    error.response?.data?.message ??
    error.message ??
    "Login gagal. Silakan coba lagi."
  )
}

export function Login() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogin(formData) {
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      })

      localStorage.setItem("token", response.data.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.data.user))

      navigate("/")
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <LoginForm
        className="w-full max-w-md"
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onSubmit={handleLogin}
      />
    </main>
  )
}
