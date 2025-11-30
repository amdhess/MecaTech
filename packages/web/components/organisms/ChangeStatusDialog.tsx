"use client";

import {
    DialogRoot,
    DialogContent,
    DialogCloseTrigger,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
} from "@/components/ui/dialog";
import {Field} from "@/components/ui/field";
import {
    NativeSelectField,
    NativeSelectRoot,
} from "@/components/ui/native-select";
import {Button, Stack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {
    OrderStatus,
    OrderStatusLabel,
    ServiceOrder,
    UpdateOrderStatusDTO,
} from "@/types/order";
import toast from "react-hot-toast";
import {useEffect} from "react";

interface ChangeStatusDialogProps {
    open: boolean;
    onClose: () => void;
    order: ServiceOrder | null;
    onStatusUpdated: () => void;
}

export function ChangeStatusDialog({
    open,
    onClose,
    order,
    onStatusUpdated,
}: ChangeStatusDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {isSubmitting},
    } = useForm<UpdateOrderStatusDTO>();

    useEffect(() => {
        if (order) {
            setValue("status", order.status);
        }
    }, [order, setValue]);

    const onSubmit = async (data: UpdateOrderStatusDTO) => {
        if (!order) return;

        try {
            await api.patch(`/order/${order.id}`, data);
            toast.success(
                `Status atualizado para ${OrderStatusLabel[data.status]}`
            );
            onStatusUpdated();
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar status.");
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <DialogRoot open={open} onOpenChange={(e) => !e.open && handleClose()}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Atualizar Status da OS</DialogTitle>
                        <DialogCloseTrigger />
                    </DialogHeader>

                    <DialogBody>
                        <Stack gap={4}>
                            <Field label="Novo Status">
                                <NativeSelectRoot>
                                    <NativeSelectField
                                        {...register("status", {
                                            required: true,
                                        })}
                                    >
                                        {Object.values(OrderStatus).map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {OrderStatusLabel[status]}
                                                </option>
                                            )
                                        )}
                                    </NativeSelectField>
                                </NativeSelectRoot>
                            </Field>
                        </Stack>
                    </DialogBody>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            colorScheme="blue"
                            loading={isSubmitting}
                        >
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </DialogRoot>
    );
}
