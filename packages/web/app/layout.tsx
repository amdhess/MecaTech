import {Provider} from "@/components/ui/provider";
import {DashboardLayout} from "@/components/templates/DashboardLayout";
import "./globals.css";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "MecaTech",
    description: "Workshop Management System",
};

export default function RootLayout(props: {children: React.ReactNode}) {
    const {children} = props;
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Provider>
                    <DashboardLayout>{children}</DashboardLayout>
                </Provider>
            </body>
        </html>
    );
}
