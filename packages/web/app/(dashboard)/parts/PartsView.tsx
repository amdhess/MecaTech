"use client";

import {Box, Button, Heading, HStack, useDisclosure} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {Part} from "@/types/part";
import {PartTable} from "@/components/organisms/PartTable";
import {PartFormDialog} from "@/components/organisms/PartFormDialog";
import {DeleteConfirmDialog} from "@/components/organisms/DeleteConfirmDialog";
import {Plus} from "lucide-react";
import {useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface PartsViewProps {
    initialParts: Part[];
}

export function PartsView({initialParts}: PartsViewProps) {
    const router = useRouter();

    const formDialog = useDisclosure();
    const deleteDialog = useDisclosure();
    const [editingPart, setEditingPart] = useState<Part | null>(null);
    const [partToDelete, setPartToDelete] = useState<Part | null>(null);

    const handleCreate = () => {
        setEditingPart(null);
        formDialog.onOpen();
    };

    const handleEdit = (part: Part) => {
        setEditingPart(part);
        formDialog.onOpen();
    };

    const handleSuccess = () => {
        router.refresh();
    };

    const handleDeleteClick = (part: Part) => {
        setPartToDelete(part);
        deleteDialog.onOpen();
    };

    const handleConfirmDelete = async () => {
        if (!partToDelete) return;
        try {
            await api.delete(`/part/${partToDelete.id}`);
            toast.success("Peça removida com sucesso.");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao remover peça. Verifique se está em uso.");
        }
    };

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Estoque de Peças</Heading>
                <Button onClick={handleCreate} colorScheme="blue">
                    <Plus /> Nova Peça
                </Button>
            </HStack>

            <PartTable
                parts={initialParts}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <PartFormDialog
                open={formDialog.open}
                onClose={formDialog.onClose}
                onSuccess={handleSuccess}
                partToEdit={editingPart}
            />

            <DeleteConfirmDialog
                open={deleteDialog.open}
                onClose={deleteDialog.onClose}
                onConfirm={handleConfirmDelete}
                title={`Excluir ${partToDelete?.name}?`}
                description="Tem certeza? Isso removerá a peça do estoque permanentemente."
            />
        </Box>
    );
}
