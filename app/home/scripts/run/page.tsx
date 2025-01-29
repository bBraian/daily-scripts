/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

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
              <CardTitle>Rodar scripts</CardTitle>
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
          <div className="space-y-6">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <Button>Rodar todos os scripts (14)</Button>
              <Button>Selecionar scripts para rodar</Button>

            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  )
}