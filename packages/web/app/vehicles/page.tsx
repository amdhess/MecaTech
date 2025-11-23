import {api} from "@/lib/api";
import {VehiclesView} from "./VehiclesView";

async function getVehicles() {
    try {
        const res = await api.get("/vehicle");
        return res.data;
    } catch (e) {
        return [];
    }
}

async function getClients() {
    try {
        const res = await api.get("/client");
        return res.data;
    } catch (e) {
        return [];
    }
}

export default async function VehiclesPage() {
    const [vehicles, clients] = await Promise.all([
        getVehicles(),
        getClients(),
    ]);

    return <VehiclesView initialVehicles={vehicles} clients={clients} />;
}
