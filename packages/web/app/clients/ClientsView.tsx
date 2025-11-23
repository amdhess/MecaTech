"use client";

import {Box, Button, Heading, HStack, useDisclosure} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {Client} from "@/types/client";
import {ClientTable} from "@/components/organisms/ClientTable";
import {AddClientDialog} from "@/components/organisms/AddClientDialog";
import {Plus} from "lucide-react";

interface ClientsViewProps {
    initialClients: Client[];
}

export function ClientsView({initialClients}: ClientsViewProps) {
    const {open, onOpen, onClose} = useDisclosure();
    const router = useRouter();

    const handleClientCreated = () => {
        router.refresh();
    };

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Clientes</Heading>
                <Button onClick={onOpen} colorScheme="blue">
                    <Plus /> Novo Cliente
                </Button>
            </HStack>

            <ClientTable clients={initialClients} />

            <AddClientDialog
                open={open}
                onClose={onClose}
                onClientCreated={handleClientCreated}
            />
        </Box>
    );
}
