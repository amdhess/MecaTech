"use client";

import {
    Box,
    Heading,
    Stack,
    Text,
    Separator,
    Avatar,
    Card,
    Input,
    Button,
} from "@chakra-ui/react";
import {Field} from "@/components/ui/field";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {ChangePasswordDialog} from "@/components/organisms/ChangePasswordDialog";
import {useDisclosure} from "@chakra-ui/react";

type UserProfile = {
    userId: string;
    name: string;
    email: string;
};

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const {open, onOpen, onClose} = useDisclosure();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data);
            } catch (error) {
                console.error("Erro ao carregar perfil", error);
                toast.error("Erro ao carregar dados do usuário.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <Box p={8}>
                <Text>Carregando perfil...</Text>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box p={8}>
                <Text>Usuário não encontrado.</Text>
            </Box>
        );
    }

    return (
        <Box maxW="container.md" mx="auto">
            <Heading size="lg" mb={6}>
                Meu Perfil
            </Heading>

            <Card.Root>
                <Card.Body>
                    <Stack
                        gap={6}
                        align="center"
                        direction={{base: "column", sm: "row"}}
                    >
                        <Avatar.Root size="2xl">
                            <Avatar.Image src="" />{" "}
                            <Avatar.Fallback name={user.name} />
                        </Avatar.Root>

                        <Stack gap={1} flex={1}>
                            <Heading size="md">{user.name}</Heading>
                            <Text color="fg.muted">{user.email}</Text>
                            <Text fontSize="xs" color="fg.muted">
                                ID: {user.userId}
                            </Text>
                        </Stack>
                    </Stack>

                    <Separator my={6} />

                    <Stack gap={4} maxW="md">
                        <Heading size="sm">Dados da Conta</Heading>

                        <Field label="Nome" disabled>
                            <Input defaultValue={user.name} />
                        </Field>

                        <Field label="Email" disabled>
                            <Input defaultValue={user.email} />
                        </Field>

                        <Button
                            colorScheme="blue"
                            variant="outline"
                            onClick={onOpen}
                        >
                            Alterar Senha
                        </Button>
                    </Stack>
                </Card.Body>
            </Card.Root>
            <ChangePasswordDialog open={open} onClose={onClose} />
        </Box>
    );
}
