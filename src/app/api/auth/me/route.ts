import api from '@/services/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await api.get('/auth/me');
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
}