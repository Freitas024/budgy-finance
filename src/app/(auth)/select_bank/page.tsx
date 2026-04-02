"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Wallet, BadgeCheck } from "lucide-react";
import { Button } from "@/src/components/ui";
import { banks } from "@/src/config/bank";

export default function SelectBankPage() {
    const router = useRouter();
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    const toggleBank = (id: string) => {
        setSelectedBanks((prev) =>
            prev.includes(id)
                ? prev.filter((bankId) => bankId !== id)
                : [...prev, id]
        );
    };

    const handleConnect = () => {
        if (selectedBanks.length === 0) {
            setShowPopup(true);
        } else {
            // fluxo real de conexao com o banco
        }
    };

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <div className="flex flex-1 flex-col justify-center bg-auth-form-bg px-6 py-12 sm:px-12 lg:px-20 xl:px-28">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-12 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand shadow-[0_0_16px_rgba(108,99,245,0.4)]">
                            <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-text-primary">Budgy</span>
                    </div>

                    <div className="mb-8 relative">
                        <div className="mb-6 h-0.5 w-full rounded-full bg-border overflow-hidden">
                            <div className="h-full w-1/3 rounded-full bg-brand shadow-[0_0_10px_rgba(108,99,245,0.5)]"></div>
                        </div>
                        <h1 className="text-center text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                            Conecte suas contas
                        </h1>
                        <p className="mt-2 text-center text-sm leading-relaxed text-text-secondary">
                            Sincronização automática via Open Finance. Seguro e rápido.
                        </p>
                    </div>

                    <div className="mb-8 rounded-xl border border-[#2D2A54] bg-[#131033] p-5">
                        <div className="mb-3 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-brand" />
                            <h3 className="text-sm font-semibold text-text-primary text-white">Conexão Criptografada</h3>
                        </div>
                        <p className="text-xs leading-relaxed text-text-secondary">
                            Utilizamos tecnologia Open Finance. O Budgy não salva suas senhas bancárias e tem acesso apenas para leitura dos seus dados.
                        </p>
                    </div>

                    <div className="mb-8 grid grid-cols-2 gap-4">
                        {banks.map((bank) => {
                            const isSelected = selectedBanks.includes(bank.id);

                            return (
                                <button
                                    key={bank.id}
                                    type="button"
                                    onClick={() => toggleBank(bank.id)}
                                    className={`relative flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${isSelected
                                        ? "border-brand bg-brand/10"
                                        : "border-border bg-transparent hover:border-text-muted hover:bg-border/30"
                                        }`}
                                >
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bank.color}`}>
                                        <Building2 className={`h-4.5 w-4.5 ${bank.iconColor}`} />
                                    </div>
                                    <span className="text-sm font-medium text-text-primary">{bank.name}</span>
                                    {isSelected && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <BadgeCheck className="h-4.5 w-4.5 text-brand" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-10 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="!w-fit"
                            onClick={() => router.back()}
                        >
                            Voltar
                        </Button>
                        <Button
                            type="button"
                            className="flex-1"
                            onClick={handleConnect}
                        >
                            Conectar e Finalizar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-hero-start to-hero-end p-12 lg:flex xl:p-20">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-[120px]" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand/8 blur-[100px]" />

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary xl:text-4xl">
                        Inteligência financeira automatizada para o seu dia a dia.
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-text-secondary xl:text-lg">
                        Conecte suas contas uma vez e deixe que o Budgy cuide do resto.
                        Organização, insights e tranquilidade sem esforço manual.
                    </p>

                    <div className="mt-12 flex items-center gap-2">
                        <span className="h-1.5 w-8 rounded-full bg-brand" />
                        <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                        <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-[#2D2A54] bg-[#131033] p-6 text-center shadow-2xl">
                        <h3 className="mb-3 text-lg font-bold text-white">Oops! Quase lá...</h3>
                        <p className="mb-6 text-sm text-text-secondary leading-relaxed">
                            Por favor, escolha pelo menos um banco da lista para prosseguirmos. É rapidinho e super seguro! 😊
                        </p>
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => setShowPopup(false)}
                        >
                            Entendi!
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
