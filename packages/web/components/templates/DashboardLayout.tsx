"use client";

import {Box, Flex} from "@chakra-ui/react";
import {Sidebar} from "@/components/organisms/Sidebar";
import {Header} from "@/components/organisms/Header";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({children}: DashboardLayoutProps) {
    return (
        <Flex minH="100vh" bg="bg.canvas">
            <Box display={{base: "none", md: "block"}}>
                <Sidebar />
            </Box>

            <Flex direction="column" flex="1" w="full">
                <Header />

                <Box as="main" flex="1" p={8}>
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
}
