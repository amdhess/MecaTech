"use client";

import {Box, Button, Heading, HStack, useDisclosure} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {Vehicle} from "@/types/vehicle";
import {Client} from "@/types/client";
import {VehicleTable} from "@/components/organisms/VehicleTable";
import {AddVehicleDialog} from "@/components/organisms/AddVehicleDialog";
import {Plus} from "lucide-react";

interface VehiclesViewProps {
    initialVehicles: Vehicle[];
    clients: Client[];
}

export function VehiclesView({
    initialVehicles: vehicles,
    clients,
}: VehiclesViewProps) {
    const {open, onOpen, onClose} = useDisclosure();
    const router = useRouter();

    const handleVehicleCreated = () => {
        router.refresh();
    };

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Veículos</Heading>
                <Button onClick={onOpen} colorScheme="blue">
                    <Plus /> Novo Veículo
                </Button>
            </HStack>

            <VehicleTable vehicles={vehicles} />

            <AddVehicleDialog
                open={open}
                onClose={onClose}
                clients={clients}
                onVehicleCreated={handleVehicleCreated}
            />
        </Box>
    );
}
