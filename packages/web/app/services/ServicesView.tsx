"use client";

import {Box, Button, Heading, HStack, useDisclosure} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {Service} from "@/types/service";
import {ServiceTable} from "@/components/organisms/ServiceTable";
import {AddServiceDialog} from "@/components/organisms/AddServiceDialog";
import {Plus} from "lucide-react";

interface ServicesViewProps {
    initialServices: Service[];
}

export function ServicesView({initialServices}: ServicesViewProps) {
    const {open, onOpen, onClose} = useDisclosure();
    const router = useRouter();

    const handleServiceCreated = () => {
        router.refresh();
    };

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Serviços (Mão de Obra)</Heading>
                <Button onClick={onOpen} colorScheme="blue">
                    <Plus /> Novo Serviço
                </Button>
            </HStack>

            <ServiceTable services={initialServices} />

            <AddServiceDialog
                open={open}
                onClose={onClose}
                onServiceCreated={handleServiceCreated}
            />
        </Box>
    );
}
