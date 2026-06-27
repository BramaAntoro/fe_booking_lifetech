import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

function formatDateTime(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function RoomDetail({ room }) {
  const colorClass =
    roomColorClasses[room.displayColor] ?? roomColorClasses.blue;
  const colorLabel = roomColorLabels[room.displayColor] ?? "Tersedia";
  const schedules = room.bookedSchedules ?? [];

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Detail Room</p>
          <h1 className="mt-2 text-2xl font-semibold">{room.name}</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Kembali</Link>
        </Button>
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
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
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{room.status}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Dibuat</p>
            <p className="font-medium">{formatDateTime(room.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-medium">Jadwal Aktif</h2>
          <p className="text-sm text-muted-foreground">
            Daftar booking aktif yang akan datang atau sedang berjalan.
          </p>
        </div>

        {schedules.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Belum ada jadwal aktif.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="rounded-lg">
                <CardContent className="grid gap-2 py-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground">Pemesan</p>
                    <p className="font-medium">{schedule.bookedByName}</p>
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
      </section>
    </section>
  );
}
