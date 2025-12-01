import { api } from "@/lib/api";
import { ClientPortalView } from "./ClientPortalView";
import { Box, Heading } from "@chakra-ui/react";

interface PublicPageProps {
  params: Promise<{
    token: string;
  }>;
}

async function getPublicOrder(token: string) {
  try {
    // Chamada pública (sem header de auth)
    const res = await api.get(`/order/public/${token}`);
    return res.data;
  } catch {
    return null;
  }
}

export default async function TrackOrderPage({ params }: PublicPageProps) {
  const { token } = await params;
  const order = await getPublicOrder(token);

  if (!order) {
    return (
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
        <Heading>Ordem de Serviço não encontrada ou link expirado.</Heading>
      </Box>
    );
  }

  return <ClientPortalView order={order} />;
}
