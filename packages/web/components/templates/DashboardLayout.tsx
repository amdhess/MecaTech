"use client";

import { Box, Flex } from "@chakra-ui/react";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Header } from "@/components/organisms/Header";
import { UserProfile } from "@/types/user";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserProfile;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <Flex minH="100vh" bg="bg.canvas">
      <Box display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>

      <Flex direction="column" flex="1" w="full">
        <Header user={user} />

        <Box as="main" flex="1" p={8}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
