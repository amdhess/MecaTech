"use client";

import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogDescription,
    DialogCloseTrigger,
} from "@/components/ui/dialog";
import {Button} from "@chakra-ui/react";
import {useState} from "react";

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title?: string;
    description?: string;
}

export function DeleteConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Confirmar Exclusão",
    description = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
}: DeleteConfirmDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm();
        setIsLoading(false);
        onClose();
    };

    return (
        <DialogRoot open={open} onOpenChange={(e) => !e.open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogCloseTrigger />
                </DialogHeader>
                <DialogBody>
                    <DialogDescription>{description}</DialogDescription>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={handleConfirm}
                        loading={isLoading}
                    >
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
}
