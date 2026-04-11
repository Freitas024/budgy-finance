import { Bell, Wallet, Sun } from "lucide-react";
import { InputSearch } from "@/src/components/ui";

export function Header() {
    return (
        <header className="flex w-full items-center justify-between p-4 md:p-6 border-b border-[#2D2A54] bg-[#0C0A20] md:bg-transparent">
            {/* Logo Mobile */}
            <div className="flex md:hidden items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand shadow-[0_0_12px_rgba(108,99,245,0.4)]">
                    <Wallet className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-lg font-bold text-text-primary">Budgy</span>
            </div>

            {/* Busca Desktop */}
            <div className="hidden md:block">
                <InputSearch placeholder="Buscar transações..." />
            </div>

            <div className="flex items-center gap-4">
                {/* Botão de Tema Mobile */}
                <button
                    type="button"
                    className="md:hidden text-text-secondary transition-colors hover:text-text-primary"
                >
                    <Sun className="h-5 w-5" />
                </button>

                {/* Sino (Ambos) */}
                <button
                    type="button"
                    className="relative text-text-secondary transition-colors hover:text-text-primary"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
            </div>
        </header>
    );
}
