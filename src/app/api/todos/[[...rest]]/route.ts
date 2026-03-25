import { type NextRequest, NextResponse } from "next/server";

function backendUrl(): string {
    return process.env.BACKEND_URL ?? "http://127.0.0.1:3010";
}

type RouteCtx = { params: Promise<{ rest?: string[] | string }> };

function segmentsFromParams(rest: string[] | string | undefined): string[] {
    if (rest == null) return [];
    if (Array.isArray(rest)) return rest;
    return [rest];
}

/** Single handler tree avoids Next.js sibling conflict between route.ts and [id]/route.ts (POST /api/todos → 404). */
export async function GET(_req: NextRequest, ctx: RouteCtx) {
    const { rest } = await ctx.params;
    if (segmentsFromParams(rest).length > 0) {
        return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const r = await fetch(`${backendUrl()}/todos`, { cache: "no-store" });
    const data = await r.json().catch(() => null);
    return NextResponse.json(data, { status: r.status });
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
    const { rest } = await ctx.params;
    if (segmentsFromParams(rest).length > 0) {
        return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const body = await req.text();
    const r = await fetch(`${backendUrl()}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
    });
    const data = await r.json().catch(() => null);
    return NextResponse.json(data, { status: r.status });
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
    const { rest } = await ctx.params;
    const segs = segmentsFromParams(rest);
    if (segs.length !== 1) {
        return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const id = segs[0];
    const body = await req.text();
    const r = await fetch(`${backendUrl()}/todos/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body,
    });
    const data = await r.json().catch(() => null);
    return NextResponse.json(data, { status: r.status });
}

export async function DELETE(_req: NextRequest, ctx: RouteCtx) {
    const { rest } = await ctx.params;
    const segs = segmentsFromParams(rest);
    if (segs.length !== 1) {
        return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const id = segs[0];
    const r = await fetch(`${backendUrl()}/todos/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
    if (r.status === 204) {
        return new NextResponse(null, { status: 204 });
    }
    const data = await r.json().catch(() => null);
    return NextResponse.json(data, { status: r.status });
}
