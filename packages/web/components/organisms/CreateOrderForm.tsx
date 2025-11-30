"use client";

import {
    Box,
    Button,
    Heading,
    HStack,
    IconButton,
    Input,
    Stack,
    Text,
    Separator,
} from "@chakra-ui/react";
import {
    NativeSelectField,
    NativeSelectRoot,
} from "@/components/ui/native-select";
import {Field} from "@/components/ui/field";
import {useFieldArray, useForm} from "react-hook-form";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Vehicle} from "@/types/vehicle";
import {Part} from "@/types/part";
import {Service} from "@/types/service";
import {CreateOrderDTO} from "@/types/order";
import {Trash2, Plus} from "lucide-react";

interface CreateOrderFormProps {
    vehicles: Vehicle[];
    parts: Part[];
    services: Service[];
}

export function CreateOrderForm({
    vehicles,
    parts: inventoryParts,
    services,
}: CreateOrderFormProps) {
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<CreateOrderDTO>({
        defaultValues: {
            parts: [],
            serviceIds: [],
        },
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "parts",
    });

    const onSubmit = async (data: CreateOrderDTO) => {
        try {
            const cleanData = {
                ...data,
                parts: data.parts.filter((p) => p.partId !== ""),
            };

            cleanData.parts = cleanData.parts.map((p) => ({
                ...p,
                quantity: Number(p.quantity),
            }));

            await api.post("/order", cleanData);
            toast.success("Ordem de Serviço criada com sucesso!");
            router.push("/orders");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar OS. Verifique o estoque.");
        }
    };

    return (
        <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            bg="bg.panel"
            p={8}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            maxW="3xl"
            mx="auto"
        >
            <Stack gap={6}>
                <Heading size="md">Nova Ordem de Serviço</Heading>

                <Field
                    label="Veículo / Cliente"
                    invalid={!!errors.vehicleId}
                    errorText={errors.vehicleId?.message}
                >
                    <NativeSelectRoot>
                        <NativeSelectField
                            placeholder="Selecione o veículo..."
                            {...register("vehicleId", {
                                required: "Selecione um veículo",
                            })}
                        >
                            {vehicles.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.brand} {v.model} - {v.plate} (
                                    {v.client.name})
                                </option>
                            ))}
                        </NativeSelectField>
                    </NativeSelectRoot>
                </Field>

                <Separator />

                <Field label="Serviços (Mão de Obra)">
                    <Stack gap={2} p={4} borderWidth="1px" borderRadius="md">
                        {services.map((s) => (
                            <label
                                key={s.id}
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    value={s.id}
                                    {...register("serviceIds")}
                                    style={{width: "16px", height: "16px"}}
                                />
                                <Text>
                                    {s.name} (R$ {s.price.toFixed(2)})
                                </Text>
                            </label>
                        ))}
                    </Stack>
                </Field>

                <Separator />

                <Stack gap={4}>
                    <HStack justify="space-between">
                        <Text fontWeight="medium">Peças Utilizadas</Text>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => append({partId: "", quantity: 1})}
                        >
                            <Plus size={16} /> Adicionar Peça
                        </Button>
                    </HStack>

                    {fields.map((field, index) => (
                        <HStack key={field.id} align="flex-end">
                            <Field
                                label={index === 0 ? "Peça" : ""}
                                flex={1}
                                invalid={!!errors.parts?.[index]?.partId}
                            >
                                <NativeSelectRoot>
                                    <NativeSelectField
                                        placeholder="Selecione a peça..."
                                        {...register(
                                            `parts.${index}.partId` as const,
                                            {
                                                required: true,
                                            }
                                        )}
                                    >
                                        {inventoryParts.map((p) => (
                                            <option
                                                key={p.id}
                                                value={p.id}
                                                disabled={p.stock <= 0}
                                            >
                                                {p.name} (Estoque: {p.stock}) -
                                                R$ {p.price}
                                            </option>
                                        ))}
                                    </NativeSelectField>
                                </NativeSelectRoot>
                            </Field>

                            <Field
                                label={index === 0 ? "Qtd" : ""}
                                w="100px"
                                invalid={!!errors.parts?.[index]?.quantity}
                            >
                                <Input
                                    type="number"
                                    min={1}
                                    {...register(
                                        `parts.${index}.quantity` as const,
                                        {
                                            required: true,
                                            min: 1,
                                        }
                                    )}
                                />
                            </Field>

                            <IconButton
                                aria-label="Remover peça"
                                colorPalette="red"
                                variant="ghost"
                                onClick={() => remove(index)}
                                mb="1"
                            >
                                <Trash2 size={18} />
                            </IconButton>
                        </HStack>
                    ))}
                </Stack>

                <Separator />

                <HStack justify="flex-end" pt={4}>
                    <Button variant="ghost" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        loading={isSubmitting}
                    >
                        Criar Ordem de Serviço
                    </Button>
                </HStack>
            </Stack>
        </Box>
    );
}
