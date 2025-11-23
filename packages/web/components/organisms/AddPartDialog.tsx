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
import {Button, Input, Stack, HStack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {CreatePartDTO} from "@/types/part";
import toast from "react-hot-toast";

interface AddPartDialogProps {
    open: boolean;
    onClose: () => void;
    onPartCreated: () => void;
}

export function AddPartDialog({
    open,
    onClose,
    onPartCreated,
}: AddPartDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<CreatePartDTO>();

    const onSubmit = async (data: CreatePartDTO) => {
        try {
            const payload = {
                ...data,
                stock: Number(data.stock),
                price: Number(data.price),
            };

            await api.post("/part", payload);
            toast.success("Peça cadastrada com sucesso!");
            onPartCreated();
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao cadastrar peça.");
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
                        <DialogTitle>Nova Peça</DialogTitle>
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
                                    label="Estoque Inicial"
                                    invalid={!!errors.stock}
                                    errorText={errors.stock?.message}
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        {...register("stock", {
                                            required: "Estoque obrigatório",
                                            min: 0,
                                        })}
                                    />
                                </Field>

                                <Field
                                    label="Preço de Venda (R$)"
                                    invalid={!!errors.price}
                                    errorText={errors.price?.message}
                                >
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        {...register("price", {
                                            required: "Preço obrigatório",
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
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </DialogRoot>
    );
}
