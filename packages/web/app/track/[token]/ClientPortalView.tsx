"use client";

import {
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Separator,
  Stack,
  Table,
  Text,
  Badge,
} from "@chakra-ui/react";
import {
  ServiceOrder,
  OrderStatusLabel,
  OrderStatusColor,
  OrderStatus,
} from "@/types/order";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ClientPortalViewProps {
  order: ServiceOrder;
}

export function ClientPortalView({ order }: ClientPortalViewProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  const handleAction = async (action: "approve" | "reject") => {
    setIsProcessing(true);
    try {
      await api.patch(`/order/public/${order.publicToken}/${action}`);
      toast.success(
        action === "approve" ? "Orçamento Aprovado!" : "Orçamento Recusado.",
      );
      router.refresh();
    } catch {
      toast.error("Erro ao processar sua resposta.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isInteractive =
    order.status === OrderStatus.PENDING ||
    order.status === OrderStatus.WAITING;

  return (
    <Box minH="100vh" bg="bg.muted" py={10}>
      <Container maxW="container.md">
        <Stack gap={6}>
          <Card.Root shadow="md">
            <Card.Body>
              <Stack gap={4} align="center" textAlign="center">
                <FileText size={48} color="#3182ce" />
                <Heading size="2xl">Aprovação de Orçamento</Heading>
                <Text color="fg.muted">
                  Olá, {order.vehicle.client.name}. Revise os detalhes abaixo.
                </Text>
                <Badge
                  size="lg"
                  colorPalette={OrderStatusColor[order.status]}
                  variant="solid"
                >
                  Status: {OrderStatusLabel[order.status]}
                </Badge>
              </Stack>
            </Card.Body>
          </Card.Root>

          <Card.Root shadow="sm">
            <Card.Header>
              <Heading size="md">Detalhes do Serviço</Heading>
            </Card.Header>
            <Card.Body>
              <Stack gap={6}>
                <Box>
                  <Text fontWeight="bold">Veículo:</Text>
                  <Text>
                    {order.vehicle.brand} {order.vehicle.model} -{" "}
                    {order.vehicle.plate}
                  </Text>
                </Box>

                <Box borderWidth="1px" borderRadius="md" overflow="hidden">
                  <Table.Root size="sm">
                    <Table.Header>
                      <Table.Row bg="bg.subtle">
                        <Table.ColumnHeader>Item</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">
                          Valor
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {order.services.map((s) => (
                        <Table.Row key={s.id}>
                          <Table.Cell>{s.name}</Table.Cell>
                          <Table.Cell textAlign="end">
                            {formatCurrency(s.price)}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                      {order.parts.map((p) => (
                        <Table.Row key={p.partId}>
                          <Table.Cell>
                            {p.quantity}x {p.part.name}
                          </Table.Cell>
                          <Table.Cell textAlign="end">
                            {formatCurrency(p.part.price * p.quantity)}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>

                <HStack justify="space-between" fontSize="xl" fontWeight="bold">
                  <Text>Total Geral</Text>
                  <Text color="blue.600">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </HStack>
              </Stack>
            </Card.Body>

            {isInteractive && (
              <Card.Footer>
                <Stack
                  w="full"
                  direction={{ base: "column", sm: "row" }}
                  gap={4}
                >
                  <Button
                    flex={1}
                    variant="outline"
                    colorPalette="red"
                    onClick={() => handleAction("reject")}
                    disabled={isProcessing}
                  >
                    <XCircle /> Recusar Orçamento
                  </Button>
                  <Button
                    flex={1}
                    colorScheme="green"
                    onClick={() => handleAction("approve")}
                    loading={isProcessing}
                  >
                    <CheckCircle /> Aprovar Orçamento
                  </Button>
                </Stack>
              </Card.Footer>
            )}
          </Card.Root>
        </Stack>
      </Container>
    </Box>
  );
}
