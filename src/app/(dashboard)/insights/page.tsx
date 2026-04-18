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

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) return;

        // Buscar todas as transações do tipo "expense"
        const { data, error } = await supabase
            .from("transactions")
            .select("amount, date")
            .eq("type", "expense")
            .eq("user_id", session.user.id)
            .order("date", { ascending: true }); // Ordem cronológica

        if (error || !data) return;

        // Agrupar gastos por dia
        const groupedData = data.reduce((acc: any, curr: any) => {
            const dateObj = new Date(curr.date);
            // Formatar data para exibição (ex: 15/abr)
            const formattedDate = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

            if (!acc[formattedDate]) {
                acc[formattedDate] = 0;
            }
            acc[formattedDate] += Number(curr.amount);
            return acc;
        }, {});

        // Converter o objeto agrupado para o formato de array que o Recharts espera
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
                    <Card className="flex flex-col items-center border-[rgba(108,99,245,0.2)] bg-[rgba(108,99,245,0.05)] p-6 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(108,99,245,0.15)]">
                            <TrendingUp className="h-5 w-5 text-[#818CF8]" />
                        </div>
                        <h3 className="mb-2 font-bold text-white">Poupança Crescente</h3>
                        <p className="text-sm leading-relaxed text-text-secondary">
                            Seu saldo médio cresceu <strong className="font-semibold text-white">15%</strong> este mês em comparação ao anterior.
                        </p>
                    </Card>

                    <Card className="flex flex-col items-center border-[rgba(244,63,94,0.2)] bg-[rgba(244,63,94,0.05)] p-6 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(244,63,94,0.15)]">
                            <AlertTriangle className="h-5 w-5 text-[#FB7185]" />
                        </div>
                        <h3 className="mb-2 font-bold text-white">Atenção em Delivery</h3>
                        <p className="text-sm leading-relaxed text-text-secondary">
                            Você gastou <strong className="font-semibold text-white">R$ 450</strong> em iFood, 30% a mais que sua média histórica.
                        </p>
                    </Card>

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
