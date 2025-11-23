"use client";

import {HStack, Icon, Text} from "@chakra-ui/react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {LucideIcon} from "lucide-react";

interface NavItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

export function NavItem({icon, label, href}: NavItemProps) {
    const pathname = usePathname();
    const isActive =
        pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <Link href={href} style={{textDecoration: "none"}}>
            <HStack
                gap={3}
                px={3}
                py={2}
                rounded="md"
                transition="all 0.2s"
                color={isActive ? "blue.600" : "fg.muted"}
                bg={isActive ? "blue.50" : "transparent"}
                _hover={{
                    bg: isActive ? "blue.100" : "gray.100",
                    color: isActive ? "blue.700" : "blue.600",
                }}
            >
                <Icon as={icon} boxSize={5} />
                <Text fontWeight="medium" fontSize="sm">
                    {label}
                </Text>
            </HStack>
        </Link>
    );
}
