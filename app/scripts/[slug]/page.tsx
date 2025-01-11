/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Save, Trash } from "lucide-react";
import axios from "axios";

const scriptSchema = z.object({
  name: z.string().min(1, "Escolha um nome"),
  sqlQuery: z.string().min(1, "SQL Query é obrigatório"),
  scriptTypeId: z.string().min(1, "Tipo é obrigatório"),
  expectedReturnId: z.string().min(1, "Retorno esperado é obrigatório")
});

type ScriptFormValues = z.infer<typeof scriptSchema>;
type QueryTypes = "SELECT" | "INSERT" | "UPDATE" | "DELETE";


import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { Label } from "@/components/ui/label";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [formData, setFormData] = useState<ScriptFormValues>({
    name: "",
    scriptTypeId: "1",
    expectedReturnId: "2",
    sqlQuery: "",
  });

  useEffect(() => {
    async function getData() {
      const res = await axios.get(`/api/script/${slug}`)
  
      setFormData(res.data)
    }

    getData()
  }, [slug])
  
  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function handleChangeSQLQuery(value: string) {
    setFormData((prev) => ({ ...prev, "sqlQuery": value }));

    const firstWord = value.trim().split(/\s+/)[0]?.toUpperCase() as QueryTypes;
    console.log(firstWord)
    const types = ["SELECT", "INSERT", "UPDATE", "DELETE"];
    if(types.includes(firstWord)) {
      setFormData((prev) => ({ ...prev, "type": firstWord }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({}); // Limpa os erros antes de validar

    try {
      // Tenta validar os dados do formulário
      const validatedData = scriptSchema.parse({
        ...formData
      });
      console.log(validatedData)
      await axios.put(`/api/script/${slug}`, formData)
      // Aqui você pode enviar os dados para uma API ou fazer outra ação
    } catch (err) {
      console.log(err)
      if (err instanceof Error && (err as any).errors) {
        console.error("ZOD_ERROR", err)
        // Transforma os erros do Zod em um objeto legível
        const zodErrors = (err as any).errors.reduce(
          (acc: any, curr: any) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {}
        );
        setErrors(zodErrors);
      } else {
        console.error("REQ_ERROR", err)
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-10 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Editar script | ID: {slug}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {/* Name */}
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Escolha um nome para o script"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>

              {/* Type */}
              <div>
                <Label htmlFor="scriptTypeId">Tipo</Label>
                <Select name="scriptTypeId" onValueChange={(value) => handleChange("scriptTypeId", value == "" ? formData.scriptTypeId : value)} value={formData.scriptTypeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipo</SelectLabel>
                      <SelectItem value="1">SELECT</SelectItem>
                      <SelectItem value="2">UPDATE</SelectItem>
                      <SelectItem value="3">INSERT</SelectItem>
                      <SelectItem value="4">DELETE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.scriptTypeId && <p className="text-red-500">{errors.scriptTypeId}</p>}
              </div>

              {/* expectedReturnId */}
              <div>
                <Label htmlFor="expectedReturnId">Retorno Esperado</Label>
                <Select name="expectedReturnId" onValueChange={(value) => handleChange("expectedReturnId", value == "" ? formData.expectedReturnId : value)} value={formData.expectedReturnId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um retorno esperado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Retorno Esperado</SelectLabel>
                      <SelectItem value="2">Apple</SelectItem>
                      <SelectItem value="3">Banana</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.expectedReturnId && <p className="text-red-500">{errors.expectedReturnId}</p>}
              </div>
            </div>

            {/* SQL Query */}
            <div className="form-item">
              <Label htmlFor="sqlQuery">Query SQL</Label>
              <CodeMirror
                value={formData.sqlQuery}
                extensions={[sql()]}
                onChange={(value) => handleChangeSQLQuery(value)}
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
              {errors.sqlQuery && <p className="text-red-500">{errors.sqlQuery}</p>}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="destructive" onClick={() => {console.log(formData)}}>
                <Trash/> Excluir script
              </Button>
              <Button type="submit">
                <Save/> Salvar script
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>

    </div>
  )
}