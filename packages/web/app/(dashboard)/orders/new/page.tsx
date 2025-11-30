import {api} from "@/lib/api";
import {getAuthHeaders} from "@/lib/server-utils";
import {CreateOrderForm} from "@/components/organisms/CreateOrderForm";

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

async function getParts() {
    try {
        const headers = await getAuthHeaders();
        const res = await api.get("/part", {headers});
        return res.data;
    } catch (error) {
        console.error("Failed to fetch parts:", error);
        return [];
    }
}

async function getServices() {
    try {
        const headers = await getAuthHeaders();
        const res = await api.get("/service", {headers});
        return res.data;
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return [];
    }
}

export default async function NewOrderPage() {
    const [vehicles, parts, services] = await Promise.all([
        getVehicles(),
        getParts(),
        getServices(),
    ]);

    return (
        <CreateOrderForm
            vehicles={vehicles}
            parts={parts}
            services={services}
        />
    );
}
