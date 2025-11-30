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
import {
    NativeSelectField,
    NativeSelectRoot,
} from "@/components/ui/native-select";
import {Button, Input, Stack, HStack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {Vehicle, CreateVehicleDTO} from "@/types/vehicle";
import {Client} from "@/types/client";
import toast from "react-hot-toast";
import {useEffect} from "react";

interface VehicleFormDialogProps {
    open: boolean;
    onClose: () => void;
    clients: Client[];
    onSuccess: () => void;
    vehicleToEdit?: Vehicle | null;
}

export function VehicleFormDialog({
    open,
    onClose,
    clients,
    onSuccess,
    vehicleToEdit,
}: VehicleFormDialogProps) {
    const isEditing = !!vehicleToEdit;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors, isSubmitting},
    } = useForm<CreateVehicleDTO>();

    useEffect(() => {
        if (open) {
            if (vehicleToEdit) {
                setValue("plate", vehicleToEdit.plate);
                setValue("model", vehicleToEdit.model);
                setValue("brand", vehicleToEdit.brand);
                setValue("year", vehicleToEdit.year);
                setValue("color", vehicleToEdit.color || "");
                if (vehicleToEdit.client) {
                    setValue("clientId", vehicleToEdit.client.id);
                }
            } else {
                reset();
            }
        }
    }, [open, vehicleToEdit, setValue, reset]);

    const onSubmit = async (data: CreateVehicleDTO) => {
        try {
            const payload = {...data, year: Number(data.year)};

            if (isEditing) {
                await api.patch(`/vehicle/${vehicleToEdit.id}`, payload);
                toast.success("Veículo atualizado!");
            } else {
                await api.post("/vehicle", payload);
                toast.success("Veículo cadastrado!");
            }

            onSuccess();
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar veículo.");
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
                            {isEditing ? "Editar Veículo" : "Novo Veículo"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Atualize os dados do veículo."
                                : "Preencha os dados para cadastrar."}
                        </DialogDescription>
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
                                            required: "Obrigatório",
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
                                            required: "Obrigatório",
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
                                            required: "Obrigatório",
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
                                            required: "Obrigatório",
                                        })}
                                    />
                                </Field>
                                <Field
                                    label="Marca"
                                    invalid={!!errors.brand}
                                    errorText={errors.brand?.message}
                                >
                                    <Input
                                        {...register("brand", {
                                            required: "Obrigatório",
                                        })}
                                    />
                                </Field>
                            </HStack>

                            <Field label="Cor">
                                <Input {...register("color")} />
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
