"use client";

import {Box, Button, Heading, HStack, useDisclosure} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {Part} from "@/types/part";
import {PartTable} from "@/components/organisms/PartTable";
import {AddPartDialog} from "@/components/organisms/AddPartDialog";
import {Plus} from "lucide-react";

interface PartsViewProps {
    initialParts: Part[];
}

export function PartsView({initialParts}: PartsViewProps) {
    const {open, onOpen, onClose} = useDisclosure();
    const router = useRouter();

    const handlePartCreated = () => {
        router.refresh();
    };

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Estoque de Peças</Heading>
                <Button onClick={onOpen} colorScheme="blue">
                    <Plus /> Nova Peça
                </Button>
            </HStack>

            <PartTable parts={initialParts} />

            <AddPartDialog
                open={open}
                onClose={onClose}
                onPartCreated={handlePartCreated}
            />
        </Box>
    );
}
