"use client";

import {Table} from "@/components/ui/table";
import {Client} from "@/types/client";

interface ClientTableProps {
    clients: Client[];
}

export function ClientTable({clients}: ClientTableProps) {
    return (
        <Table.Root variant="line" size="sm">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Email</Table.ColumnHeader>
                    <Table.ColumnHeader>Phone</Table.ColumnHeader>
                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {clients.map((client) => (
                    <Table.Row key={client.id}>
                        <Table.Cell>{client.name}</Table.Cell>
                        <Table.Cell>{client.email}</Table.Cell>
                        <Table.Cell>{client.phone}</Table.Cell>
                        <Table.Cell>{/* actions buttons here */}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
