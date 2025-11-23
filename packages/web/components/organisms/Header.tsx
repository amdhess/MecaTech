"use client";

import {Flex, Heading} from "@chakra-ui/react";

export function Header() {
    return (
        <Flex
            as="header"
            h="16"
            align="center"
            justify="space-between"
            px={8}
            bg="bg.panel"
            borderBottomWidth="1px"
            borderColor="border.subtle"
        >
            <Heading size="sm">Oficina MecaTech</Heading>

            {/* Área do Usuário (Placeholder) */}
        </Flex>
    );
}
