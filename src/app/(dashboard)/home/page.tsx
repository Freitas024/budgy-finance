"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { Download, Plus, TrendingUp, ArrowUpRight, ArrowDownRight, Building2 } from "lucide-react";
import { Button, Card } from "@/src/components/ui";
import { banks } from "@/src/config/bank";
import { calculateHomeDashboard } from "@/src/lib/calculations";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface Account {
    id: string;
    bank_name: string;
    bank_slug: string;
    balance: number;
}


interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    date: string;
}

export default function HomePage() {
    const [user, setUser] = useState("");
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [recentAccounts, setRecentAccounts] = useState<Account[]>([]);
    const [balanceHistory, setBalanceHistory] = useState<{ date: string; balance: number }[]>([]);
    const [categoryExpenses, setCategoryExpenses] = useState<{ name: string; value: number }[]>([]);

    const COLORS = ['#6C63F5', '#FB7185', '#34D399', '#FBBF24', '#818CF8', '#2D2A54'];

    const formatCurrency = (value: number) =>
        value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const formatDate = (dateStr: string) =>
        new Date(`${dateStr.split("T")[0]}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getUser().then((res) => {
            setUser(res.data.user?.user_metadata.name ?? "");
        });

        supabase
            .from("transactions")
            .select("amount, type, date, category")
            .order("date", { ascending: true })
            .then(({ data }) => {
                if (!data) return;

                const { totalIncome, totalExpense, balanceHistory, categoryExpenses } = calculateHomeDashboard(data);

                setBalanceHistory(balanceHistory);
                setCategoryExpenses(categoryExpenses);
                setTotalIncome(totalIncome);
                setTotalExpense(totalExpense);
            });

        supabase
            .from("transactions")
            .select("*, accounts(bank_name)")
            .order("date", { ascending: false })
            .limit(5)
            .then(({ data }) => {
                if (data) setRecentTransactions(data);
            });

        supabase
            .from("accounts")
            .select("*")
            .limit(4)
            .then(({ data }) => {
                if (data) setRecentAccounts(data);
            });

    }, []);

    const balance = totalIncome - totalExpense;
    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {/* Título e Botões de Ação */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white xl:text-3xl">Olá, {user.toLowerCase()} 👋</h1>
                    <p className="mt-1 text-sm text-text-secondary">Seja Bem-Vindo</p>
                </div>
                <div className="flex gap-3">
                    <Button className="!w-fit" variant="outline" icon={<Download className="h-4 w-4" />} iconPosition="left">
                        Exportar CSV
                    </Button>
                    <Button className="!w-fit" icon={<Plus className="h-4 w-4" />} iconPosition="left">
                        Nova Despesa
                    </Button>
                </div>
            </div>

            {/* Card Principal: Saldo Consolidado */}
            <Card className="relative mb-8 overflow-hidden p-6 lg:p-8">
                {/* Fundo Decorativo */}
                <svg className="pointer-events-none absolute right-[-5%] top-[-10%] h-[120%] w-[60%] opacity-[0.03] text-white" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 200L100 130L200 160L400 0" stroke="currentColor" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <div className="relative z-10 mb-8 flex items-start justify-between">
                    <div>
                        <p className="mb-1 text-sm font-medium text-text-secondary">Saldo Consolidado</p>
                        <h2 className="text-3xl font-bold text-white lg:text-4xl">{formatCurrency(balance)}</h2>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-500">
                        <TrendingUp className="h-3.5 w-3.5" />
                        12.5% este mês
                    </div>
                </div>

                {/* Cards Menores (Entradas e Saídas) */}
                <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="border-transparent bg-[#131033] p-5 md:border-[#2D2A54]">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                                    <ArrowUpRight className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-text-secondary">Entradas</span>
                            </div>
                            <span className="text-xl font-bold text-white">{formatCurrency(totalIncome)}</span>
                        </div>
                    </Card>

                    <Card className="border-transparent bg-[#131033] p-5 md:border-[#2D2A54]">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500">
                                    <ArrowDownRight className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-text-secondary">Saídas</span>
                            </div>
                            <span className="text-xl font-bold text-white">{formatCurrency(totalExpense)}</span>
                        </div>
                    </Card>
                </div>
            </Card>

            {/* Espaços para os Gráficos */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Card className="p-6 lg:p-8 lg:col-span-2">
                    <h3 className="text-base font-bold text-white mb-6">Evolução do Saldo</h3>
                    <div className="h-[280px] w-full">
                        {balanceHistory.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={balanceHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6C63F5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6C63F5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2D2A54" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#8F8CBA"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        stroke="#8F8CBA"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `R$${value >= 1000 ? (value / 1000).toFixed(value % 1000 !== 0 ? 1 : 0) + 'k' : value}`}
                                    />
                                    <RechartsTooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-lg border border-[#2D2A54] bg-[#0C0A20] p-3 shadow-xl">
                                                        <p className="mb-1 text-xs text-text-secondary">{label}</p>
                                                        <p className="font-bold text-white">{formatCurrency(payload[0].value as number)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                        cursor={{ stroke: '#2D2A54', strokeWidth: 1 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#6C63F5"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorBalance)"
                                        activeDot={{ r: 6, fill: "#6C63F5", stroke: "#0C0A20", strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                                Dados insuficientes para o gráfico.
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-6 lg:p-8 lg:col-span-1 flex flex-col">
                    <h3 className="text-base font-bold text-white mb-6">Despesas por Categoria</h3>
                    <div className="h-[280px] w-full flex-1">
                        {categoryExpenses.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryExpenses}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryExpenses.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-lg border border-[#2D2A54] bg-[#0C0A20] p-3 shadow-xl">
                                                        <p className="mb-1 text-xs text-text-secondary">{payload[0].name}</p>
                                                        <p className="font-bold text-white">{formatCurrency(payload[0].value as number)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                                Nenhuma despesa para exibir.
                            </div>
                        )}
                    </div>
                    {/* Legendas Embaixo */}
                    {categoryExpenses.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                            {categoryExpenses.map((cat, idx) => (
                                <div key={cat.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    {cat.name}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Espaços para Transações e Contas */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Transações Recentes */}
                <div className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">Transações Recentes</h3>
                        <button type="button" className="text-sm font-medium text-brand hover:underline">
                            Ver todas
                        </button>
                    </div>
                    <div className="min-h-[300px] w-full">
                        <Card className="divide-y divide-[#2D2A54] p-0">
                            {recentTransactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between px-6 py-4">

                                    {/* Esquerda: Ícone + Descrição */}
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${tx.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                                            {tx.type === "income" ? <ArrowUpRight /> : <ArrowDownRight />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{tx.description}</p>
                                            <p className="text-xs text-text-secondary">{formatDate(tx.date)}</p>
                                        </div>
                                    </div>

                                    {/* Direita: Valor em R$ */}
                                    <span className={`font-bold ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                                        {tx.type === "income" ? "+" : "−"} {formatCurrency(tx.amount)}
                                    </span>

                                </div>
                            ))}
                        </Card>

                    </div>
                </div>

                {/* Contas Conectadas */}
                <div className="lg:col-span-1">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">Contas Conectadas</h3>
                        <button type="button" className="text-sm font-medium text-brand hover:underline">
                            Gerenciar
                        </button>
                    </div>
                    <div className="min-h-[300px] w-full">
                        <div className="flex flex-col gap-4">
                            {recentAccounts.map((account) => {
                                const bankConfig = banks.find((b) => b.id === account.bank_slug);
                                const colorClass = bankConfig?.color ?? "bg-[#2D2A54]";
                                return (
                                    <div key={account.id} className="flex items-center justify-between rounded-xl border border-[#2D2A54] bg-[#131033] p-4 transition-colors hover:border-text-muted">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                                                <Building2 className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <p className="font-bold text-white text-sm">{account.bank_name}</p>
                                                <span className="text-xs text-text-secondary">{formatCurrency(account.balance)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {recentAccounts.length === 0 && (
                                <div className="rounded-xl border border-[#2D2A54] bg-[#131033] p-8 text-center">
                                    <p className="text-sm text-text-secondary">Nenhuma conta conectada.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
