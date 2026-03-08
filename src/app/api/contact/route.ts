import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, message: '필수 항목 누락' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'hyoung1566@gmail.com',
    subject: `[PAT PAT 문의] ${name}`,
    text: `이름: ${name}\n이메일: ${email}\n\n${message}`,
  });

  if (error) {
    console.error('[contact] resend error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
