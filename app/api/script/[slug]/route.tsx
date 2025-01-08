import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, { params }: { params: Promise<{ slug: string }> }, res: NextApiResponse) {
    const slug = (await params).slug
    console.log(slug)
    const data = {
        name: "Assistidos com movimentação de óbito",
        sqlQuery: "SELECT FROM sgm_paciente WHERE pac_codigo = '123'",
        type: "DELETE",
        expectedReturn: "3",
    }
    // console.log(req, res)
    if(req.method !== 'GET') {
        return res.status(201);
    }

    return Response.json(data)
}