import {api} from "@/lib/api";
import {getAuthHeaders} from "@/lib/server-utils";
import {OrdersView} from "./OrdersView";

async function getOrders() {
    try {
        const headers = await getAuthHeaders();
        const res = await api.get("/order", {headers});
        return res.data;
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return [];
    }
}

export default async function OrdersPage() {
    const orders = await getOrders();
    return <OrdersView initialOrders={orders} />;
}
