/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

const scriptSchema = z.object({
  name: z.string().min(1, "Escolha um nome"),
  sqlQuery: z.string().min(1, "SQL Query é obrigatório"),
  scriptTypeId: z.string().min(1, "Tipo é obrigatório"),
  expectedReturnId: z.string().min(1, "Retorno esperado é obrigatório")
}); 

type scriptTypesType = {
  id: string
  name: string
}
type expectedReturnsType = {
  id: string
  scriptTypeId: string
  description: string
}

import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [scriptTypes, setScriptTypes] = useState<scriptTypesType[]>([])
  const [expectedReturns, setExpectedReturns] = useState<expectedReturnsType[]>([])
  const [expectedReturnsChained, setExpectedReturnsChained] = useState<expectedReturnsType[]>([])
  const [formData, setFormData] = useState({
    name: "",
    scriptTypeId: "",
    expectedReturnId: "",
    sqlQuery: "\n\n\n\n\n\n\n\n\n",
  });
  const { toast } = useToast()

  useEffect(() => {
    async function fetchFormDetails() {
      const [responseScript, responseExpectedReturn] = await Promise.all([
        axios.get('/api/scriptType'),
        axios.get('/api/expectedReturn'),
      ]);
      setScriptTypes(responseScript.data);
      setExpectedReturns(responseExpectedReturn.data);
      setIsLoading(false);
    }
    fetchFormDetails();
  }, []);

  useEffect(() => {
    const expectedReturnsFiltered = expectedReturns.filter((expectedReturn) => expectedReturn.scriptTypeId == formData.scriptTypeId)
    setExpectedReturnsChained(expectedReturnsFiltered)
  }, [formData.scriptTypeId, expectedReturns]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function handleChangeSQLQuery(value: string) {
    setFormData((prev) => ({ ...prev, "sqlQuery": value }));

    const firstWord = value.trim().split(/\s+/)[0]?.toUpperCase();
    const typeFound: scriptTypesType | undefined = scriptTypes.find((scriptType) => scriptType.name === firstWord);
    if(typeFound) {
      setFormData((prev) => ({ ...prev, "scriptTypeId": typeFound.id.toString() }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    console.log('submitting', formData)
    setIsLoading(true);
    toast({
      description: "Incluindo Script",
    })
    e.preventDefault();
    setErrors({});
    console.log(formData)
    try {
      const validatedData = scriptSchema.parse({
        ...formData
      });
      console.log(formData)
      const res = await axios.post('/api/script', formData)
      if(res) {
        toast({
          description: "Registro incluído com sucesso",
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
          description: "Erro ao incluir registro",
        })
        console.error("REQ_ERROR", err)
      }
    }
  };

  if(isLoading) {
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
      </Card>

    </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-10 pt-4">
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Criar novo script</CardTitle>
              <CardDescription>Preencha o formulario para criar um script novo</CardDescription>
            </div>
            <Button 
              type="button" 
              asChild
              disabled={isLoading}
              variant="outline"
            >
              <Link href="/home/scripts">
                <ArrowLeft/> Voltar
              </Link>
              
            </Button>
          </div>
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
                <Select name="scriptTypeId" onValueChange={(value) => handleChange("scriptTypeId", value)} value={formData.scriptTypeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipo</SelectLabel>
                      {scriptTypes.map((scriptType) => (
                        <SelectItem key={scriptType.id} value={scriptType.id.toString()}>
                          {scriptType.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.scriptTypeId && <p className="text-red-500">{errors.scriptTypeId}</p>}
              </div>

              {/* expectedReturn */}
              <div>
                <Label htmlFor="expectedReturnId">Retorno Esperado</Label>
                <Select disabled={expectedReturnsChained.length == 0} name="expectedReturnId" onValueChange={(value) => handleChange("expectedReturnId", value)} value={formData.expectedReturnId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um retorno esperado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Retorno Esperado</SelectLabel>
                      {expectedReturnsChained.map((expectedReturn) => (
                        <SelectItem key={expectedReturn.id} value={expectedReturn.id.toString()}>{expectedReturn.description}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.expectedReturn && <p className="text-red-500">{errors.expectedReturn}</p>}
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
            
            <div className="flex justify-end">
              <Button type="submit">
                <Plus/> Incluir script
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}