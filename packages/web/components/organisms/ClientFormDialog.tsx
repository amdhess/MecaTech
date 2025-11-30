"use client";

import {
    DialogRoot,
    DialogContent,
    DialogCloseTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
} from "@/components/ui/dialog";
import {Field} from "@/components/ui/field";
import {Button, Input, Stack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {Client} from "@/types/client";
import toast from "react-hot-toast";
import {useEffect} from "react";
import {AxiosError} from "axios";

type FormData = {
    name: string;
    email: string;
    phone: string;
};

interface ClientFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    clientToEdit?: Client | null;
}

export function ClientFormDialog({
    open,
    onClose,
    onSuccess,
    clientToEdit,
}: ClientFormDialogProps) {
    const isEditing = !!clientToEdit;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors, isSubmitting},
    } = useForm<FormData>();

    useEffect(() => {
        if (open) {
            if (clientToEdit) {
                setValue("name", clientToEdit.name);
                setValue("email", clientToEdit.email || "");
                setValue("phone", clientToEdit.phone || "");
            } else {
                reset();
            }
        }
    }, [open, clientToEdit, setValue, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            if (isEditing) {
                await api.patch(`/client/${clientToEdit.id}`, data);
                toast.success("Cliente atualizado com sucesso!");
            } else {
                await api.post("/client", data);
                toast.success("Cliente cadastrado com sucesso!");
            }

            onSuccess();
            handleClose();
        } catch (error) {
            console.error(error);

            const axiosError = error as AxiosError<{
                message: string | string[];
            }>;

            const message = axiosError.response?.data?.message;

            const displayMessage = Array.isArray(message)
                ? message[0]
                : message;

            toast.error(displayMessage || "Ocorreu um erro ao salvar.");
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
                            {isEditing ? "Editar Cliente" : "Novo Cliente"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Atualize os dados do cliente."
                                : "Preencha os dados para cadastrar."}
                        </DialogDescription>
                        <DialogCloseTrigger />
                    </DialogHeader>

                    <DialogBody>
                        <Stack gap={4}>
                            <Field
                                label="Nome Completo"
                                invalid={!!errors.name}
                                errorText={errors.name?.message}
                            >
                                <Input
                                    {...register("name", {
                                        required: "Nome é obrigatório",
                                    })}
                                />
                            </Field>
                            <Field
                                label="Email"
                                invalid={!!errors.email}
                                errorText={errors.email?.message}
                            >
                                <Input type="email" {...register("email")} />
                            </Field>
                            <Field label="Telefone">
                                <Input {...register("phone")} />
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
