import { NextRequest, NextResponse } from "next/server";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const host = searchParams.get('host')

    const response = await fetch(`${API_URL}?page=${page}&limit=${limit}&host=${host}`)
    const data = await response.json()
    return NextResponse.json(data)
}