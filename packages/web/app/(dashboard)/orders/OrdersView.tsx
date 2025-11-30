"use client";

import {Box, Button, Heading, HStack, useDisclosure} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {ServiceOrder} from "@/types/order";
import {OrderTable} from "@/components/organisms/OrderTable";
import {ChangeStatusDialog} from "@/components/organisms/ChangeStatusDialog";
import {Plus} from "lucide-react";
import Link from "next/link";
import {useState} from "react";

interface OrdersViewProps {
    initialOrders: ServiceOrder[];
}

export function OrdersView({initialOrders}: OrdersViewProps) {
    const router = useRouter();

    const {open, onOpen, onClose} = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(
        null
    );

    const handleEditStatus = (order: ServiceOrder) => {
        setSelectedOrder(order);
        onOpen();
    };

    const handleStatusUpdated = () => {
        router.refresh();
    };

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Ordens de Serviço</Heading>
                <Button asChild colorScheme="blue" name="Nova OS">
                    <Link href="/orders/new">
                        <Plus /> Nova OS
                    </Link>
                </Button>
            </HStack>

            <OrderTable
                orders={initialOrders}
                onEditStatus={handleEditStatus}
            />

            <ChangeStatusDialog
                open={open}
                onClose={onClose}
                order={selectedOrder}
                onStatusUpdated={handleStatusUpdated}
            />
        </Box>
    );
}
