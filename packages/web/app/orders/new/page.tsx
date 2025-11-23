import {api} from "@/lib/api";
import {CreateOrderForm} from "@/components/organisms/CreateOrderForm";

async function getVehicles() {
    const res = await api.get("/vehicle");

    return res.data;
}

async function getParts() {
    const res = await api.get("/part");
    return res.data;
}

async function getServices() {
    const res = await api.get("/service");
    return res.data;
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
