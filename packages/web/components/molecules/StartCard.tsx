import {Box, Flex, Heading, Icon, Text} from "@chakra-ui/react";
import {LucideIcon} from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
}

export function StatCard({label, value, icon, color = "blue"}: StatCardProps) {
    return (
        <Box
            bg="bg.panel"
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            shadow="sm"
        >
            <Flex justify="space-between" align="start">
                <Box>
                    <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                        {label}
                    </Text>
                    <Heading size="2xl" mt={2}>
                        {value}
                    </Heading>
                </Box>
                <Box
                    p={2}
                    bg={`${color}.50`}
                    color={`${color}.600`}
                    borderRadius="md"
                >
                    <Icon as={icon} boxSize={6} />
                </Box>
            </Flex>
        </Box>
    );
}
