import { NextResponse } from "next/server";
import { PluggyClient } from "pluggy-sdk";

export async function GET() {
    try {
        const clientId = process.env.PLUGGY_CLIENT_ID;
        const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

        // Se faltar chaves, retorna erro amigável pro nosso frontend
        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: "Chaves da Pluggy não configuradas no .env" }, { status: 500 });
        }

        // 1. Inicializamos a comunicação com a Pluggy
        const client = new PluggyClient({
            clientId: clientId,
            clientSecret: clientSecret,
        });

        // 2. Pedimos um token fresquinho pro usuário atual (Válido por 30 mins)
        // Esse token será usado pelo React no frontend para abrir o Pop-up Seguro do banco
        const data = await client.createConnectToken();

        // 3. Devolvemos ele em formato JSON pro nosso Frontend
        return NextResponse.json({ accessToken: data.accessToken });

    } catch (error: any) {
        console.error("Erro ao gerar token da Pluggy:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
