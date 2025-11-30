"use client";

import {
    Badge,
    Box,
    Button,
    Heading,
    HStack,
    Separator,
    Stack,
    Text,
    useDisclosure,
    SimpleGrid,
} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {OrderStatusColor, OrderStatusLabel, ServiceOrder} from "@/types/order";
import {Table} from "@/components/ui/table";
import {ChangeStatusDialog} from "@/components/organisms/ChangeStatusDialog";
import {ArrowLeft, Calendar, Car, User, RefreshCw, Printer} from "lucide-react";
import Link from "next/link";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import {OrderPrintTemplate} from "@/components/organisms/OrderPrintTemplate";

interface OrderDetailViewProps {
    order: ServiceOrder;
}

export function OrderDetailView({order}: OrderDetailViewProps) {
    const router = useRouter();
    const {open, onOpen, onClose} = useDisclosure();

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({contentRef});

    const handleStatusUpdated = () => {
        router.refresh();
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <Stack gap={8} pb={20}>
            <HStack justify="space-between" wrap="wrap" gap={4}>
                <HStack gap={4}>
                    <Button variant="ghost" asChild>
                        <Link href="/orders">
                            <ArrowLeft /> Voltar
                        </Link>
                    </Button>
                    <Stack gap={0}>
                        <Heading size="lg">
                            Ordem de Serviço #{order.id.slice(0, 8)}
                        </Heading>
                        <HStack color="fg.muted" fontSize="sm">
                            <Calendar size={14} />
                            <Text>Criado em {formatDate(order.createdAt)}</Text>
                        </HStack>
                    </Stack>
                </HStack>

                <HStack>
                    <Button variant="outline" onClick={() => reactToPrintFn()}>
                        <Printer size={16} /> Imprimir
                    </Button>
                    <Button colorScheme="blue" onClick={onOpen}>
                        <RefreshCw size={16} /> Mudar Status
                    </Button>
                </HStack>
            </HStack>

            <Separator />

            <SimpleGrid columns={{base: 1, md: 2}} gap={6}>
                <Box
                    p={6}
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    bg="bg.panel"
                >
                    <Stack gap={4}>
                        <Heading size="sm" mb={2}>
                            Dados do Veículo e Cliente
                        </Heading>

                        <HStack align="start" gap={3}>
                            <User size={18} className="text-gray-500 mt-1" />
                            <Stack gap={0}>
                                <Text fontWeight="medium">Cliente</Text>
                                <Text color="fg.muted">
                                    {order.vehicle.client.name}
                                </Text>
                                <Text fontSize="sm" color="fg.muted">
                                    {order.vehicle.client.email}
                                </Text>
                                <Text fontSize="sm" color="fg.muted">
                                    {order.vehicle.client.phone}
                                </Text>
                            </Stack>
                        </HStack>

                        <Separator />

                        <HStack align="start" gap={3}>
                            <Car size={18} className="text-gray-500 mt-1" />
                            <Stack gap={0}>
                                <Text fontWeight="medium">Veículo</Text>
                                <Text color="fg.muted">
                                    {order.vehicle.brand} {order.vehicle.model}
                                </Text>
                                <Text fontSize="sm" color="fg.muted">
                                    Placa: {order.vehicle.plate}
                                </Text>
                                <Text fontSize="sm" color="fg.muted">
                                    Ano: {order.vehicle.year}
                                </Text>
                            </Stack>
                        </HStack>
                    </Stack>
                </Box>

                <Box
                    p={6}
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    bg="bg.panel"
                >
                    <Stack gap={4} h="full" justify="center">
                        <Heading size="sm">Situação Atual</Heading>
                        <Box>
                            <Badge
                                colorPalette={OrderStatusColor[order.status]}
                                variant="solid"
                                size="lg"
                                px={4}
                                py={2}
                            >
                                {OrderStatusLabel[order.status]}
                            </Badge>
                        </Box>
                        <Text color="fg.muted" fontSize="sm">
                            O valor total desta ordem é baseado na soma das
                            peças e serviços listados abaixo.
                        </Text>
                    </Stack>
                </Box>
            </SimpleGrid>

            <Stack gap={6}>
                <Heading size="md">Detalhamento de Custos</Heading>

                <Box
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    overflow="hidden"
                >
                    <Box
                        bg="bg.subtle"
                        px={4}
                        py={2}
                        borderBottomWidth="1px"
                        borderColor="border.subtle"
                    >
                        <Text fontWeight="medium">Mão de Obra (Serviços)</Text>
                    </Box>
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    Descrição
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">
                                    Valor
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {order.services?.map((service) => (
                                <Table.Row key={service.id}>
                                    <Table.Cell>{service.name}</Table.Cell>
                                    <Table.Cell textAlign="end">
                                        {formatCurrency(service.price)}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {(!order.services ||
                                order.services.length === 0) && (
                                <Table.Row>
                                    <Table.Cell
                                        colSpan={2}
                                        color="fg.muted"
                                        textAlign="center"
                                    >
                                        Nenhum serviço listado.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>

                <Box
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    overflow="hidden"
                >
                    <Box
                        bg="bg.subtle"
                        px={4}
                        py={2}
                        borderBottomWidth="1px"
                        borderColor="border.subtle"
                    >
                        <Text fontWeight="medium">Peças Utilizadas</Text>
                    </Box>
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Peça</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">
                                    Qtd.
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">
                                    Valor Unit.
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">
                                    Subtotal
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {order.parts?.map((item) => (
                                <Table.Row
                                    key={item.partId + item.serviceOrderId}
                                >
                                    <Table.Cell>
                                        {item.part.name}{" "}
                                        <Text
                                            as="span"
                                            color="fg.muted"
                                            fontSize="xs"
                                        >
                                            ({item.part.sku})
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="end">
                                        {item.quantity}
                                    </Table.Cell>
                                    <Table.Cell textAlign="end">
                                        {formatCurrency(item.part.price)}
                                    </Table.Cell>
                                    <Table.Cell textAlign="end">
                                        {formatCurrency(
                                            item.part.price * item.quantity
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {(!order.parts || order.parts.length === 0) && (
                                <Table.Row>
                                    <Table.Cell
                                        colSpan={4}
                                        color="fg.muted"
                                        textAlign="center"
                                    >
                                        Nenhuma peça utilizada.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Stack>

            <Box alignSelf={{md: "flex-end"}} w={{base: "full", md: "sm"}}>
                <Box
                    bg="bg.panel"
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    p={6}
                >
                    <Stack gap={3}>
                        <HStack justify="space-between" color="fg.muted">
                            <Text>Total Serviços</Text>
                            <Text>
                                {formatCurrency(order.totalServicesPrice ?? 0)}
                            </Text>
                        </HStack>
                        <HStack justify="space-between" color="fg.muted">
                            <Text>Total Peças</Text>
                            <Text>
                                {formatCurrency(order.totalPartsPrice ?? 0)}
                            </Text>
                        </HStack>
                        <Separator />
                        <HStack
                            justify="space-between"
                            fontWeight="bold"
                            fontSize="lg"
                        >
                            <Text>Total Geral</Text>
                            <Text color="blue.600">
                                {formatCurrency(order.totalPrice)}
                            </Text>
                        </HStack>
                    </Stack>
                </Box>
            </Box>

            <ChangeStatusDialog
                open={open}
                onClose={onClose}
                order={order}
                onStatusUpdated={handleStatusUpdated}
            />

            <div style={{display: "none"}}>
                <OrderPrintTemplate ref={contentRef} order={order} />
            </div>
        </Stack>
    );
}
