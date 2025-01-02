"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";

const scriptSchema = z.object({
  name: z.string().min(1, "Escolha um nome"),
  sqlQuery: z.string().min(1, "SQL Query é obrigatório"),
  type: z.enum(["SELECT", "INSERT", "UPDATE"], {
    message: "Selecione um tipo"
  }),
  expectedReturn: z.string().min(1, "Retorno esperado é obrigatório")
});

type ScriptFormValues = z.infer<typeof scriptSchema>;

export default function Page() {
  const form = useForm<ScriptFormValues>({
    resolver: zodResolver(scriptSchema),
    defaultValues: {
      name: "",
      sqlQuery: "",
      type: undefined,
      expectedReturn: undefined
    },
  });

  const onSubmit = (data: ScriptFormValues) => {
    console.log("Form submitted:", data);
    // Add logic to send the form data to your backend
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-10 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Criar novo script</CardTitle>
          <CardDescription>Preencha o formulario para criar um script novo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {/* Name */}
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do script" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SELECT">SELECT</SelectItem>
                            <SelectItem value="INSERT">INSERT</SelectItem>
                            <SelectItem value="UPDATE">UPDATE</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* expectedReturn */}
                <FormField
                  name="expectedReturn"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retorno Esperado</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o retorno esperado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">Nenhum registro</SelectItem>
                            <SelectItem value="3">Dentro da média de registros</SelectItem>
                            <SelectItem value="4">Nenhum</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SQL Query */}
              <FormField
                name="sqlQuery"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query SQL</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter SQL query" rows={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">
                  <Plus/> Incluir script
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

    </div>
  )
}