import {Flex, Icon, Text} from "@chakra-ui/react";
import {Wrench} from "lucide-react";

export function Logo() {
    return (
        <Flex align="center" gap={2}>
            <Icon asChild color="blue.500" boxSize={6}>
                <Wrench />
            </Icon>
            <Text fontSize="xl" fontWeight="bold" letterSpacing="tight">
                MecaTech
            </Text>
        </Flex>
    );
}
