"use client";

import { useState, useEffect } from "react";
import { Plus, ShieldCheck, MoreHorizontal, CheckCircle2, Building2, X, BadgeCheck, Trash2 } from "lucide-react";
import { Button, Card } from "@/src/components/ui";
import { createClient } from "@/src/lib/supabase/client";
import { banks } from "@/src/config/bank";
import dynamic from "next/dynamic";

// Usando o dynamic do next para impedir que SSR quebre a build do iframe
const PluggyConnect = dynamic(
    () => import("react-pluggy-connect").then((mod) => mod.PluggyConnect),
    { ssr: false }
);

type Account = {
    id: string;
    bank_name: string;
    bank_slug: string;
    balance: number;
    status: string;
    synced_at: string | null;
    created_at: string;
};

export default function ContasPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [saving, setSaving] = useState(false);
    const [connectToken, setConnectToken] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const supabase = createClient();
        const { data } = await supabase.from("accounts").select("*");
        if (data) setAccounts(data);
    }

    const handleDeleteAccount = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta conta? Todas as transações atreladas a ela também serão excluídas.")) return;

        setDropdownOpen(null);
        const supabase = createClient();

        await supabase.from("transactions").delete().eq("account_id", id);
        await supabase.from("accounts").delete().eq("id", id);

        fetchData();
    };

    const handleOpenConnect = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/pluggy");
            const data = await res.json();
            if (data.accessToken) {
                setConnectToken(data.accessToken);
            } else {
                alert("Erro ao puxar token: " + (data.error || "Tente novamente."));
            }
        } catch (error) {
            console.error("Failed to load Pluggy Connect", error);
            alert("Falha na conexão com a Pluggy.");
        }
        setSaving(false);
    };

    const handlePluggySuccess = async (itemData: any) => {
        setConnectToken("");
        setSaving(true);

        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && itemData?.item?.id) {
            try {
                await fetch("/api/pluggy/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: itemData.item.id })
                });
            } catch (error) {
                console.error(error);
                alert("Falha ao sincronizar as transações.");
            }
        }

        fetchData();
        setSaving(false);
    };

    const getBankColor = (slug: string) => {
        return banks.find((b) => b.id === slug)?.color ?? "bg-[#2D2A54]";
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white xl:text-3xl">Contas Bancárias</h1>
                        <p className="mt-1 text-sm text-text-secondary">Gerencie suas conexões e sincronização.</p>
                    </div>
                    <div>
                        <Button
                            icon={<Plus className="h-4 w-4" />}
                            iconPosition="left"
                            className="!w-fit"
                            onClick={handleOpenConnect}
                            disabled={saving}
                        >
                            {saving ? "Sincronizando Transações..." : "Conectar nova conta"}
                        </Button>
                    </div>
                </div>

                <div className="mb-8 flex items-start gap-4 rounded-xl border border-[#2D2A54] bg-[#131033] p-5 md:items-center">
                    <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand md:mt-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-white">Sincronização Segura Ativa</h4>
                        <p className="mt-1 text-xs text-text-secondary">
                            Suas contas estão conectadas via Open Finance utilizando criptografia bancária. Atualização automática acontece a cada 4 horas.
                        </p>
                    </div>
                </div>

                {accounts.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                        <Building2 className="h-12 w-12 text-text-secondary" />
                        <div>
                            <h3 className="font-bold text-white">Nenhuma conta conectada</h3>
                            <p className="mt-1 text-sm text-text-secondary">
                                Conecte sua primeira conta bancária para começar.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {accounts.map((account) => (
                            <Card key={account.id} className="flex flex-col gap-6 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getBankColor(account.bank_slug)}`}>
                                            <Building2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{account.bank_name}</h3>
                                            <p className="text-xs text-text-secondary">Conta Corrente</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button
                                            className="text-text-secondary hover:text-text-primary"
                                            onClick={() => setDropdownOpen(dropdownOpen === account.id ? null : account.id)}
                                        >
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>

                                        {dropdownOpen === account.id && (
                                            <div className="absolute right-0 top-8 z-10 w-44 rounded-lg border border-[#2D2A54] bg-[#0C0A20] p-1 shadow-xl">
                                                <button
                                                    onClick={() => handleDeleteAccount(account.id)}
                                                    className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Excluir Conta
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-1 text-sm text-text-secondary">Saldo disponível</p>
                                    <h2 className="text-2xl font-bold text-white">{formatCurrency(account.balance)}</h2>
                                </div>

                                <div className="border-t border-[#2D2A54] pt-4 flex items-center justify-between text-xs font-medium">
                                    <div className="flex items-center gap-1.5 text-emerald-500">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Sincronizado
                                    </div>
                                    <span className="text-text-secondary">Conectado</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {connectToken && (
                <PluggyConnect
                    connectToken={connectToken}
                    includeSandbox={true}
                    onSuccess={handlePluggySuccess}
                    onError={(error: any) => console.error("Pluggy Error", error)}
                    onClose={() => setConnectToken("")}
                />
            )}
        </main>
    );
}
