import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CreateRoomForm } from "@/components/create-room-form";
import { RoomList } from "@/components/room-list";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

export function Dashboard() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  async function fetchRooms() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.get("/rooms");

      setRooms(response.data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);

      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Gagal mengambil data ruangan.";

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  async function handleCreateRoom({ name }) {
    if (!name) {
      throw new Error("Nama ruangan wajib diisi.");
    }

    await api.post("/rooms", { name });
    await fetchRooms();
  }

  async function handleUpdateRoom(roomId, payload) {
    if (!payload.name) {
      throw new Error("Nama ruangan wajib diisi.");
    }

    try {
      await api.put(`/rooms/${roomId}`, payload);
      await fetchRooms();
    } catch (error) {
      console.error("Error updating room inside dashboard:", error);
      throw error;
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function handleDeleteRoom(roomId) {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus ruangan ini?",
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/rooms/${roomId}`);
      await fetchRooms();
    } catch (error) {
      console.error("Error deleting room inside dashboard:", error);
      throw error;
    }
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold">
              Selamat datang{user?.name ? `, ${user.name}` : ""}
            </h1>
          </div>
          <Button type="button" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </header>

        <CreateRoomForm onSubmit={handleCreateRoom} />

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-medium">Daftar Room</h2>
            <p className="text-sm text-muted-foreground">
              Pantau status ruangan dan koneksi device.
            </p>
          </div>

          <RoomList
            errorMessage={errorMessage}
            isLoading={isLoading}
            onUpdateRoom={handleUpdateRoom}
            onDeleteRoom={handleDeleteRoom}
            onBookingCreated={fetchRooms}
            rooms={rooms}
          />
        </section>
      </section>
    </main>
  );
}
