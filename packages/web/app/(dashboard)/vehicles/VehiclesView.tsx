"use client";

import {Box, Button, Heading, HStack, useDisclosure} from "@chakra-ui/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Vehicle} from "@/types/vehicle";
import {Client} from "@/types/client";
import {VehicleTable} from "@/components/organisms/VehicleTable";
import {VehicleFormDialog} from "@/components/organisms/VehicleFormDialog";
import {DeleteConfirmDialog} from "@/components/organisms/DeleteConfirmDialog";
import {Plus} from "lucide-react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {AxiosError} from "axios";
interface VehiclesViewProps {
    initialVehicles: Vehicle[];
    clients: Client[];
}

export function VehiclesView({
    initialVehicles: vehicles,
    clients,
}: VehiclesViewProps) {
    const router = useRouter();

    const formDialog = useDisclosure();
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const deleteDialog = useDisclosure();
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(
        null
    );

    const handleCreate = () => {
        setEditingVehicle(null);
        formDialog.onOpen();
    };

    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        formDialog.onOpen();
    };

    const handleSuccess = () => {
        router.refresh();
    };

    const handleDeleteClick = (vehicle: Vehicle) => {
        setVehicleToDelete(vehicle);
        deleteDialog.onOpen();
    };

    const handleConfirmDelete = async () => {
        if (!vehicleToDelete) return;
        try {
            await api.delete(`/vehicle/${vehicleToDelete.id}`);

            toast.success("Veículo removido com sucesso.");
            router.refresh();
        } catch (error) {
            console.error(error);

            const axiosError = error as AxiosError<{
                message: string | string[];
            }>;
            const backendMessage = axiosError.response?.data?.message;
            const displayMessage = Array.isArray(backendMessage)
                ? backendMessage[0]
                : backendMessage;

            toast.error(displayMessage || "Erro ao remover veículo.", {
                duration: 6000,
                style: {minWidth: "250px"},
            });
        }
    };

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Veículos</Heading>
                <Button onClick={handleCreate} colorScheme="blue">
                    <Plus /> Novo Veículo
                </Button>
            </HStack>

            <VehicleTable
                vehicles={vehicles}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <VehicleFormDialog
                open={formDialog.open}
                onClose={formDialog.onClose}
                clients={clients}
                onSuccess={handleSuccess}
                vehicleToEdit={editingVehicle}
            />

            <DeleteConfirmDialog
                open={deleteDialog.open}
                onClose={deleteDialog.onClose}
                onConfirm={handleConfirmDelete}
                title={`Excluir ${vehicleToDelete?.model}?`}
                description="Tem certeza? A operação será bloqueada se houver Ordens de Serviço (histórico financeiro ou em andamento) vinculadas a este veículo."
            />
        </Box>
    );
}
