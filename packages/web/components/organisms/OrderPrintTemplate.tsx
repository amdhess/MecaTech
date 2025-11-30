import {Box, Heading, HStack, Separator, Stack, Text} from "@chakra-ui/react";
import {ServiceOrder, OrderStatusLabel} from "@/types/order";
import {forwardRef} from "react";

interface OrderPrintTemplateProps {
    order: ServiceOrder;
}

export const OrderPrintTemplate = forwardRef<
    HTMLDivElement,
    OrderPrintTemplateProps
>(({order}, ref) => {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(val);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("pt-BR") +
        " às " +
        new Date(date).toLocaleTimeString("pt-BR");

    return (
        <Box ref={ref} p={8} color="black" bg="white">
            <Stack textAlign="center" mb={8}>
                <Heading size="2xl">MecaTech Oficina</Heading>
                <Text>Rua da Oficina, 123 - Centro - Joinville/SC</Text>
                <Text>(47) 99999-9999</Text>
            </Stack>

            <Separator borderColor="black" mb={6} />

            <HStack justify="space-between" align="start" mb={8}>
                <Stack>
                    <Text fontWeight="bold">Cliente:</Text>
                    <Text>{order.vehicle.client.name}</Text>
                    <Text fontSize="sm">{order.vehicle.client.phone}</Text>
                </Stack>
                <Stack textAlign="right">
                    <Text fontWeight="bold">
                        Ordem de Serviço #{order.id.slice(0, 8)}
                    </Text>
                    <Text fontSize="sm">
                        Data: {formatDate(order.createdAt)}
                    </Text>
                    <Text fontSize="sm">
                        Status: {OrderStatusLabel[order.status]}
                    </Text>
                </Stack>
            </HStack>

            <Box mb={8}>
                <Text fontWeight="bold" mb={2}>
                    Veículo:
                </Text>
                <Text>
                    {order.vehicle.brand} {order.vehicle.model} -{" "}
                    {order.vehicle.year}
                </Text>
                <Text>Placa: {order.vehicle.plate}</Text>
            </Box>

            <Stack gap={6}>
                <Box>
                    <Text
                        fontWeight="bold"
                        mb={2}
                        borderBottomWidth="1px"
                        borderColor="black"
                    >
                        Serviços
                    </Text>
                    {order.services.map((s) => (
                        <HStack key={s.id} justify="space-between" py={1}>
                            <Text>{s.name}</Text>
                            <Text>{formatCurrency(s.price)}</Text>
                        </HStack>
                    ))}
                </Box>

                <Box>
                    <Text
                        fontWeight="bold"
                        mb={2}
                        borderBottomWidth="1px"
                        borderColor="black"
                    >
                        Peças
                    </Text>
                    {order.parts.map((item) => (
                        <HStack
                            key={item.partId}
                            justify="space-between"
                            py={1}
                        >
                            <Text>
                                {item.quantity}x {item.part.name}
                            </Text>
                            <Text>
                                {formatCurrency(
                                    item.part.price * item.quantity
                                )}
                            </Text>
                        </HStack>
                    ))}
                </Box>
            </Stack>

            <Separator borderColor="black" my={6} />

            <Stack align="flex-end" gap={1}>
                <Text>
                    Mão de Obra: {formatCurrency(order.totalServicesPrice || 0)}
                </Text>
                <Text>Peças: {formatCurrency(order.totalPartsPrice || 0)}</Text>
                <Heading size="md" mt={2}>
                    Total: {formatCurrency(order.totalPrice)}
                </Heading>
            </Stack>

            <Box
                mt={20}
                pt={4}
                borderTopWidth="1px"
                borderColor="black"
                w="50%"
                mx="auto"
                textAlign="center"
            >
                <Text fontSize="sm">Assinatura do Cliente</Text>
            </Box>
        </Box>
    );
});

OrderPrintTemplate.displayName = "OrderPrintTemplate";
