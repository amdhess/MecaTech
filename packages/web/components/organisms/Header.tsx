"use client";

import { Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { LogOut, User } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { ColorModeButton } from "../ui/color-mode";
import { UserProfile } from "@/types/user";

interface HeaderProps {
  user: UserProfile | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  const userName = user?.name || "Visitante";

  const handleLogout = () => {
    Cookies.remove("mecatech_token");
    toast.success("Logout realizado com sucesso.");
    router.push("/login");
  };

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

      <HStack gap={4}>
        <ColorModeButton />
        <Text
          fontSize="sm"
          color="fg.muted"
          display={{ base: "none", md: "block" }}
        >
          Olá, {userName}
        </Text>

        <MenuRoot positioning={{ placement: "bottom-end" }}>
          <MenuTrigger cursor="pointer">
            <Avatar
              size="sm"
              src={user?.avatarUrl || undefined}
              name={userName}
            />
          </MenuTrigger>

          <MenuContent>
            <Link href="/profile" style={{ textDecoration: "none" }}>
              <MenuItem value="profile" cursor="pointer">
                <User size={16} /> Meu Perfil
              </MenuItem>
            </Link>
            <MenuItem
              value="logout"
              color="red.500"
              _hover={{ bg: "red.50", color: "red.600" }}
              onClick={handleLogout}
              cursor="pointer"
            >
              <LogOut size={16} /> Sair
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </HStack>
    </Flex>
  );
}
