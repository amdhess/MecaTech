"use client";

import {Table} from "@/components/ui/table";
import {Service} from "@/types/service";
import {HStack, IconButton} from "@chakra-ui/react";
import {Pencil, Trash2} from "lucide-react";

interface ServiceTableProps {
    services: Service[];
}

export function ServiceTable({services}: ServiceTableProps) {
    return (
        <Table.Root variant="line" size="sm">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Serviço</Table.ColumnHeader>
                    <Table.ColumnHeader>Descrição</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                        Preço Mão de Obra
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                        Ações
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {services.map((service) => (
                    <Table.Row key={service.id}>
                        <Table.Cell fontWeight="medium">
                            {service.name}
                        </Table.Cell>
                        <Table.Cell color="fg.muted" truncate maxW="300px">
                            {service.description || "-"}
                        </Table.Cell>
                        <Table.Cell textAlign="end" fontWeight="medium">
                            R$ {service.price.toFixed(2)}
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
                ))}
            </Table.Body>
        </Table.Root>
    );
}
