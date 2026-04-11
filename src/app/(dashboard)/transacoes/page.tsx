import { Filter, Calendar } from "lucide-react";
import { Button, InputSearch } from "@/src/components/ui";

export default function TransacoesPage() {
    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-5xl">
                {/* Cabeçalho da Página */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white xl:text-3xl">Transações</h1>
                    <p className="mt-1 text-sm text-text-secondary">Histórico completo de entradas e saídas.</p>
                </div>

                {/* Barra de Pesquisa e Filtros */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex-1">
                        <InputSearch
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
                            Março 2026
                        </Button>
                    </div>
                </div>

                {/* O conteúdo das listas virá aqui (Transações Recentes, etc) */}
            </div>
        </main>
    );
}
