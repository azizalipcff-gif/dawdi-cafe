import { ShoppingBag } from "lucide-react";
import { getAllOrders } from "@/lib/data";
import { OrdersManager } from "./OrdersManager";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted">Track and manage customer orders</p>
        </div>
      </div>
      <OrdersManager orders={orders} />
    </div>
  );
}
