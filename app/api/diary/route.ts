import { supabase } from "@/app/lib/supbase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("diary")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("diary")
    .insert([
      {
        user_id: body.user_id,
        title: body.title,
        content: body.content,
        emotion: body.emotion,
        mbti: body.mbti,
      },
    ])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0]);
}
