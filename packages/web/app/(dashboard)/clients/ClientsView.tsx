"use client";

import {Box, Button, Heading, HStack, useDisclosure} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {Client} from "@/types/client";
import {ClientTable} from "@/components/organisms/ClientTable";
import {DeleteConfirmDialog} from "@/components/organisms/DeleteConfirmDialog";
import {Plus} from "lucide-react";
import {useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {ClientFormDialog} from "@/components/organisms/ClientFormDialog";
import {AxiosError} from "axios";

interface ClientsViewProps {
    initialClients: Client[];
}

export function ClientsView({initialClients}: ClientsViewProps) {
    const router = useRouter();

    const formDialog = useDisclosure();
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const deleteDialog = useDisclosure();
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    const handleCreate = () => {
        setEditingClient(null);
        formDialog.onOpen();
    };

    const handleEdit = (client: Client) => {
        setEditingClient(client);
        formDialog.onOpen();
    };

    const handleDeleteClick = (client: Client) => {
        setClientToDelete(client);
        deleteDialog.onOpen();
    };

    const handleConfirmDelete = async () => {
        if (!clientToDelete) return;
        try {
            await api.delete(`/client/${clientToDelete.id}`);

            toast.success("Cliente removido com sucesso.");
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

            toast.error(displayMessage || "Erro ao remover cliente.", {
                duration: 6000,
                style: {
                    minWidth: "250px",
                },
            });
        }
    };
    const handleSuccess = () => {
        router.refresh();
    };

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Clientes</Heading>
                <Button onClick={handleCreate} colorScheme="blue">
                    <Plus /> Novo Cliente
                </Button>
            </HStack>

            <ClientTable
                clients={initialClients}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <ClientFormDialog
                open={formDialog.open}
                onClose={formDialog.onClose}
                onSuccess={handleSuccess}
                clientToEdit={editingClient}
            />

            <DeleteConfirmDialog
                open={deleteDialog.open}
                onClose={deleteDialog.onClose}
                onConfirm={handleConfirmDelete}
                title={`Excluir ${clientToDelete?.name}?`}
                description="Tem certeza? Isso removerá o cliente e seus veículos. A operação será bloqueada se houver Ordens de Serviço (histórico financeiro ou em andamento) vinculadas a ele."
            />
        </Box>
    );
}
