import {cookies} from "next/headers";

export async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get("mecatech_token")?.value;

    return {
        Authorization: `Bearer ${token}`,
    };
}
