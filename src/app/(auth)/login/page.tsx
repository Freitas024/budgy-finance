"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/src/lib/supabase/client";
import { loginSchema, type LoginSchema } from "@/src/lib/validations/auth";
import { Mail, Lock, ArrowRight, Layers } from "lucide-react";
import { Input, Button, Checkbox, Divider } from "@/src/components/ui";

export default function LoginPage() {

  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(formData: LoginSchema) {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    router.push("/home");
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* ===== FORM SIDE ===== */}
      <div className="flex flex-1 flex-col justify-center bg-auth-form-bg px-6 py-12 sm:px-12 lg:px-20 xl:px-28">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-12 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand shadow-[0_0_16px_rgba(108,99,245,0.4)]">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">Budgy</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Acesse sua conta para visualizar seus dados financeiros.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="••••••••"
              icon={<Lock className="h-4.5 w-4.5" />}
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <Checkbox label="Lembrar de mim" {...register("remember")} />
              <a
                href="#"
                className="text-xs font-medium text-brand transition-colors hover:text-brand-light"
              >
                Esqueci a senha
              </a>
            </div>

            {authError && (
              <p className="text-sm text-rose-500 text-center">{authError}</p>
            )}

            <Button
              type="submit"
              size="lg"
              icon={<ArrowRight className="h-4 w-4" />}
              className="mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar na minha conta"}
            </Button>

            <Divider text="Ou continue com" />

          </form>

          {/* Signup link */}
          <p className="mt-8 text-center text-sm text-text-secondary">
            Ainda não tem uma conta?{" "}
            <a
              href="/register"
              className="font-semibold text-brand transition-colors hover:text-brand-light"
            >
              Criar conta agora
            </a>
          </p>
        </div>
      </div>

      {/* ===== HERO SIDE ===== */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-hero-start to-hero-end p-12 lg:flex xl:p-20">
        {/* Decorative glow */}
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

          {/* Carousel dots */}
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