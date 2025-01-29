import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function Page({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Preencha os campos para criar sua conta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Nome de Usuário</Label>
          <Input id="username" type="text" placeholder="johdoe" required />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="password">Repetir senha </Label>
            <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Registrar-se
        </Button>
      </div>
      <div className="text-center text-sm">
        Já tem uma conta?{" "}
        <Link href="/auth/login" className="underline underline-offset-4">
          Fazer Login
        </Link>
      </div>
    </form>
  )
}
