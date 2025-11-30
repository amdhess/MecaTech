import {api} from "@/lib/api";
import {getAuthHeaders} from "@/lib/server-utils";
import {OrderDetailView} from "./OrderDetailView";
import {Box, Heading, Text, Button} from "@chakra-ui/react";
import Link from "next/link";

interface OrderPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getOrder(id: string) {
    try {
        const headers = await getAuthHeaders();
        const res = await api.get(`/order/${id}`, {headers});
        return res.data;
    } catch (error) {
        console.error("Failed to fetch order:", error);
        return null;
    }
}

export default async function OrderPage({params}: OrderPageProps) {
    const {id} = await params;

    const order = await getOrder(id);

    if (!order) {
        return (
            <Box p={10} textAlign="center">
                <Heading mb={4}>Ordem de Serviço não encontrada</Heading>
                <Text mb={6}>
                    Não conseguimos encontrar a OS com o ID fornecido.
                </Text>
                <Button asChild colorScheme="blue">
                    <Link href="/orders">Voltar para a lista</Link>
                </Button>
            </Box>
        );
    }

    return <OrderDetailView order={order} />;
}
