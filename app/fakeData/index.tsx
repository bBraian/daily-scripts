export type Script = {
  id: number;
  name: string;
  type: string;
  expectedReturn: number | null;
  sqlQuery: string;
  createdTime: string;
  updatedTime: string;
}

export const data: Script[] = [
  {
    id: 1,
    name: "Movimentação coerente Assistido",
    type: "SELECT",
    expectedReturn: null,
    sqlQuery: "SELECT FROM sgm_paciente",
    createdTime: "2024-09-03 19:40:16",
    updatedTime: "2024-11-20 06:01:46"
  },
  {
    id: 2,
    name: "Movimentação Óbito",
    type: "SELECT",
    expectedReturn: null,
    sqlQuery: "SELECT FROM sgm_paciente",
    createdTime: "2024-12-17 14:04:14",
    updatedTime: "2024-12-18 00:39:52"
  },
  {
    id: 3,
    name: "Atualizar data e usuário da ocorrência do NPS 1 ano depois do último evento",
    type: "UPDATE",
    expectedReturn: null,
    sqlQuery: "SELECT FROM sgm_paciente",
    createdTime: "2024-12-10 08:22:26",
    updatedTime: "2024-12-17 02:42:05"
  },
  {
    id: 4,
    name: "Verificar se tem evento com status concluído mas sem data de finalização",
    type: "DELETE",
    expectedReturn: null,
    sqlQuery: "DELETE FROM sgm_paciente",
    createdTime: "2023-01-01 09:06:27",
    updatedTime: "2023-06-16 13:19:10"
  },
  {
    id: 5,
    name: "Verificar ocorrências finalizadas",
    type: "INSERT",
    expectedReturn: null,
    sqlQuery: "SELECT FROM sgm_paciente",
    createdTime: "2024-05-26 11:20:14",
    updatedTime: "2024-11-13 11:20:45"
  },
];