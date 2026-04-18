"use client";

import { useState, useEffect } from "react";
import { Filter, Calendar, Plus, X, ArrowUpRight, ArrowDownRight, Pencil, Trash2 } from "lucide-react";
import { Button, Card, InputSearch } from "@/src/components/ui";
import { createClient } from "@/src/lib/supabase/client";

type Account = { id: string; bank_name: string };

type Transaction = {
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
    account_id: string;
    accounts?: { bank_name: string };
};

const categories = [
    "Alimentação", "Transporte", "Moradia", "Saúde",
    "Educação", "Lazer", "Salário", "Freelance", "Investimento", "Outros"
];

export default function TransacoesPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [category, setCategory] = useState("Outros");
    const [accountId, setAccountId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const supabase = createClient();

        const { data: txData } = await supabase
            .from("transactions")
            .select("*, accounts(bank_name)")
            .order("date", { ascending: false });

        const { data: accData } = await supabase
            .from("accounts")
            .select("id, bank_name");

        if (txData) setTransactions(txData);
        if (accData) {
            setAccounts(accData);
            if (accData.length > 0 && !accountId) setAccountId(accData[0].id);
        }
    }

    function resetForm() {
        setDescription("");
        setAmount("");
        setType("expense");
        setCategory("Outros");
        setDate(new Date().toISOString().split("T")[0]);
        setEditingId(null);
    }

    function openCreateModal() {
        resetForm();
        setShowModal(true);
    }

    function openEditModal(tx: Transaction) {
        setEditingId(tx.id);
        setDescription(tx.description);
        setAmount(String(tx.amount));
        setType(tx.type);
        setCategory(tx.category);
        setAccountId(tx.account_id);
        setDate(tx.date.split("T")[0]);
        setShowModal(true);
    }

    async function handleSave() {
        if (!description || !amount || !accountId) return;

        setSaving(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) return;

        const payload = {
            user_id: session.user.id,
            account_id: accountId,
            description,
            amount: parseFloat(amount),
            type,
            category,
            date,
        };

        if (editingId) {
            await supabase.from("transactions").update(payload).eq("id", editingId);
        } else {
            await supabase.from("transactions").insert(payload);
        }

        resetForm();
        setShowModal(false);
        setSaving(false);
        fetchData();
    }

    async function handleDelete(id: string) {
        const supabase = createClient();
        await supabase.from("transactions").delete().eq("id", id);
        fetchData();
    }

    const formatCurrency = (value: number) =>
        value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const formatDate = (dateStr: string) =>
        new Date(`${dateStr.split("T")[0]}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

    const filteredTransactions = transactions.filter((tx) =>
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white xl:text-3xl">Transações</h1>
                        <p className="mt-1 text-sm text-text-secondary">Histórico completo de entradas e saídas.</p>
                    </div>
                    <Button
                        icon={<Plus className="h-4 w-4" />}
                        iconPosition="left"
                        className="!w-fit"
                        onClick={openCreateModal}
                    >
                        Nova Transação
                    </Button>
                </div>

                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex-1">
                        <InputSearch
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            variant="outline"
                            placeholder="Buscar por nome ou categoria..."
                            containerClassName="!max-w-full"
                        />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Button variant="outline" className="!w-fit" icon={<Filter className="h-4 w-4" />} iconPosition="left">
                            Filtros
                        </Button>
                        <Button variant="outline" className="!w-fit" icon={<Calendar className="h-4 w-4" />} iconPosition="left">
                            Abril 2026
                        </Button>
                    </div>
                </div>

                {filteredTransactions.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                        <ArrowUpRight className="h-12 w-12 text-text-secondary" />
                        <div>
                            <h3 className="font-bold text-white">
                                {searchQuery ? "Nenhum resultado encontrado" : "Nenhuma transação registrada"}
                            </h3>
                            <p className="mt-1 text-sm text-text-secondary">
                                {searchQuery
                                    ? "Tente buscar com um termo diferente."
                                    : "Clique em \"Nova Transação\" para adicionar a primeira."}
                            </p>
                        </div>
                    </Card>
                ) : (
                    <Card className="divide-y divide-[#2D2A54] p-0">
                        {filteredTransactions.map((tx) => (
                            <div key={tx.id} className="group flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tx.type === "income" ? "bg-emerald-500/10" : "bg-rose-500/10"
                                        }`}>
                                        {tx.type === "income"
                                            ? <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                                            : <ArrowDownRight className="h-5 w-5 text-rose-500" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{tx.description}</p>
                                        <p className="text-xs text-text-secondary">
                                            {tx.category} · {tx.accounts?.bank_name ?? "—"} · {formatDate(tx.date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`font-bold ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                                        {tx.type === "income" ? "+" : "−"} {formatCurrency(tx.amount)}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() => openEditModal(tx)}
                                            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-brand"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tx.id)}
                                            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-rose-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Card>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-[#2D2A54] bg-[#0C0A20] p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">
                                {editingId ? "Editar Transação" : "Nova Transação"}
                            </h2>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="text-text-secondary hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setType("expense")}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${type === "expense"
                                        ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                                        : "bg-white/5 text-text-secondary border border-transparent"
                                        }`}
                                >
                                    Saída
                                </button>
                                <button
                                    onClick={() => setType("income")}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${type === "income"
                                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                                        : "bg-white/5 text-text-secondary border border-transparent"
                                        }`}
                                >
                                    Entrada
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder="Descrição"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-xl border border-[#2D2A54] bg-white/5 px-4 py-3 text-sm text-white placeholder-text-secondary outline-none focus:border-brand"
                            />

                            <input
                                type="number"
                                placeholder="Valor (R$)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full rounded-xl border border-[#2D2A54] bg-white/5 px-4 py-3 text-sm text-white placeholder-text-secondary outline-none focus:border-brand"
                            />

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-[#2D2A54] bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-[#0C0A20]">{cat}</option>
                                ))}
                            </select>

                            <select
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                className="w-full rounded-xl border border-[#2D2A54] bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand"
                            >
                                {accounts.map((acc) => (
                                    <option key={acc.id} value={acc.id} className="bg-[#0C0A20]">{acc.bank_name}</option>
                                ))}
                            </select>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-xl border border-[#2D2A54] bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand"
                            />

                            <Button
                                className="mt-2"
                                onClick={handleSave}
                                disabled={saving || !description || !amount || !accountId}
                            >
                                {saving
                                    ? "Salvando..."
                                    : editingId
                                        ? "Salvar Alterações"
                                        : "Salvar Transação"
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
