import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function Dashboard() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <section className="mx-auto flex max-w-5xl items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold">
            Selamat datang{user?.name ? `, ${user.name}` : ""}
          </h1>
        </div>
        <Button type="button" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </section>
    </main>
  );
}
