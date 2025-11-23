import {DashboardView} from "@/components/organisms/DashboardView";
import {api} from "@/lib/api";
import {ServiceOrder} from "@/types/order";
import {Part} from "@/types/part";

async function getOrders(): Promise<ServiceOrder[]> {
    try {
        const res = await api.get("/order");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch orders", error);
        return [];
    }
}

async function getLowStockParts(): Promise<Part[]> {
    try {
        const res = await api.get("/part");
        const parts: Part[] = res.data;
        return parts.filter((p) => p.stock < 10);
    } catch (error) {
        console.error("Failed to fetch parts", error);
        return [];
    }
}

export default async function Home() {
    const [orders, lowStockParts] = await Promise.all([
        getOrders(),
        getLowStockParts(),
    ]);

    return <DashboardView orders={orders} lowStockParts={lowStockParts} />;
}
