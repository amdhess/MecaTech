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
import {Button, Input, Stack, HStack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {CreateVehicleDTO} from "@/types/vehicle";
import {Client} from "@/types/client";
import toast from "react-hot-toast";

interface AddVehicleDialogProps {
    open: boolean;
    onClose: () => void;
    clients: Client[];
    onVehicleCreated: () => void;
}

export function AddVehicleDialog({
    open,
    onClose,
    clients,
    onVehicleCreated,
}: AddVehicleDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<CreateVehicleDTO>();

    const onSubmit = async (data: CreateVehicleDTO) => {
        try {
            const payload = {...data, year: Number(data.year)};
            await api.post("/vehicle", payload);

            toast.success("Veículo cadastrado com sucesso!");

            onVehicleCreated();

            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao cadastrar veículo.");
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
                        <DialogTitle>Novo Veículo</DialogTitle>
                        <DialogCloseTrigger />
                    </DialogHeader>

                    <DialogBody>
                        <Stack gap={4}>
                            <Field
                                label="Proprietário"
                                invalid={!!errors.clientId}
                                errorText={errors.clientId?.message}
                            >
                                <NativeSelectRoot>
                                    <NativeSelectField
                                        placeholder="Selecione o cliente..."
                                        {...register("clientId", {
                                            required:
                                                "O proprietário é obrigatório",
                                        })}
                                    >
                                        {clients.map((client) => (
                                            <option
                                                key={client.id}
                                                value={client.id}
                                            >
                                                {client.name}
                                            </option>
                                        ))}
                                    </NativeSelectField>
                                </NativeSelectRoot>
                            </Field>

                            <HStack gap={4}>
                                <Field
                                    label="Placa"
                                    invalid={!!errors.plate}
                                    errorText={errors.plate?.message}
                                >
                                    <Input
                                        {...register("plate", {
                                            required: "Placa obrigatória",
                                        })}
                                        placeholder="ABC-1234"
                                        textTransform="uppercase"
                                    />
                                </Field>
                                <Field
                                    label="Ano"
                                    invalid={!!errors.year}
                                    errorText={errors.year?.message}
                                >
                                    <Input
                                        type="number"
                                        {...register("year", {
                                            required: "Ano obrigatório",
                                        })}
                                    />
                                </Field>
                            </HStack>

                            <HStack gap={4}>
                                <Field
                                    label="Modelo"
                                    invalid={!!errors.model}
                                    errorText={errors.model?.message}
                                >
                                    <Input
                                        {...register("model", {
                                            required: "Modelo obrigatório",
                                        })}
                                        placeholder="Ex: Gol 1.0"
                                    />
                                </Field>
                                <Field
                                    label="Marca"
                                    invalid={!!errors.brand}
                                    errorText={errors.brand?.message}
                                >
                                    <Input
                                        {...register("brand", {
                                            required: "Marca obrigatória",
                                        })}
                                        placeholder="Ex: VW"
                                    />
                                </Field>
                            </HStack>

                            <Field label="Cor">
                                <Input
                                    {...register("color")}
                                    placeholder="Ex: Prata"
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
