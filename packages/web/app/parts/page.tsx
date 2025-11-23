import {api} from "@/lib/api";
import {PartsView} from "./PartsView";

async function getParts() {
    try {
        const res = await api.get("/part");
        return res.data;
    } catch (e) {
        return [];
    }
}

export default async function PartsPage() {
    const parts = await getParts();
    return <PartsView initialParts={parts} />;
}
