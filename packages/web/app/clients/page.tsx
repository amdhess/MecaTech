import {api} from "@/lib/api";
import {Client} from "@/types/client";
import {ClientsView} from "./ClientsView";

async function getClients(): Promise<Client[]> {
    try {
        const response = await api.get("/client");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch clients:", error);
        return [];
    }
}

export default async function ClientsPage() {
    const clients = await getClients();

    return <ClientsView initialData={clients} />;
}
