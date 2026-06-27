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

export function RoomList({ errorMessage, isLoading, rooms }) {
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
            <CardContent>
              <Button asChild size="sm" variant="outline">
                <Link to={`/rooms/${room.id}`}>Cek detail</Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
