"use client";

import {
    DialogRoot,
    DialogContent,
    DialogCloseTrigger,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {Field} from "@/components/ui/field";
import {Button, Input, Stack, HStack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {Part, CreatePartDTO} from "@/types/part";
import toast from "react-hot-toast";
import {useEffect} from "react";

interface PartFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    partToEdit?: Part | null;
}

export function PartFormDialog({
    open,
    onClose,
    onSuccess,
    partToEdit,
}: PartFormDialogProps) {
    const isEditing = !!partToEdit;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors, isSubmitting},
    } = useForm<CreatePartDTO>();

    useEffect(() => {
        if (open) {
            if (partToEdit) {
                setValue("name", partToEdit.name);
                setValue("sku", partToEdit.sku);
                setValue("stock", partToEdit.stock);
                setValue("price", partToEdit.price);
            } else {
                reset();
            }
        }
    }, [open, partToEdit, setValue, reset]);

    const onSubmit = async (data: CreatePartDTO) => {
        try {
            const payload = {
                ...data,
                stock: Number(data.stock),
                price: Number(data.price),
            };

            if (isEditing) {
                await api.patch(`/part/${partToEdit.id}`, payload);
                toast.success("Peça atualizada com sucesso!");
            } else {
                await api.post("/part", payload);
                toast.success("Peça cadastrada com sucesso!");
            }

            onSuccess();
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar peça.");
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
                    <DialogHeader flexDir={"column"}>
                        <DialogTitle>
                            {isEditing ? "Editar Peça" : "Nova Peça"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Atualize os dados do estoque."
                                : "Preencha os dados para cadastrar."}
                        </DialogDescription>
                        <DialogCloseTrigger />
                    </DialogHeader>

                    <DialogBody>
                        <Stack gap={4}>
                            <Field
                                label="Nome da Peça"
                                invalid={!!errors.name}
                                errorText={errors.name?.message}
                            >
                                <Input
                                    {...register("name", {
                                        required: "Nome obrigatório",
                                    })}
                                    placeholder="Ex: Filtro de Óleo"
                                />
                            </Field>

                            <Field
                                label="SKU (Código)"
                                invalid={!!errors.sku}
                                errorText={errors.sku?.message}
                            >
                                <Input
                                    {...register("sku", {
                                        required: "SKU obrigatório",
                                    })}
                                    placeholder="Ex: SKU-1234"
                                    textTransform="uppercase"
                                />
                            </Field>

                            <HStack gap={4}>
                                <Field
                                    label="Estoque"
                                    invalid={!!errors.stock}
                                    errorText={errors.stock?.message}
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        {...register("stock", {
                                            required: "Obrigatório",
                                            min: 0,
                                        })}
                                    />
                                </Field>

                                <Field
                                    label="Preço (R$)"
                                    invalid={!!errors.price}
                                    errorText={errors.price?.message}
                                >
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        {...register("price", {
                                            required: "Obrigatório",
                                            min: 0,
                                        })}
                                    />
                                </Field>
                            </HStack>
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
                            {isEditing ? "Salvar" : "Cadastrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </DialogRoot>
    );
}
