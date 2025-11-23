"use client";

import {Table} from "@/components/ui/table";
import {ServiceOrder} from "@/types/order";
import {Badge, IconButton} from "@chakra-ui/react";
import {Eye} from "lucide-react";

interface OrderTableProps {
    orders: ServiceOrder[];
}

export function OrderTable({orders}: OrderTableProps) {
    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Veículo</Table.ColumnHeader>
                    <Table.ColumnHeader>Cliente</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                        Total
                    </Table.ColumnHeader>
                    <Table.ColumnHeader></Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {orders.map((order) => (
                    <Table.Row key={order.id}>
                        <Table.Cell fontFamily="mono" fontSize="xs">
                            {order.id.slice(0, 8)}...
                        </Table.Cell>
                        <Table.Cell>
                            {order.vehicle.model} ({order.vehicle.plate})
                        </Table.Cell>
                        <Table.Cell>{order.vehicle.client.name}</Table.Cell>
                        <Table.Cell>
                            <Badge variant="subtle">{order.status}</Badge>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                            R$ {order.totalPrice.toFixed(2)}
                        </Table.Cell>
                        <Table.Cell>
                            <IconButton
                                aria-label="Ver detalhes"
                                size="xs"
                                variant="ghost"
                            >
                                <Eye />
                            </IconButton>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
