import {Provider} from "@/components/ui/provider";
import "./globals.css";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "MecaTech",
    description: "Sistema de Gestão para Oficinas",
};

export default function RootLayout(props: {children: React.ReactNode}) {
    const {children} = props;
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
