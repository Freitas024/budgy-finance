"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/src/lib/validations/auth";
import { Mail, Lock, ArrowRight, Layers } from "lucide-react";
import { Input, Button, Checkbox, Divider } from "@/src/components/ui";

export default function LoginPage() {

  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginSchema) {
    console.log(data);
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

            {/* Submit */}
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

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              iconPosition="left"
              icon={
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }

            >
              Entrar com Google
            </Button>
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