import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Card } from "@/src/components/ui";

export default function InsightsPage() {
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
                        <h3 className="text-base font-bold text-white">Evolução de Despesas (Trimestre)</h3>
                        <div className="min-h-[280px] w-full"></div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
