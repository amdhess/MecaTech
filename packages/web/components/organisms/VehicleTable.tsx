"use client";

import {Table} from "@/components/ui/table";
import {Vehicle} from "@/types/vehicle";
import {HStack, IconButton} from "@chakra-ui/react";
import {Pencil, Trash2} from "lucide-react";

interface VehicleTableProps {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicle: Vehicle) => void;
}

export function VehicleTable({vehicles, onEdit, onDelete}: VehicleTableProps) {
    return (
        <Table.Root variant="line" size="sm">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Placa</Table.ColumnHeader>
                    <Table.ColumnHeader>Modelo/Marca</Table.ColumnHeader>
                    <Table.ColumnHeader>Ano</Table.ColumnHeader>
                    <Table.ColumnHeader>Proprietário</Table.ColumnHeader>
                    <Table.ColumnHeader>Ações</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vehicles.map((vehicle) => (
                    <Table.Row key={vehicle.id}>
                        <Table.Cell fontWeight="medium">
                            {vehicle.plate}
                        </Table.Cell>
                        <Table.Cell>
                            {vehicle.model} - {vehicle.brand}
                        </Table.Cell>
                        <Table.Cell>{vehicle.year}</Table.Cell>
                        <Table.Cell>{vehicle.client?.name || "-"}</Table.Cell>
                        <Table.Cell>
                            <HStack gap={1}>
                                <IconButton
                                    size="xs"
                                    variant="ghost"
                                    aria-label="Editar"
                                    onClick={() => onEdit(vehicle)}
                                >
                                    <Pencil size={14} />
                                </IconButton>
                                <IconButton
                                    size="xs"
                                    variant="ghost"
                                    colorPalette="red"
                                    aria-label="Excluir"
                                    onClick={() => onDelete(vehicle)}
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
