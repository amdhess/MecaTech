"use client";

import {NativeSelect as ChakraNativeSelect} from "@chakra-ui/react";
import {ChevronDown} from "lucide-react";
import * as React from "react";

export interface NativeSelectRootProps extends ChakraNativeSelect.RootProps {
    icon?: React.ReactNode;
}

export const NativeSelectRoot = React.forwardRef<
    HTMLDivElement,
    NativeSelectRootProps
>(function NativeSelectRoot(props, ref) {
    const {icon, children, ...rest} = props;
    return (
        <ChakraNativeSelect.Root ref={ref} {...rest}>
            {children}
            <ChakraNativeSelect.Indicator pointerEvents="none">
                {icon || <ChevronDown size="1em" />}
            </ChakraNativeSelect.Indicator>
        </ChakraNativeSelect.Root>
    );
});

export const NativeSelectField = ChakraNativeSelect.Field;
