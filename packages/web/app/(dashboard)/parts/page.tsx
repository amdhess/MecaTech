import {api} from "@/lib/api";
import {getAuthHeaders} from "@/lib/server-utils";
import {PartsView} from "./PartsView";

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

export default async function PartsPage() {
    const parts = await getParts();
    return <PartsView initialParts={parts} />;
}
