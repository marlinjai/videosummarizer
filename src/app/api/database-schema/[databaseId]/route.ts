// app/api/database-schema/[databaseId]/route.ts
import { fetchDatabaseSchema } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { databaseId: string } }
) {
  const { databaseId } = params;
  try {
    const schema = await fetchDatabaseSchema(databaseId);
    return NextResponse.json(schema);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
