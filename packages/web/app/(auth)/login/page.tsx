"use client";

import {
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
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import {Logo} from "@/components/atoms/Logo";

type LoginData = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<LoginData>();

    const onSubmit = async (data: LoginData) => {
        try {
            const response = await api.post("/auth/login", data);
            const {access_token} = response.data;

            Cookies.set("mecatech_token", access_token, {expires: 1});

            toast.success("Login realizado com sucesso!");
            router.push("/");
        } catch (error) {
            console.error(error);
            toast.error("Email ou senha inválidos.");
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
                                <Heading size="2xl" textAlign="center">
                                    Bem-vindo
                                </Heading>
                                <Text color="fg.muted" textAlign="center">
                                    Faça login para acessar o sistema
                                </Text>
                            </Stack>

                            <Stack gap="4">
                                <Field
                                    label="Email"
                                    invalid={!!errors.email}
                                    errorText={errors.email?.message as string}
                                >
                                    <Input
                                        type="email"
                                        placeholder="seu@email.com"
                                        {...register("email", {
                                            required: "Email obrigatório",
                                        })}
                                    />
                                </Field>

                                <Field
                                    label="Senha"
                                    invalid={!!errors.password}
                                    errorText={
                                        errors.password?.message as string
                                    }
                                >
                                    <Input
                                        type="password"
                                        placeholder="******"
                                        {...register("password", {
                                            required: "Senha obrigatória",
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
                                Entrar
                            </Button>
                        </Stack>
                    </Card.Body>
                    <Card.Footer justifyContent="center">
                        <Text fontSize="sm">
                            Não tem conta?{" "}
                            <Link
                                href="/register"
                                style={{
                                    color: "var(--chakra-colors-blue-600)",
                                    fontWeight: "bold",
                                }}
                            >
                                Criar conta
                            </Link>
                        </Text>
                    </Card.Footer>
                </Card.Root>
            </Stack>
        </Center>
    );
}
