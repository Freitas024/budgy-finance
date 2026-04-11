import { Download, Plus, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button, Card } from "@/src/components/ui";

export default function HomePage() {
    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {/* Título e Botões de Ação */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white xl:text-3xl">Olá, Gabriel 👋</h1>
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
                        <h2 className="text-3xl font-bold text-white lg:text-4xl">R$ 24.850,40</h2>
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
                            <span className="text-xl font-bold text-white">R$ 15.200,00</span>
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
                            <span className="text-xl font-bold text-white">R$ 4.350,60</span>
                        </div>
                    </Card>
                </div>
            </Card>

            {/* Espaços para os Gráficos */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Card className="p-6 lg:p-8 lg:col-span-2">
                    <h3 className="text-base font-bold text-white">Evolução do Saldo</h3>
                    <div className="min-h-[280px] w-full">
                        {/* O gráfico será inserido aqui */}
                    </div>
                </Card>

                <Card className="p-6 lg:p-8 lg:col-span-1">
                    <h3 className="text-base font-bold text-white">Despesas por Categoria</h3>
                    <div className="min-h-[280px] w-full">
                        {/* O gráfico será inserido aqui */}
                    </div>
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
                        {/* Os cards de transações serão inseridos aqui */}
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
                        {/* Os cards de contas conectadas serão inseridos aqui */}
                    </div>
                </div>
            </div>
        </main>
    );
}
