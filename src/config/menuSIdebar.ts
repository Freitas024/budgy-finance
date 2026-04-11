import { Home, ArrowRightLeft, WalletCards, PieChart, Settings } from "lucide-react";

export const navigation = [
    { name: "Dashboard", href: "/home", icon: Home },
    { name: "Transações", href: "/transacoes", icon: ArrowRightLeft },
    { name: "Contas", href: "/contas", icon: WalletCards },
    { name: "Insights", href: "/insights", icon: PieChart },
    { name: "Configurações", href: "/configuracoes", icon: Settings },
];
