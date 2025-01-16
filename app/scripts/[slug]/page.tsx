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
type scriptTypesType = {
  id: string
  name: string
}
type expectedReturnsType = {
  id: string
  scriptTypeId: string
  description: string
}


import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Page({ params }: { params: { slug: string } }) {
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [scriptTypes, setScriptTypes] = useState<scriptTypesType[]>([])
  const [expectedReturns, setExpectedReturns] = useState<expectedReturnsType[]>([])
  const { slug } = params;
  const { toast } = useToast()

  const [formData, setFormData] = useState<ScriptFormValues>({
    name: "",
    scriptTypeId: "0",
    expectedReturnId: "0",
    sqlQuery: "",
  });

  useEffect(() => {
    async function fetchFormDetails() {
      const [responseScript, responseExpectedReturn, responseData] = await Promise.all([
        axios.get('/api/scriptType'),
        axios.get('/api/expectedReturn'),
        axios.get(`/api/script/${slug}`),
      ]);
      setScriptTypes(responseScript.data);
      setExpectedReturns(responseExpectedReturn.data);
      setFormData(responseData.data);
      setIsAppLoading(false);
    }
    fetchFormDetails();
  }, [slug]);

  function handleChange(field: string, value: string) {
    console.log(field, value)
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
    setIsLoading(true);
    toast({
      description: "Salvado Script",
    })
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = scriptSchema.parse({
        ...formData
      });
      console.log(validatedData)
      const res = await axios.put(`/api/script/${slug}`, formData)
      if(res) {
        toast({
          description: "Registro salvo com sucesso",
        })
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
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
        toast({
          variant: "destructive",
          description: "Erro ao salvar registro",
        })
        console.error("REQ_ERROR", err)
      }
    }
  };

  if(isAppLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 px-6 py-10 pt-4">
      <Card>
        <CardHeader>
          <Skeleton className="w-[250px] h-8" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div>
                <Skeleton className="w-[150px] h-6 mb-1" />
                <Skeleton className="w-full h-8" />
              </div>
              <div>
                <Skeleton className="w-[150px] h-6 mb-1" />
                <Skeleton className="w-full h-8" />
              </div>
              <div>
                <Skeleton className="w-[150px] h-6 mb-1" />
                <Skeleton className="w-full h-8" />
              </div>
            </div>

            <Skeleton className="w-full h-52" />
            
            <div className="flex justify-end gap-2">
              <Skeleton className="w-[136px] h-9" />
              <Skeleton className="w-[136px] h-9" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>

    </div>
    )
  }

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
                {scriptTypes.length > 0 && (
                  <Select name="scriptTypeId" onValueChange={(value) => handleChange("scriptTypeId", value == "" ? formData.scriptTypeId : value)} value={formData.scriptTypeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo</SelectLabel>
                        {scriptTypes.map((scriptType) => (
                          <SelectItem key={scriptType.id} value={scriptType.id}>
                            {scriptType.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
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
                      {expectedReturns.map((expectedReturn) => (
                        <SelectItem key={expectedReturn.id} value={expectedReturn.id}>{expectedReturn.description}</SelectItem>
                      ))}
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
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => {console.log(formData)}}
                disabled={isLoading}
              >
                <Trash/> Excluir script
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
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