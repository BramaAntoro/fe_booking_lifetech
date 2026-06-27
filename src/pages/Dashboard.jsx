import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CreateRoomForm } from "@/components/create-room-form";
import { RoomList } from "@/components/room-list";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

export function Dashboard() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  const [createSuccessMessage, setCreateSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
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
      setErrorMessage(
        error.response?.data?.message ??
          error.message ??
          "Gagal mengambil data ruangan."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  async function handleCreateRoom({ name, reset }) {
    setCreateErrorMessage("");
    setCreateSuccessMessage("");

    if (!name) {
      setCreateErrorMessage("Nama ruangan wajib diisi.");
      return;
    }

    setIsCreating(true);

    try {
      await api.post("/rooms", { name });
      reset?.();
      setCreateSuccessMessage("Ruangan berhasil dibuat.");
      await fetchRooms();
    } catch (error) {
      setCreateErrorMessage(
        error.response?.data?.message ??
          error.message ??
          "Gagal membuat ruangan."
      );
    } finally {
      setIsCreating(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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

        <CreateRoomForm
          errorMessage={createErrorMessage}
          isSubmitting={isCreating}
          onSubmit={handleCreateRoom}
          successMessage={createSuccessMessage}
        />

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
            rooms={rooms}
          />
        </section>
      </section>
    </main>
  );
}
