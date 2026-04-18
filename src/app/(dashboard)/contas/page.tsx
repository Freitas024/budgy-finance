"use client";

import { useState, useEffect } from "react";
import { Plus, ShieldCheck, MoreHorizontal, CheckCircle2, Building2, X, BadgeCheck } from "lucide-react";
import { Button, Card } from "@/src/components/ui";
import { createClient } from "@/src/lib/supabase/client";
import { banks } from "@/src/config/bank";

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
    const [showModal, setShowModal] = useState(false);
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const supabase = createClient();
        const { data } = await supabase.from("accounts").select("*");
        if (data) setAccounts(data);
    }

    const toggleBank = (id: string) => {
        setSelectedBanks((prev) =>
            prev.includes(id) ? prev.filter((bankId) => bankId !== id) : [...prev, id]
        );
    };

    const handleConnect = async () => {
        if (selectedBanks.length === 0) return;

        setSaving(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            setSaving(false);
            return;
        }

        const { error } = await supabase.from("accounts").insert(
            selectedBanks.map((bankId) => ({
                user_id: session.user.id,
                bank_name: banks.find((b) => b.id === bankId)?.name,
                bank_slug: bankId,
            }))
        );

        if (!error) {
            setShowModal(false);
            setSelectedBanks([]);
            fetchData();
        }
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
                            onClick={() => setShowModal(true)}
                        >
                            Conectar nova conta
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
                                    <button className="text-text-secondary hover:text-text-primary">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
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

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-[#2D2A54] bg-[#0C0A20] p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Conectar Nova Conta</h2>
                            <button onClick={() => { setShowModal(false); setSelectedBanks([]); }} className="text-text-secondary hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="mb-6 text-sm text-text-secondary">
                            Selecione os bancos que deseja conectar via Open Finance.
                        </p>

                        <div className="mb-8 grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {banks.map((bank) => {
                                const isSelected = selectedBanks.includes(bank.id);
                                return (
                                    <button
                                        key={bank.id}
                                        type="button"
                                        onClick={() => toggleBank(bank.id)}
                                        className={`relative flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${isSelected
                                            ? "border-brand bg-brand/10"
                                            : "border-[#2D2A54] bg-white/5 hover:border-text-muted"
                                            }`}
                                    >
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bank.color}`}>
                                            <Building2 className={`h-4.5 w-4.5 ${bank.iconColor}`} />
                                        </div>
                                        <span className="text-sm font-medium text-white">{bank.name}</span>
                                        {isSelected && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <BadgeCheck className="h-4.5 w-4.5 text-brand" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleConnect}
                            disabled={saving || selectedBanks.length === 0}
                        >
                            {saving ? "Conectando..." : "Conectar Bancos"}
                        </Button>
                    </div>
                </div>
            )}
        </main>
    );
}
