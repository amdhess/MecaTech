import {api} from "@/lib/api";
import {getAuthHeaders} from "@/lib/server-utils";
import {VehiclesView} from "./VehiclesView";

async function getVehicles() {
    try {
        const headers = await getAuthHeaders();
        const res = await api.get("/vehicle", {headers});
        return res.data;
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        return [];
    }
}

async function getClients() {
    try {
        const headers = await getAuthHeaders();
        const res = await api.get("/client", {headers});
        return res.data;
    } catch (error) {
        console.error("Failed to fetch clients:", error);
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
