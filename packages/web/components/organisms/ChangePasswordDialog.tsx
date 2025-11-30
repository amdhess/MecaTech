"use client";

import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogCloseTrigger,
} from "@/components/ui/dialog";
import {Field} from "@/components/ui/field";
import {Button, Input, Stack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {AxiosError} from "axios";

interface ChangePasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

type PasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export function ChangePasswordDialog({
    open,
    onClose,
}: ChangePasswordDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<PasswordFormData>();

    const newPasswordValue = watch("newPassword");

    const onSubmit = async (data: PasswordFormData) => {
        try {
            await api.patch("/auth/password", {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            toast.success("Senha alterada com sucesso!");
            reset();
            onClose();
        } catch (error) {
            console.error(error);
            const axiosError = error as AxiosError<{
                message: string | string[];
            }>;
            const msg = axiosError.response?.data?.message;
            const displayMsg = Array.isArray(msg) ? msg[0] : msg;

            toast.error(displayMsg || "Erro ao alterar senha.");
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
                        <DialogTitle>Alterar Senha</DialogTitle>
                        <DialogCloseTrigger />
                    </DialogHeader>

                    <DialogBody>
                        <Stack gap={4}>
                            <Field
                                label="Senha Atual"
                                invalid={!!errors.currentPassword}
                                errorText={errors.currentPassword?.message}
                            >
                                <Input
                                    type="password"
                                    {...register("currentPassword", {
                                        required: "Obrigatório",
                                    })}
                                />
                            </Field>

                            <Field
                                label="Nova Senha"
                                invalid={!!errors.newPassword}
                                errorText={errors.newPassword?.message}
                            >
                                <Input
                                    type="password"
                                    {...register("newPassword", {
                                        required: "Obrigatório",
                                        minLength: {
                                            value: 6,
                                            message: "Mínimo 6 caracteres",
                                        },
                                    })}
                                />
                            </Field>

                            <Field
                                label="Confirmar Nova Senha"
                                invalid={!!errors.confirmPassword}
                                errorText={errors.confirmPassword?.message}
                            >
                                <Input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required: "Obrigatório",
                                        validate: (val) =>
                                            val === newPasswordValue ||
                                            "As senhas não conferem",
                                    })}
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
