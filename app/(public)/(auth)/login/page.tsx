"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useContext, useState } from "react";
import api from "@/app/lib/axios";
import { toast } from "sonner";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Page({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.token) {
        signIn(data.token)
          .then(() => {
            router.push("/");
          })
          .catch((e: any) => {
            console.error(e);
            toast.error("Erro ao fazer login");
          });
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Falha no login", {
        position: "top-center",
        description: error.response?.data?.message || "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Fazer Login</h1>
        <p className="text-sm text-muted-foreground">
          Digite seu e-mail e senha para fazer login
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Logar"}
        </Button>
      </div>
    </form>
  );
}
