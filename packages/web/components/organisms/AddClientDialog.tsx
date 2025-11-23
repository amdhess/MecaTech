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
import toast from "react-hot-toast";

type FormData = {
    name: string;
    email: string;
    phone: string;
};

interface AddClientDialogProps {
    open: boolean;
    onClose: () => void;
    onClientCreated: () => void; // Alterado para void (padrão novo)
}

export function AddClientDialog({
    open,
    onClose,
    onClientCreated,
}: AddClientDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            await api.post("/client", data);
            toast.success("Cliente cadastrado com sucesso!");
            onClientCreated(); // Apenas avisa
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao cadastrar cliente.");
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
                        <DialogTitle>Novo Cliente</DialogTitle>
                        <DialogDescription>
                            Preencha os dados abaixo para cadastrar um novo
                            cliente.
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
                                    placeholder="Ex: João da Silva"
                                />
                            </Field>

                            <Field
                                label="Email"
                                invalid={!!errors.email}
                                errorText={errors.email?.message}
                            >
                                <Input
                                    type="email"
                                    {...register("email", {
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Email inválido",
                                        },
                                    })}
                                    placeholder="Ex: joao@email.com"
                                />
                            </Field>

                            <Field label="Telefone / Celular">
                                <Input
                                    {...register("phone")}
                                    placeholder="Ex: (11) 99999-9999"
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
