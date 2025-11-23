"use client";

import {Table} from "@/components/ui/table";
import {Part} from "@/types/part";
import {Badge, HStack, IconButton, Text} from "@chakra-ui/react";
import {Pencil, Trash2, AlertTriangle} from "lucide-react";

interface PartTableProps {
    parts: Part[];
}

export function PartTable({parts}: PartTableProps) {
    return (
        <Table.Root variant="line" size="sm">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Nome da Peça</Table.ColumnHeader>
                    <Table.ColumnHeader>SKU</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                        Preço Unit.
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                        Estoque
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                        Ações
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {parts.map((part) => {
                    const isLowStock = part.stock < 5;

                    return (
                        <Table.Row key={part.id}>
                            <Table.Cell fontWeight="medium">
                                {part.name}
                            </Table.Cell>
                            <Table.Cell
                                fontFamily="mono"
                                fontSize="xs"
                                color="fg.muted"
                            >
                                {part.sku}
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                                R$ {part.price.toFixed(2)}
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                                <HStack justify="flex-end">
                                    {isLowStock && (
                                        <Badge
                                            colorPalette="red"
                                            variant="solid"
                                            size="sm"
                                        >
                                            <AlertTriangle size={12} /> Baixo
                                        </Badge>
                                    )}
                                    <Text
                                        fontWeight={
                                            isLowStock ? "bold" : "normal"
                                        }
                                        color={isLowStock ? "red.600" : "fg"}
                                    >
                                        {part.stock}
                                    </Text>
                                </HStack>
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                                <HStack justify="flex-end" gap={1}>
                                    <IconButton
                                        size="xs"
                                        variant="ghost"
                                        aria-label="Editar"
                                    >
                                        <Pencil size={14} />
                                    </IconButton>
                                    <IconButton
                                        size="xs"
                                        variant="ghost"
                                        colorPalette="red"
                                        aria-label="Excluir"
                                    >
                                        <Trash2 size={14} />
                                    </IconButton>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
}
