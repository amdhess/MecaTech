import {api} from "@/lib/api";
import {getAuthHeaders} from "@/lib/server-utils";
import {Client} from "@/types/client";
import {ClientsView} from "./ClientsView";

async function getClients(): Promise<Client[]> {
    try {
        const headers = await getAuthHeaders();
        const response = await api.get("/client", {headers});
        return response.data;
    } catch (error) {
        console.error("Failed to fetch clients:", error);
        return [];
    }
}

export default async function ClientsPage() {
    const clients = await getClients();
    return <ClientsView initialClients={clients} />;
}
