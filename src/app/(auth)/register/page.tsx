"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ArrowRight, Wallet, User } from "lucide-react";
import { Input, Button } from "@/src/components/ui";
import { registerSchema, type RegisterSchema } from "@/src/lib/validations/auth";

export default function RegisterPage() {

    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    });

    function onSubmit(data: RegisterSchema) {
        console.log(`Dados recebidos: ${data}`);
        router.push("/select_bank");

    }

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <div className="flex flex-1 flex-col justify-center bg-auth-form-bg px-6 py-12 sm:px-12 lg:px-20 xl:px-28">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-12 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand shadow-[0_0_16px_rgba(108,99,245,0.4)]">
                            <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-text-primary">Budgy</span>
                    </div>

                    <div className="mb-8">
                        <div className="mb-6 h-0.5 w-full rounded-full bg-border relative">
                            <div className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-brand shadow-[0_0_10px_rgba(108,99,245,0.5)]"></div>
                        </div>
                        <h1 className="text-center text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                            Crie sua conta
                        </h1>
                        <p className="mt-2 text-center text-sm leading-relaxed text-text-secondary">
                            Comece a organizar suas finanças hoje mesmo.
                        </p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            type="text"
                            placeholder="Nome completo"
                            icon={<User className="h-4.5 w-4.5" />}
                            autoComplete="name"
                            error={errors.name?.message}
                            {...register("name")}
                        />
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            icon={<Mail className="h-4.5 w-4.5" />}
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register("email")}
                        />
                        <Input
                            type="password"
                            placeholder="Senha"
                            icon={<Lock className="h-4.5 w-4.5" />}
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            icon={<ArrowRight className="h-4 w-4" />}
                            className="mt-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Continuando..." : "Continuar"}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-text-secondary">
                        Já tem uma conta?{" "}
                        <a
                            href="/login"
                            className="font-semibold text-brand transition-colors hover:text-brand-light"
                        >
                            Faça login
                        </a>
                    </p>
                </div>
            </div>

            <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-hero-start to-hero-end p-12 lg:flex xl:p-20">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-[120px]" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand/8 blur-[100px]" />

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary xl:text-4xl">
                        Inteligência financeira automatizada para o seu dia a dia.
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-text-secondary xl:text-lg">
                        Conecte suas contas uma vez e deixe que o Budgy cuide do resto.
                        Organização, insights e tranquilidade sem esforço manual.
                    </p>

                    <div className="mt-12 flex items-center gap-2">
                        <span className="h-1.5 w-8 rounded-full bg-brand" />
                        <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                        <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                    </div>
                </div>
            </div>
        </div>
    );
}
