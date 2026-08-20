import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { catmons } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, context: Params) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await db.delete(catmons).where(eq(catmons.id, idNum));
  return NextResponse.json({ ok: true });
}
