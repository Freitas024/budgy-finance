import { User, Monitor, Bell, Shield, Sun, Moon } from "lucide-react";
import { Button, Card } from "@/src/components/ui";

export default function ConfiguracoesPage() {
    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white xl:text-3xl">Configurações</h1>
                    <p className="mt-1 text-sm text-text-secondary">Ajuste suas preferências e perfil.</p>
                </div>

                <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex w-full shrink-0 flex-col gap-1 md:w-64">
                        <button className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors">
                            <User className="h-4 w-4" />
                            Perfil
                        </button>
                        <button className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-white">
                            <Monitor className="h-4 w-4" />
                            Aparência
                        </button>
                        <button className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-white">
                            <Bell className="h-4 w-4" />
                            Notificações
                        </button>
                        <button className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-white">
                            <Shield className="h-4 w-4" />
                            Privacidade
                        </button>
                    </div>

                    <div className="flex flex-1 flex-col gap-6">
                        <Card className="p-6">
                            <h3 className="mb-6 font-bold text-white">Aparência</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <button className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#2D2A54] bg-transparent py-6 transition-colors hover:bg-white/5">
                                    <Sun className="h-6 w-6 text-text-secondary" />
                                    <span className="text-sm font-medium text-text-secondary">Claro</span>
                                </button>
                                <button className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#2D2A54] bg-transparent py-6 transition-colors hover:bg-white/5">
                                    <Moon className="h-6 w-6 text-text-secondary" />
                                    <span className="text-sm font-medium text-text-secondary">Escuro</span>
                                </button>
                                <button className="flex flex-col items-center justify-center gap-3 rounded-xl border border-brand bg-brand/10 py-6 transition-colors">
                                    <Monitor className="h-6 w-6 text-brand" />
                                    <span className="text-sm font-medium text-brand">Sistema</span>
                                </button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="mb-6 font-bold text-white">Conta e Segurança</h3>
                            <div className="flex flex-col">
                                <div className="flex flex-col justify-between gap-4 border-b border-[#2D2A54] pb-6 sm:flex-row sm:items-center">
                                    <div>
                                        <p className="font-medium text-white">Email</p>
                                        <p className="mt-1 text-sm text-text-secondary">gabriel@exemplo.com</p>
                                    </div>
                                    <Button variant="outline" className="!w-fit px-5 py-2 text-sm">
                                        Alterar
                                    </Button>
                                </div>
                                <div className="flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center">
                                    <div>
                                        <p className="font-medium text-white">Senha</p>
                                        <p className="mt-1 text-sm text-text-secondary">Última alteração há 3 meses</p>
                                    </div>
                                    <Button variant="outline" className="!w-fit px-5 py-2 text-sm">
                                        Atualizar
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
