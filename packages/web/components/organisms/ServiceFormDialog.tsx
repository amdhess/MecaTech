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
import {Button, Input, Stack, Textarea} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {Service, CreateServiceDTO} from "@/types/service";
import toast from "react-hot-toast";
import {useEffect} from "react";

interface ServiceFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    serviceToEdit?: Service | null;
}

export function ServiceFormDialog({
    open,
    onClose,
    onSuccess,
    serviceToEdit,
}: ServiceFormDialogProps) {
    const isEditing = !!serviceToEdit;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors, isSubmitting},
    } = useForm<CreateServiceDTO>();

    useEffect(() => {
        if (open) {
            if (serviceToEdit) {
                setValue("name", serviceToEdit.name);
                setValue("price", serviceToEdit.price);
                setValue("description", serviceToEdit.description || "");
            } else {
                reset();
            }
        }
    }, [open, serviceToEdit, setValue, reset]);

    const onSubmit = async (data: CreateServiceDTO) => {
        try {
            const payload = {
                ...data,
                price: Number(data.price),
            };

            if (isEditing) {
                await api.patch(`/service/${serviceToEdit.id}`, payload);
                toast.success("Serviço atualizado com sucesso!");
            } else {
                await api.post("/service", payload);
                toast.success("Serviço cadastrado com sucesso!");
            }

            onSuccess();
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar serviço.");
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
                            {isEditing ? "Editar Serviço" : "Novo Serviço"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Atualize os dados do serviço."
                                : "Preencha os dados para cadastrar."}
                        </DialogDescription>
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
                                label="Preço Mão de Obra (R$)"
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
                            {isEditing ? "Salvar" : "Cadastrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </DialogRoot>
    );
}
