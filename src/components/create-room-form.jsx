import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function CreateRoomForm({
  onSubmit,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.trim();

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    Promise.resolve(onSubmit?.({ name }))
      .then((result) => {
        setSuccessMessage(result?.message ?? "Ruangan berhasil dibuat.");
        form.reset();
      })
      .catch((error) => {
        console.error("Error creating room:", error);
        
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Gagal membuat ruangan.";
        
        setErrorMessage(errorMsg);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Tambah Room</CardTitle>
        <CardDescription>Buat ruangan baru untuk ditampilkan di dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="room-name">Nama Room</FieldLabel>
              <Input
                id="room-name"
                name="name"
                placeholder="Contoh: Meeting Room 1"
                maxLength={100}
                required
              />
              <FieldDescription>Maksimal 100 karakter.</FieldDescription>
            </Field>
            {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
            {successMessage ? (
              <p className="text-sm text-green-700">{successMessage}</p>
            ) : null}
            <Button type="submit" className="w-fit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Tambah Room"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
