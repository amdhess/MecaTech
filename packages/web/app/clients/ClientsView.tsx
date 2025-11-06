"use client";

import {Box, Button, Heading, Stack, useDisclosure} from "@chakra-ui/react";
import {useState} from "react";
import {Client} from "@/types/client";
import {ClientTable} from "@/components/organisms/ClientTable";
import {AddClientDialog} from "@/components/organisms/AddClientDialog";

interface ClientsViewProps {
    initialData: Client[];
}

export function ClientsView({initialData}: ClientsViewProps) {
    const [clients, setClients] = useState<Client[]>(initialData);

    const {open, onOpen, onClose} = useDisclosure();

    const handleClientCreated = (newClient: Client) => {
        setClients((currentClients) => [...currentClients, newClient]);
    };

    return (
        <Box p={8}>
            <Stack
                direction="row"
                justify="space-between"
                align="center"
                mb={8}
            >
                <Heading size="lg">Clients</Heading>
                <Button colorScheme="blue" onClick={onOpen}>
                    Add New Client
                </Button>
            </Stack>

            <ClientTable clients={clients} />

            <AddClientDialog
                open={open}
                onClose={onClose}
                onClientCreated={handleClientCreated}
            />
        </Box>
    );
}
