import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { RoomDetail as RoomDetailContent } from "@/components/room-detail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/axios";

export function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRoomDetail() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get(`/rooms/${id}`);

        if (isMounted) {
          setRoom(response.data.data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message ??
              error.message ??
              "Gagal mengambil detail ruangan."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRoomDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-background p-6">
      <section className="mx-auto max-w-5xl">
        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Memuat detail ruangan...
            </CardContent>
          </Card>
        ) : errorMessage ? (
          <Card>
            <CardContent className="space-y-4 py-8">
              <p className="text-sm text-destructive">{errorMessage}</p>
              <Button asChild variant="outline">
                <Link to="/">Kembali</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <RoomDetailContent room={room} />
        )}
      </section>
    </main>
  );
}
