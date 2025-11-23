"use client";

import {
    Badge,
    Box,
    Button,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Table,
    Text,
} from "@chakra-ui/react";
import {ServiceOrder} from "@/types/order";
import {Part} from "@/types/part";
import {
    AlertTriangle,
    ClipboardList,
    Plus,
    Timer,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {StatCard} from "../molecules/StartCard";

interface DashboardViewProps {
    orders: ServiceOrder[];
    lowStockParts: Part[];
}

export function DashboardView({orders, lowStockParts}: DashboardViewProps) {
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    const inProgressOrders = orders.filter(
        (o) => o.status === "IN_PROGRESS"
    ).length;

    const recentOrders = orders.slice(0, 5);

    return (
        <Stack gap={8}>
            <HStack justify="space-between">
                <Heading size="lg">Dashboard</Heading>
                <Button asChild colorScheme="blue">
                    <Link href="/orders/new">
                        <Plus /> Nova Ordem de Serviço
                    </Link>
                </Button>
            </HStack>

            <SimpleGrid columns={{base: 1, md: 3}} gap={6}>
                <StatCard
                    label="Aguardando Aprovação"
                    value={pendingOrders}
                    icon={Timer}
                    color="orange"
                />
                <StatCard
                    label="Em Execução"
                    value={inProgressOrders}
                    icon={TrendingUp}
                    color="blue"
                />
                <StatCard
                    label="Total de OS (Geral)"
                    value={orders.length}
                    icon={ClipboardList}
                    color="gray"
                />
            </SimpleGrid>

            <SimpleGrid columns={{base: 1, lg: 2}} gap={8}>
                <Box
                    bg="bg.panel"
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    overflow="hidden"
                >
                    <Box
                        p={4}
                        borderBottomWidth="1px"
                        borderColor="border.subtle"
                    >
                        <Heading size="sm">Últimas Ordens de Serviço</Heading>
                    </Box>
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    Cliente / Veículo
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">
                                    Valor
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {recentOrders.map((order) => (
                                <Table.Row key={order.id}>
                                    <Table.Cell>
                                        <Stack gap={0}>
                                            <Text fontWeight="medium">
                                                {order.vehicle.client.name}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color="fg.muted"
                                            >
                                                {order.vehicle.model} (
                                                {order.vehicle.plate})
                                            </Text>
                                        </Stack>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge variant="surface" size="sm">
                                            {order.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell textAlign="end">
                                        R$ {order.totalPrice.toFixed(2)}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {recentOrders.length === 0 && (
                                <Table.Row>
                                    <Table.Cell
                                        colSpan={3}
                                        textAlign="center"
                                        color="fg.muted"
                                    >
                                        Nenhuma ordem recente.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>

                <Box
                    bg="bg.panel"
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    overflow="hidden"
                >
                    <Box
                        p={4}
                        borderBottomWidth="1px"
                        borderColor="border.subtle"
                    >
                        <HStack>
                            <Heading size="sm">Alerta de Estoque Baixo</Heading>
                            <Badge colorPalette="red" variant="solid">
                                Crítico
                            </Badge>
                        </HStack>
                    </Box>
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Peça</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">
                                    Estoque
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {lowStockParts.map((part) => (
                                <Table.Row key={part.id}>
                                    <Table.Cell>
                                        <HStack>
                                            <AlertTriangle
                                                size={16}
                                                color="orange"
                                            />
                                            <Text truncate maxW="200px">
                                                {part.name}
                                            </Text>
                                        </HStack>
                                    </Table.Cell>
                                    <Table.Cell
                                        textAlign="end"
                                        fontWeight="bold"
                                        color="red.500"
                                    >
                                        {part.stock}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {lowStockParts.length === 0 && (
                                <Table.Row>
                                    <Table.Cell
                                        colSpan={2}
                                        textAlign="center"
                                        color="fg.muted"
                                    >
                                        Estoque saudável! Nenhuma peça abaixo do
                                        limite.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </SimpleGrid>
        </Stack>
    );
}
