import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { catmons, NewCatmon } from "@/db/schema";
import { desc } from "drizzle-orm";
import { generateCardImage } from "@/lib/pollinations";
import { generateCatmon } from "@/lib/generate";

export const runtime = "nodejs";

interface CreateRequest {
  furColor?: string;
  vibe?: string;
  photoThumb?: string; // small base64 thumbnail of user photo
}

/** Create a new AI-generated catmon card. */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateRequest;

    const furColor =
      typeof body.furColor === "string" && body.furColor.trim()
        ? body.furColor.trim().slice(0, 60)
        : "cinnamon orange";
    const vibe =
      typeof body.vibe === "string" && body.vibe.trim()
        ? body.vibe.trim().slice(0, 60)
        : "playful";
    const photoThumb =
      typeof body.photoThumb === "string" && body.photoThumb.startsWith("data:image/")
        ? body.photoThumb.slice(0, 300_000)
        : null;

    const catmon = generateCatmon();
    const { imageData } = await generateCardImage(furColor, vibe);

    const row: NewCatmon = {
      name: catmon.name,
      type: catmon.typeName,
      description: catmon.description,
      imageData,
      originalImageData: photoThumb,
      hp: catmon.hp,
      attack: catmon.attack,
      defense: catmon.defense,
      speed: catmon.speed,
      is_shiny: catmon.isShiny,
    };

    const [inserted] = await db.insert(catmons).values(row).returning();
    return NextResponse.json({ card: serialize(inserted) }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("POST /api/catmons", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** List all cards, newest first. */
export async function GET() {
  const rows = await db.select().from(catmons).orderBy(desc(catmons.createdAt), desc(catmons.id));
  return NextResponse.json({ cards: rows.map(serialize) });
}

function serialize(row: (typeof catmons.$inferSelect)) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    description: row.description,
    imageData: row.imageData,
    originalImageData: row.originalImageData,
    hp: row.hp,
    attack: row.attack,
    defense: row.defense,
    speed: row.speed,
    is_shiny: row.is_shiny,
    createdAt: row.createdAt,
  };
}
