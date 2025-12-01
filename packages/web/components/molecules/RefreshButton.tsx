"use client";

import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";

export function RefreshButton(props: IconButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);

    router.refresh();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Tooltip content="Atualizar dados">
      <IconButton
        aria-label="Atualizar dados"
        variant="ghost"
        colorPalette="gray"
        onClick={handleRefresh}
        loading={isRefreshing}
        disabled={isRefreshing}
        {...props}
      >
        <RotateCw />
      </IconButton>
    </Tooltip>
  );
}
