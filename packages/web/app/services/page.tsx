import {api} from "@/lib/api";
import {ServicesView} from "./ServicesView";

async function getServices() {
    try {
        const res = await api.get("/service");
        return res.data;
    } catch (e) {
        return [];
    }
}

export default async function ServicesPage() {
    const services = await getServices();
    return <ServicesView initialServices={services} />;
}
