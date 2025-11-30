import {api} from "@/lib/api";
import {getAuthHeaders} from "@/lib/server-utils";
import {ServicesView} from "./ServicesView";

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

export default async function ServicesPage() {
    const services = await getServices();
    return <ServicesView initialServices={services} />;
}
