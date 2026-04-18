"use client";

import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Card } from "@/src/components/ui";
import { createClient } from "@/src/lib/supabase/client";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function InsightsPage() {
    const [expenseData, setExpenseData] = useState<{ date: string; amount: number }[]>([]);
    const [savingsInsight, setSavingsInsight] = useState<{ title: string; text: string; isPositive: boolean } | null>(null);
    const [categoryInsight, setCategoryInsight] = useState<{ category: string; amount: number } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) return;

        const { data, error } = await supabase
            .from("transactions")
            .select("amount, type, date, category")
            .eq("user_id", session.user.id)
            .order("date", { ascending: true }); // Ordem cronológica

        if (error || !data) return;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const lastMonthDate = new Date(currentDate);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastMonthYear = lastMonthDate.getFullYear();

        let currentIncome = 0;
        let currentExpense = 0;
        let lastIncome = 0;
        let lastExpense = 0;

        const groupedData: Record<string, number> = {};
        const currentCategoryTotals: Record<string, number> = {};

        data.forEach((tx) => {
            const dateObj = new Date(`${tx.date}T12:00:00`);
            const txMonth = dateObj.getMonth();
            const txYear = dateObj.getFullYear();
            const val = Number(tx.amount);

            if (txYear === currentYear && txMonth === currentMonth) {
                if (tx.type === "income") currentIncome += val;
                else {
                    currentExpense += val;
                    if (!currentCategoryTotals[tx.category]) currentCategoryTotals[tx.category] = 0;
                    currentCategoryTotals[tx.category] += val;
                }
            } else if (txYear === lastMonthYear && txMonth === lastMonth) {
                if (tx.type === "income") lastIncome += val;
                else lastExpense += val;
            }

            if (tx.type === "expense") {
                const formattedDate = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
                if (!groupedData[formattedDate]) {
                    groupedData[formattedDate] = 0;
                }
                groupedData[formattedDate] += val;
            }
        });

        const currentSavings = currentIncome - currentExpense;
        const lastSavings = lastIncome - lastExpense;

        let maxCategory = "Nenhuma";
        let maxAmount = 0;
        Object.keys(currentCategoryTotals).forEach(cat => {
            if (currentCategoryTotals[cat] > maxAmount) {
                maxAmount = currentCategoryTotals[cat];
                maxCategory = cat;
            }
        });

        setCategoryInsight({ category: maxCategory, amount: maxAmount });

        if (currentSavings >= lastSavings) {
            let percentage = "0%";
            if (lastSavings > 0) percentage = (((currentSavings - lastSavings) / lastSavings) * 100).toFixed(0) + "%";
            else if (currentSavings > 0) percentage = "(nova poupança)";

            setSavingsInsight({
                title: "Poupança Crescente",
                text: `Excelente! Você conseguiu reter mais caixa este mês. Seu saldo cresceu ${percentage} em relação ao mês anterior.`,
                isPositive: true
            });
        } else {
            const difference = lastSavings - currentSavings;
            setSavingsInsight({
                title: "Gastos em Alta",
                text: `Atenção! Você economizou R$ ${difference.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} a menos este mês. Segure as despesas!`,
                isPositive: false
            });
        }

        const chartData = Object.keys(groupedData).map((date) => ({
            date,
            amount: groupedData[date]
        }));

        setExpenseData(chartData);
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    // Tooltip customizado para ficar com o design system do Budgy
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border border-[#2D2A54] bg-[#0C0A20] p-3 shadow-xl">
                    <p className="mb-1 text-xs text-text-secondary">{label}</p>
                    <p className="font-bold text-white">{formatCurrency(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white xl:text-3xl">Insights Inteligentes</h1>
                    <p className="mt-1 text-sm text-text-secondary">Análise automatizada baseada nos seus hábitos.</p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {savingsInsight ? (
                        <Card className={`flex flex-col items-center p-6 text-center ${savingsInsight.isPositive ? 'border-brand/20 bg-brand/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${savingsInsight.isPositive ? 'bg-brand/15' : 'bg-rose-500/15'}`}>
                                {savingsInsight.isPositive ? <TrendingUp className="h-5 w-5 text-[#818CF8]" /> : <AlertTriangle className="h-5 w-5 text-rose-500" />}
                            </div>
                            <h3 className="mb-2 font-bold text-white">{savingsInsight.title}</h3>
                            <p className="text-sm leading-relaxed text-text-secondary">
                                {savingsInsight.text}
                            </p>
                        </Card>
                    ) : (
                        <Card className="flex flex-col items-center justify-center border-[#2D2A54] bg-[#131033] p-6 text-center">
                            <span className="text-sm text-text-secondary">Analisando inteligência...</span>
                        </Card>
                    )}

                    {categoryInsight ? (
                        categoryInsight.amount > 0 ? (
                            <Card className="flex flex-col items-center border-[rgba(244,63,94,0.2)] bg-[rgba(244,63,94,0.05)] p-6 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(244,63,94,0.15)]">
                                    <AlertTriangle className="h-5 w-5 text-[#FB7185]" />
                                </div>
                                <h3 className="mb-2 font-bold text-white">Maior Gasto do Mês</h3>
                                <p className="text-sm leading-relaxed text-text-secondary">
                                    Sua principal despesa foi em <strong className="font-semibold text-white">{categoryInsight.category}</strong> custando <strong className="font-semibold text-white">{formatCurrency(categoryInsight.amount)}</strong>.
                                </p>
                            </Card>
                        ) : (
                            <Card className="flex flex-col items-center justify-center border-[#2D2A54] bg-[#131033] p-6 text-center">
                                <span className="text-sm text-text-secondary">Você não registrou despesas este mês. 🎉</span>
                            </Card>
                        )
                    ) : (
                        <Card className="flex flex-col items-center justify-center border-[#2D2A54] bg-[#131033] p-6 text-center">
                            <span className="text-sm text-text-secondary">Analisando categorias...</span>
                        </Card>
                    )}

                    <Card className="flex flex-col items-center border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.05)] p-6 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(16,185,129,0.15)]">
                            <Lightbulb className="h-5 w-5 text-[#34D399]" />
                        </div>
                        <h3 className="mb-2 font-bold text-white">Recomendação</h3>
                        <p className="text-sm leading-relaxed text-text-secondary">
                            Transferir R$ 2.000 para a caixinha do Nubank renderia mais que sua conta atual.
                        </p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <Card className="p-6 lg:col-span-2 lg:p-8">
                        <h3 className="text-base font-bold text-white mb-6">Evolução de Despesas</h3>
                        <div className="h-[280px] w-full">
                            {expenseData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={expenseData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2D2A54" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#8F8CBA"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                            tickMargin={10}
                                        />
                                        <YAxis
                                            stroke="#8F8CBA"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `R$ ${value}`}
                                            width={80}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2D2A54', strokeWidth: 1 }} />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#6C63F5"
                                            strokeWidth={3}
                                            dot={{ fill: "#6C63F5", strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, stroke: "#131033", strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                                    Não há dados de despesas suficientes para gerar o gráfico.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
