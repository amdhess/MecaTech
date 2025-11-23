import {api} from "@/lib/api";
import {OrderTable} from "@/components/organisms/OrderTable";
import {Box, Button, Heading, HStack} from "@chakra-ui/react";
import Link from "next/link";
import {Plus} from "lucide-react";

async function getOrders() {
    try {
        const res = await api.get("/order");
        return res.data;
    } catch (e) {
        return [];
    }
}

export default async function OrdersListPage() {
    const orders = await getOrders();

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading>Ordens de Serviço</Heading>
                <Button asChild colorScheme="blue">
                    <Link href="/orders/new">
                        <Plus /> Nova Ordem de Serviço
                    </Link>
                </Button>
            </HStack>

            <OrderTable orders={orders} />
        </Box>
    );
}
