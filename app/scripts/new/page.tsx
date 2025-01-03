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

// import { useState } from "react";
// import CodeMirror from "@uiw/react-codemirror";
// import { sql } from "@codemirror/lang-sql";

export default function Page() {
  // const [sqlQuery, setSqlQuery] = useState("\n\n\n\n\n\n\n\n\n");
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
              {/* <div className="form-item">
                <label
                  className="block text-sm font-medium mb-4"
                  htmlFor="sql-query"
                >
                  SQL Query
                </label>
                <CodeMirror
                  value={sqlQuery}
                  extensions={[sql()]}
                  onChange={(value) => setSqlQuery(value)}
                  theme="dark"
                  id="sql-query"
                  style={{
                    fontSize: "14px",
                    minHeight: "200px", // Approx height for 10 rows
                    maxHeight: "400px",
                    border: "1px solid #d1d5db", // Border for consistency
                    borderRadius: "8px", // Rounded corners
                    backgroundColor: "#1e1e1e", // Matches dark theme
                    overflowX: "hidden",
                    whiteSpace: "wrap",
                    wordBreak: "break-word"
                  }}
                />
              </div> */}
              
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