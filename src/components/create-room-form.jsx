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
  errorMessage,
  isSubmitting = false,
  onSubmit,
  successMessage,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.trim();

    onSubmit?.({ name, reset: () => form.reset() });
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
