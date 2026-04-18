export function calculateHomeDashboard(transactions: any[]) {
    let currentBalance = 0;
    const balanceByDate: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);

    transactions.forEach((tx) => {
        if (tx.type === "income") {
            currentBalance += Number(tx.amount);
        } else {
            currentBalance -= Number(tx.amount);

            if (!categoryTotals[tx.category]) {
                categoryTotals[tx.category] = 0;
            }
            categoryTotals[tx.category] += Number(tx.amount);
        }

        const dateObj = new Date(`${tx.date}T12:00:00`);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
        const formattedDate = `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;

        balanceByDate[formattedDate] = currentBalance;
    });

    const balanceHistory = Object.keys(balanceByDate).map(date => ({
        date,
        balance: balanceByDate[date]
    }));

    const categoryExpenses = Object.keys(categoryTotals).map(name => ({
        name,
        value: categoryTotals[name]
    })).sort((a, b) => b.value - a.value);

    return {
        totalIncome,
        totalExpense,
        balanceHistory,
        categoryExpenses
    };
}
