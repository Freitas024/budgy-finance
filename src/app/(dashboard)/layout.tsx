import { Sidebar } from "@/src/components/layout/sidebar";
import { Header } from "@/src/components/layout/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#040212] pb-20 md:pb-0">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                {children}
            </div>
        </div>
    );
}
