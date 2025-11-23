"use client";

import {Table} from "@/components/ui/table";
import {Client} from "@/types/client";
import {HStack, IconButton} from "@chakra-ui/react";
import {Pencil, Trash2} from "lucide-react";

interface ClientTableProps {
    clients: Client[];
}

export function ClientTable({clients}: ClientTableProps) {
    return (
        <Table.Root variant="line" size="sm">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Nome</Table.ColumnHeader>
                    <Table.ColumnHeader>Email</Table.ColumnHeader>
                    <Table.ColumnHeader>Telefone</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                        Ações
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {clients.map((client) => (
                    <Table.Row key={client.id}>
                        <Table.Cell fontWeight="medium">
                            {client.name}
                        </Table.Cell>
                        <Table.Cell color="fg.muted">
                            {client.email || "-"}
                        </Table.Cell>
                        <Table.Cell>{client.phone || "-"}</Table.Cell>
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
