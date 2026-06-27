import { useState } from "react";
import { Link } from "react-router-dom";

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const roomColorClasses = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  red: "border-red-200 bg-red-50 text-red-700",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
  grey: "border-muted bg-muted text-muted-foreground",
};

const roomColorLabels = {
  blue: "Tersedia",
  red: "Sedang digunakan",
  yellow: "Segera",
  grey: "Pemeliharaan",
};

export function RoomList({
  errorMessage,
  isLoading,
  onUpdateRoom,
  rooms,
  updateErrorMessage,
  updatingRoomId,
}) {
  const [editingRoomId, setEditingRoomId] = useState(null);

  async function handleUpdateSubmit(event, room) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const deviceId = formData.get("deviceId")?.trim();

    const isSuccess = await onUpdateRoom?.(room.id, {
      name: formData.get("name")?.trim(),
      deviceId: deviceId || null,
      status: formData.get("status"),
    });

    if (isSuccess) {
      setEditingRoomId(null);
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Memuat data ruangan...
        </CardContent>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-destructive">
          {errorMessage}
        </CardContent>
      </Card>
    );
  }

  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Belum ada ruangan.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => {
        const colorClass =
          roomColorClasses[room.displayColor] ?? roomColorClasses.blue;
        const colorLabel = roomColorLabels[room.displayColor] ?? "Available";

        return (
          <Card key={room.id} className="rounded-lg">
            {editingRoomId === room.id ? (
              <form onSubmit={(event) => handleUpdateSubmit(event, room)}>
                <CardHeader>
                  <CardTitle>Edit Room</CardTitle>
                  <CardDescription>Perbarui data ruangan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor={`room-name-${room.id}`}>
                        Nama Room
                      </FieldLabel>
                      <Input
                        id={`room-name-${room.id}`}
                        name="name"
                        defaultValue={room.name}
                        maxLength={100}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`room-device-${room.id}`}>
                        Device ID
                      </FieldLabel>
                      <Input
                        id={`room-device-${room.id}`}
                        name="deviceId"
                        defaultValue={room.deviceId ?? ""}
                        maxLength={255}
                        placeholder="Kosongkan jika belum ada device"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`room-status-${room.id}`}>
                        Status
                      </FieldLabel>
                      <select
                        id={`room-status-${room.id}`}
                        name="status"
                        defaultValue={room.status}
                        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                    </Field>
                    {updateErrorMessage && updatingRoomId === room.id ? (
                      <FieldError>{updateErrorMessage}</FieldError>
                    ) : null}
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={updatingRoomId === room.id}
                      >
                        {updatingRoomId === room.id ? "Menyimpan..." : "Simpan"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRoomId(null)}
                      >
                        Batal
                      </Button>
                    </div>
                  </FieldGroup>
                </CardContent>
              </form>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription>
                        {room.deviceId ?? "Device belum terhubung"}
                      </CardDescription>
                    </div>
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${colorClass}`}
                    >
                      {colorLabel}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/rooms/${room.id}`}>Cek detail</Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingRoomId(room.id)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
