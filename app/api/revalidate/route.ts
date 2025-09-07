// app/api/revalidate/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { secret, path } = await req.json();
    if (secret !== process.env.MY_REVALIDATE_SECRET) return NextResponse.json({ ok: false }, { status: 401 });
    try {
        await res.revalidate(path); // in app router use: import { revalidatePath } from 'next/cache' depending on version
        return NextResponse.json({ revalidated: true });
    } catch (err) {
        return NextResponse.json({ revalidated: false, err: String(err) }, { status: 500 });
    }
}
