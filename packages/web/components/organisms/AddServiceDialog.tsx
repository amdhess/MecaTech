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
import {Button, Input, Stack, Textarea} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {CreateServiceDTO} from "@/types/service";
import toast from "react-hot-toast";

interface AddServiceDialogProps {
    open: boolean;
    onClose: () => void;
    onServiceCreated: () => void;
}

export function AddServiceDialog({
    open,
    onClose,
    onServiceCreated,
}: AddServiceDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<CreateServiceDTO>();

    const onSubmit = async (data: CreateServiceDTO) => {
        try {
            const payload = {
                ...data,
                price: Number(data.price),
            };

            await api.post("/service", payload);
            toast.success("Serviço cadastrado com sucesso!");
            onServiceCreated();
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao cadastrar serviço.");
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
                        <DialogTitle>Novo Serviço</DialogTitle>
                        <DialogCloseTrigger />
                    </DialogHeader>

                    <DialogBody>
                        <Stack gap={4}>
                            <Field
                                label="Nome do Serviço"
                                invalid={!!errors.name}
                                errorText={errors.name?.message}
                            >
                                <Input
                                    {...register("name", {
                                        required: "Nome obrigatório",
                                    })}
                                    placeholder="Ex: Troca de Óleo"
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
                                        required: "Preço obrigatório",
                                        min: 0,
                                    })}
                                />
                            </Field>

                            <Field label="Descrição (Opcional)">
                                <Textarea
                                    {...register("description")}
                                    placeholder="Detalhes sobre o serviço..."
                                    resize="none"
                                />
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
