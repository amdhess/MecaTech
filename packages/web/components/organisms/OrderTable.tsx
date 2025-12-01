"use client";

import { Table } from "@/components/ui/table";
import {
  OrderStatusColor,
  OrderStatusLabel,
  ServiceOrder,
} from "@/types/order";
import { Badge, IconButton, HStack } from "@chakra-ui/react";
import { Edit, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";

interface OrderTableProps {
  orders: ServiceOrder[];
  onEditStatus: (order: ServiceOrder) => void;
}

export function OrderTable({ orders, onEditStatus }: OrderTableProps) {
  return (
    <Table.Root variant="line" size="sm">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>ID</Table.ColumnHeader>
          <Table.ColumnHeader>Veículo</Table.ColumnHeader>
          <Table.ColumnHeader>Cliente</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Total</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {orders.map((order) => (
          <Table.Row key={order.id}>
            <Table.Cell fontFamily="mono" fontSize="xs" color="fg.muted">
              {order.id.slice(0, 8)}...
            </Table.Cell>
            <Table.Cell>
              {order.vehicle.model} ({order.vehicle.plate})
            </Table.Cell>
            <Table.Cell>{order.vehicle.client.name}</Table.Cell>
            <Table.Cell>
              <Badge
                colorPalette={OrderStatusColor[order.status]}
                variant="solid"
              >
                {OrderStatusLabel[order.status]}
              </Badge>
            </Table.Cell>
            <Table.Cell textAlign="end" fontWeight="medium">
              R$ {order.totalPrice.toFixed(2)}
            </Table.Cell>
            <Table.Cell textAlign="end">
              <HStack justify="flex-end" gap={1}>
                <IconButton
                  aria-label="Alterar Status"
                  size="xs"
                  variant="outline"
                  colorPalette="blue"
                  onClick={() => onEditStatus(order)}
                >
                  <Edit size={14} />
                </IconButton>
                <Link href={`/orders/${order.id}`}>
                  <IconButton
                    aria-label="Ver detalhes"
                    size="xs"
                    variant="ghost"
                  >
                    <Eye size={14} />
                  </IconButton>
                </Link>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
