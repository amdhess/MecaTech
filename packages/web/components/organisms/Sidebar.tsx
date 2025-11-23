"use client";

import {Stack} from "@chakra-ui/react";
import {Logo} from "@/components/atoms/Logo";
import {NavItem} from "@/components/molecules/NavItem";
import {
    LayoutDashboard,
    Users,
    Car,
    Package,
    Wrench,
    ClipboardList,
} from "lucide-react";

const NAV_ITEMS = [
    {label: "Dashboard", href: "/", icon: LayoutDashboard},
    {label: "Ordens de Serviço", href: "/orders", icon: ClipboardList},
    {label: "Clientes", href: "/clients", icon: Users},
    {label: "Veículos", href: "/vehicles", icon: Car},
    {label: "Estoque", href: "/parts", icon: Package},
    {label: "Serviços", href: "/services", icon: Wrench},
];

export function Sidebar() {
    return (
        <Stack
            gap={8}
            w="64"
            h="100vh"
            p={6}
            borderRightWidth="1px"
            borderColor="border.subtle"
            bg="bg.panel"
            position="sticky"
            top={0}
        >
            <Logo />

            <Stack gap={1}>
                {NAV_ITEMS.map((item) => (
                    <NavItem key={item.href} {...item} />
                ))}
            </Stack>
        </Stack>
    );
}
