"use client";

import {
    Box,
    Button,
    Card,
    Center,
    Heading,
    Input,
    Stack,
    Text,
} from "@chakra-ui/react";
import {Field} from "@/components/ui/field";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {Logo} from "@/components/atoms/Logo";
import {AxiosError} from "axios";

type RegisterData = {
    name: string;
    email: string;
    password: string;
};

export default function RegisterPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<RegisterData>();

    const onSubmit = async (data: RegisterData) => {
        try {
            await api.post("/auth/register", data);
            toast.success("Conta criada! Faça login.");
            router.push("/login");
        } catch (error) {
            const axiosError = error as AxiosError<{
                message: string | string[];
            }>;
            const msg = axiosError.response?.data?.message;

            toast.error(
                Array.isArray(msg) ? msg[0] : msg || "Erro ao criar conta."
            );
        }
    };

    return (
        <Center h="100vh" bg="bg.muted">
            <Stack gap="6" align="center" maxW="sm" w="full">
                <Logo />
                <Card.Root w="full" size="lg" shadow="md">
                    <Card.Body>
                        <Stack
                            gap="6"
                            as="form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Stack gap="1">
                                <Heading size="xl" textAlign="center">
                                    Criar Conta
                                </Heading>
                                <Text color="fg.muted" textAlign="center">
                                    Comece a gerenciar sua oficina hoje
                                </Text>
                            </Stack>

                            <Stack gap="4">
                                <Field
                                    label="Nome da Oficina / Gerente"
                                    invalid={!!errors.name}
                                >
                                    <Input
                                        {...register("name", {required: true})}
                                    />
                                </Field>

                                <Field label="Email" invalid={!!errors.email}>
                                    <Input
                                        type="email"
                                        {...register("email", {required: true})}
                                    />
                                </Field>

                                <Field
                                    label="Senha"
                                    invalid={!!errors.password}
                                >
                                    <Input
                                        type="password"
                                        {...register("password", {
                                            required: true,
                                            minLength: 6,
                                        })}
                                    />
                                </Field>
                            </Stack>

                            <Button
                                type="submit"
                                colorScheme="blue"
                                loading={isSubmitting}
                                w="full"
                            >
                                Cadastrar
                            </Button>
                        </Stack>
                    </Card.Body>
                    <Card.Footer justifyContent="center">
                        <Text fontSize="sm">
                            Já tem conta?{" "}
                            <Link
                                href="/login"
                                style={{
                                    color: "var(--chakra-colors-blue-600)",
                                    fontWeight: "bold",
                                }}
                            >
                                Fazer Login
                            </Link>
                        </Text>
                    </Card.Footer>
                </Card.Root>
            </Stack>
        </Center>
    );
}
