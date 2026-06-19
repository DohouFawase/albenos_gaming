import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

const FILE_NAME = 'tournament-inscriptions.json';

async function getCurrentData() {
  try {
    const { blobs } = await list({ prefix: FILE_NAME });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch {
    return [];
  }
}

export async function GET() {
  const data = await getCurrentData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, prenom, age, telephone } = body;

    if (!nom || !prenom || !age || !telephone) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const data = await getCurrentData();

    const newEntry = {
      id: Date.now().toString(),
      nom,
      prenom,
      age,
      telephone,
      date: new Date().toISOString(),
    };

    data.push(newEntry);

    await put(FILE_NAME, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}