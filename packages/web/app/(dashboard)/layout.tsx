import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";
import { NestAPIError } from "@/types/api";
import { UserProfile } from "@/types/user";

function isAxiosError(error: unknown): error is AxiosError<NestAPIError> {
  return (error as AxiosError).isAxiosError !== undefined;
}

async function getProfile(): Promise<UserProfile | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await api.get<UserProfile>("/auth/profile", { headers });
    return res.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Token inválido ou expirado. Redirecionando.");
        redirect("/login");
      }
    }

    console.error("Erro desconhecido na busca de perfil:", error);
    return null;
  }
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();

  if (!user) {
    return <p>Erro ao carregar sessão.</p>;
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
