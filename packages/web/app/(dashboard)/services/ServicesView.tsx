"use client";

import {Box, Button, Heading, HStack, useDisclosure} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {Service} from "@/types/service";
import {ServiceTable} from "@/components/organisms/ServiceTable";
import {ServiceFormDialog} from "@/components/organisms/ServiceFormDialog";
import {DeleteConfirmDialog} from "@/components/organisms/DeleteConfirmDialog";
import {Plus} from "lucide-react";
import {useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface ServicesViewProps {
    initialServices: Service[];
}

export function ServicesView({initialServices}: ServicesViewProps) {
    const router = useRouter();

    const formDialog = useDisclosure();
    const deleteDialog = useDisclosure();
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(
        null
    );

    const handleCreate = () => {
        setEditingService(null);
        formDialog.onOpen();
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        formDialog.onOpen();
    };

    const handleSuccess = () => {
        router.refresh();
    };

    const handleDeleteClick = (service: Service) => {
        setServiceToDelete(service);
        deleteDialog.onOpen();
    };

    const handleConfirmDelete = async () => {
        if (!serviceToDelete) return;
        try {
            await api.delete(`/service/${serviceToDelete.id}`);
            toast.success("Serviço removido com sucesso.");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(
                "Erro ao remover serviço. Verifique se está em uso em alguma OS."
            );
        }
    };

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Serviços (Mão de Obra)</Heading>
                <Button onClick={handleCreate} colorScheme="blue">
                    <Plus /> Novo Serviço
                </Button>
            </HStack>

            <ServiceTable
                services={initialServices}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <ServiceFormDialog
                open={formDialog.open}
                onClose={formDialog.onClose}
                onSuccess={handleSuccess}
                serviceToEdit={editingService}
            />

            <DeleteConfirmDialog
                open={deleteDialog.open}
                onClose={deleteDialog.onClose}
                onConfirm={handleConfirmDelete}
                title={`Excluir ${serviceToDelete?.name}?`}
                description="Tem certeza? O serviço será removido permanentemente."
            />
        </Box>
    );
}
