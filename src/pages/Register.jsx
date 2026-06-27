import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { SignupForm } from "@/components/signup-form"
import { api } from "@/lib/axios"

function getErrorMessage(error) {
  return (
    error.response?.data?.message ??
    error.message ??
    "Registrasi gagal. Silakan coba lagi."
  )
}

export function Register() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleRegister(formData) {
    setErrorMessage("")

    if (formData.error) {
      setErrorMessage(formData.error)
      return
    }

    setIsSubmitting(true)

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      navigate("/login")
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <SignupForm
        className="w-full max-w-md"
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onSubmit={handleRegister}
      />
    </main>
  )
}
