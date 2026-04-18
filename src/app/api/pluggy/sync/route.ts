import { NextResponse } from "next/server";
import { PluggyClient } from "pluggy-sdk";
import { createClient } from "@/src/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const { itemId } = await request.json();

        if (!itemId) {
            return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const client = new PluggyClient({
            clientId: process.env.PLUGGY_CLIENT_ID!,
            clientSecret: process.env.PLUGGY_CLIENT_SECRET!,
        });

        let item = await client.fetchItem(itemId);
        let tentativas = 0;

        while (item.status === "UPDATING" && tentativas < 20) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            item = await client.fetchItem(itemId);
            tentativas++;
        }

        const pluggyAccounts = await client.fetchAccounts(itemId);

        const newAccounts = pluggyAccounts.results.map((acc) => ({
            user_id: session.user.id,
            bank_name: acc.name,
            bank_slug: "pluggy",
            balance: acc.balance,
            status: "connected"
        }));

        const { data: insertedAccounts, error: accountsError } = await supabase
            .from("accounts")
            .insert(newAccounts)
            .select("id, bank_name");

        if (accountsError || !insertedAccounts) throw accountsError;

        const transactionsPromises = pluggyAccounts.results.map((acc) => {
            return client.fetchTransactions(acc.id).then(response => {
                const budgyAccount = insertedAccounts.find(x => x.bank_name === acc.name);
                return {
                    accountId: budgyAccount ? budgyAccount.id : insertedAccounts[0].id,
                    transactions: response.results
                };
            });
        });

        const allFetchedTransactions = await Promise.all(transactionsPromises);

        let newTransactions: any[] = [];
        let totalCount = 0;

        allFetchedTransactions.forEach(accountData => {
            accountData.transactions.forEach((tx) => {
                totalCount++;
                newTransactions.push({
                    user_id: session.user.id,
                    account_id: accountData.accountId,
                    description: tx.description,
                    amount: Math.abs(tx.amount),
                    type: tx.type === "CREDIT" ? "income" : "expense",
                    category: "Open Finance",
                    date: new Date(tx.date).toISOString().split("T")[0]
                });
            });
        });

        if (newTransactions.length > 0) {
            const { error: txError } = await supabase.from("transactions").insert(newTransactions);
            if (txError) throw txError;
        }

        return NextResponse.json({
            success: true,
            message: `Synched ${newAccounts.length} accounts and ${totalCount} transactions`
        });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
