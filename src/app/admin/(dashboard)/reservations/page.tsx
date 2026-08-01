import { CalendarCheck } from "lucide-react";
import { getAllReservations } from "@/lib/data";
import { ReservationsManager } from "./ReservationsManager";

export default async function AdminReservationsPage() {
  const reservations = await getAllReservations();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Reservations</h1>
          <p className="text-sm text-muted">Manage table reservations</p>
        </div>
      </div>
      <ReservationsManager reservations={reservations} />
    </div>
  );
}
