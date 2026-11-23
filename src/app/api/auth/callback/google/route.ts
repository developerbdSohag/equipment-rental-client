import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, baseUrl)
    );
  }

  // Redirect to login with successful Google authentication payload
  const redirectUrl = new URL('/login', baseUrl);
  redirectUrl.searchParams.set('auth', 'success');
  redirectUrl.searchParams.set('provider', 'google');
  if (code) {
    redirectUrl.searchParams.set('code', code);
  }

  return NextResponse.redirect(redirectUrl);
}
