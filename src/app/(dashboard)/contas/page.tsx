import { Plus, ShieldCheck, MoreHorizontal, CheckCircle2, RefreshCw, AlertCircle, Building2 } from "lucide-react";
import { Button, Card } from "@/src/components/ui";

export default function ContasPage() {
    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-5xl">
                {/* Cabeçalho */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white xl:text-3xl">Contas Bancárias</h1>
                        <p className="mt-1 text-sm text-text-secondary">Gerencie suas conexões e sincronização.</p>
                    </div>
                    <div>
                        <Button icon={<Plus className="h-4 w-4" />} iconPosition="left" className="!w-fit">
                            Conectar nova conta
                        </Button>
                    </div>
                </div>

                {/* Banner de Sincronização */}
                <div className="mb-8 flex items-start gap-4 rounded-xl border border-[#2D2A54] bg-[#131033] p-5 md:items-center">
                    <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand md:mt-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-white">Sincronização Segura Ativa</h4>
                        <p className="mt-1 text-xs text-text-secondary">
                            Suas contas estão conectadas via Open Finance utilizando criptografia bancária. Atualização automática acontece a cada 4 horas.
                        </p>
                    </div>
                </div>

                {/* Grid de Contas */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Cartão Nubank */}
                    <Card className="flex flex-col gap-6 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#8A05BE]">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Nubank</h3>
                                    <p className="text-xs text-text-secondary">Conta Corrente e Cartão</p>
                                </div>
                            </div>
                            <button className="text-text-secondary hover:text-text-primary">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        <div>
                            <p className="mb-1 text-sm text-text-secondary">Saldo disponível</p>
                            <h2 className="text-2xl font-bold text-white">R$ 12.450,00</h2>
                        </div>

                        <div className="border-t border-[#2D2A54] pt-4 flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center gap-1.5 text-emerald-500">
                                <CheckCircle2 className="h-4 w-4" />
                                Sincronizado
                            </div>
                            <span className="text-text-secondary">Sincronizado há 5 min</span>
                        </div>
                    </Card>

                    {/* Cartão Itaú Personnalité */}
                    <Card className="flex flex-col gap-6 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EC7001]">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Itaú Personnalité</h3>
                                    <p className="text-xs text-text-secondary">Conta Investimento</p>
                                </div>
                            </div>
                            <button className="text-text-secondary hover:text-text-primary">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        <div>
                            <p className="mb-1 text-sm text-text-secondary">Saldo disponível</p>
                            <h2 className="text-2xl font-bold text-white">R$ 12.400,40</h2>
                        </div>

                        <div className="border-t border-[#2D2A54] flex items-center justify-between pt-4 text-xs font-medium">
                            <div className="flex items-center gap-1.5 text-brand">
                                <RefreshCw className="h-4 w-4" />
                                Sincronizando...
                            </div>
                            <span className="text-text-secondary">Sincronizando...</span>
                        </div>
                    </Card>

                    {/* Cartão Banco Inter */}
                    <Card className="flex flex-col gap-6 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FF7A00]">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Banco Inter</h3>
                                    <p className="text-xs text-text-secondary">Conta PJ</p>
                                </div>
                            </div>
                            <button className="text-text-secondary hover:text-text-primary">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        <div>
                            <p className="mb-1 text-sm text-text-secondary">Saldo disponível</p>
                            <h2 className="text-2xl font-bold text-white">R$ 8.500,20</h2>
                        </div>

                        <div className="border-t border-[#2D2A54] pt-4 flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center gap-1.5 text-rose-500">
                                <AlertCircle className="h-4 w-4" />
                                Falha na conexão
                            </div>
                            <span className="text-text-secondary">Falha ao sincronizar</span>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
