import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const host = searchParams.get('host')
    
    console.log({ API_URL, page, limit, host })
    const response = await axios.get(`${API_URL}`, { params: { page, limit, host } })
    return NextResponse.json(response.data)

}