import { useState } from "react";
import { Link } from "react-router-dom";

import { api } from "@/lib/axios";
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
  onDeleteRoom,
  rooms,
}) {
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [updatingRoomId, setUpdatingRoomId] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingSchedules, setBookingSchedules] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  function formatDateTime(value) {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  async function fetchBookingSchedules(roomId) {
    try {
      setBookingLoading(true);
      setBookingError("");

      const response = await api.get(`/rooms/${roomId}`);
      setBookingSchedules(response.data.data.bookedSchedules ?? []);
    } catch (error) {
      console.error("Error fetching booking schedules:", error);
      setBookingError(
        error?.response?.data?.message ||
          error?.message ||
          "Gagal memuat jadwal booking.",
      );
    } finally {
      setBookingLoading(false);
    }
  }

  async function openBookingModal(room) {
    setBookingRoom(room);
    setBookingSchedules([]);
    setBookingError("");
    setBookingSuccess("");
    setIsBookingOpen(true);

    await fetchBookingSchedules(room.id);
  }

  function closeBookingModal() {
    setIsBookingOpen(false);
    setBookingRoom(null);
    setBookingSchedules([]);
    setBookingError("");
    setBookingSuccess("");
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    if (!bookingRoom) {
      setBookingError("Pilih ruangan terlebih dahulu.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const rawStartTime = formData.get("startTime");
    const localUser = localStorage.getItem("user");
    const user = localUser ? JSON.parse(localUser) : null;
    const bookedByName = user?.name || formData.get("bookedByName")?.trim();

    if (!rawStartTime) {
      setBookingError("Tanggal dan jam booking wajib diisi.");
      return;
    }

    const startTime = `${rawStartTime}:00+07:00`;

    if (!bookedByName) {
      setBookingError("Nama pemesan wajib diisi.");
      return;
    }

    try {
      setBookingSubmitting(true);
      console.log("Posting booking", {
        roomId: bookingRoom.id,
        startTime,
        bookedByName,
      });
      await api.post("/bookings", {
        roomId: bookingRoom.id,
        startTime,
        bookedByName,
      });

      setBookingSuccess("Booking berhasil dibuat.");
      await fetchBookingSchedules(bookingRoom.id);
      if (typeof onBookingCreated === "function") {
        onBookingCreated();
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setBookingError(
        error?.response?.data?.message ||
          error?.message ||
          "Gagal membuat booking.",
      );
    } finally {
      setBookingSubmitting(false);
    }
  }

  async function handleUpdateSubmit(event, room) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const deviceId = formData.get("deviceId")?.trim();
    const payload = {
      name: formData.get("name")?.trim(),
      deviceId: deviceId || null,
      status: formData.get("status"),
    };

    setUpdateErrorMessage("");
    setUpdatingRoomId(room.id);

    try {
      await onUpdateRoom?.(room.id, payload);
      setEditingRoomId(null);
    } catch (error) {
      console.error("Error updating room:", error);

      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memperbarui ruangan.";

      setUpdateErrorMessage(errorMsg);
    } finally {
      setUpdatingRoomId("");
    }
  }

  async function handleDeleteRoom(roomId) {
    try {
      await onDeleteRoom?.(roomId);
    } catch (error) {
      console.error("Error deleting room:", error);

      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menghapus ruangan.";

      alert(errorMsg);
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
                    {updateErrorMessage ? (
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
                        onClick={() => {
                          setEditingRoomId(null);
                          setUpdateErrorMessage("");
                        }}
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
                    onClick={() => openBookingModal(room)}
                  >
                    Booking
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setUpdateErrorMessage("");
                      setEditingRoomId(room.id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        );
      })}

      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
            <div className="flex flex-col gap-3 border-b border-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Booking Ruangan</p>
                <h2 className="text-xl font-semibold">
                  {bookingRoom?.name ?? "Booking"}
                </h2>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={closeBookingModal}
              >
                Tutup
              </Button>
            </div>

            <div className="grid gap-4 p-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 rounded-3xl border border-muted/20 bg-muted/10 p-4">
                <div>
                  <h3 className="text-base font-semibold">Form Booking</h3>
                  <p className="text-sm text-muted-foreground">
                    Pilih tanggal dan jam untuk memesan ruangan.
                  </p>
                </div>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="booking-start"
                      className="text-sm font-medium"
                    >
                      Tanggal & Jam
                    </label>
                    <input
                      id="booking-start"
                      name="startTime"
                      type="datetime-local"
                      className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  </div>

                  {!localStorage.getItem("user") && (
                    <div className="grid gap-2">
                      <label
                        htmlFor="bookedByName"
                        className="text-sm font-medium"
                      >
                        Nama Pemesan
                      </label>
                      <input
                        id="bookedByName"
                        name="bookedByName"
                        type="text"
                        placeholder="Masukkan nama pemesan"
                        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                      />
                    </div>
                  )}

                  {bookingError ? (
                    <p className="text-sm text-destructive">{bookingError}</p>
                  ) : null}
                  {bookingSuccess ? (
                    <p className="text-sm text-green-700">{bookingSuccess}</p>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={bookingSubmitting}>
                      {bookingSubmitting ? "Menyimpan..." : "Booking"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeBookingModal}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </div>

              <div className="space-y-4 rounded-3xl border border-muted/20 bg-muted/10 p-4">
                <div>
                  <h3 className="text-base font-semibold">Jadwal Booking</h3>
                  <p className="text-sm text-muted-foreground">
                    Jadwal aktif ruangan ini yang akan datang.
                  </p>
                </div>

                {bookingLoading ? (
                  <Card>
                    <CardContent className="py-6 text-sm text-muted-foreground">
                      Memuat jadwal booking...
                    </CardContent>
                  </Card>
                ) : bookingSchedules.length === 0 ? (
                  <Card>
                    <CardContent className="py-6 text-sm text-muted-foreground">
                      Belum ada jadwal booking.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {bookingSchedules.map((schedule) => (
                      <Card key={schedule.id} className="rounded-2xl">
                        <CardContent className="space-y-2 py-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Pemesan</p>
                            <p className="font-medium">
                              {schedule.bookedByName}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Mulai</p>
                            <p className="font-medium">
                              {formatDateTime(schedule.startTime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Selesai</p>
                            <p className="font-medium">
                              {formatDateTime(schedule.endTime)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
