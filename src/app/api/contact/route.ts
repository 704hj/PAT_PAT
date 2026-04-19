import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, message: '필수 항목 누락' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY 미설정');
    return NextResponse.json(
      { ok: false, message: '메일 서비스가 구성되지 않았습니다.' },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

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
