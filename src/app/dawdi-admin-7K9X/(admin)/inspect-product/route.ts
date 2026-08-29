import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();

  // Fetch the product with its category
  const { data: product, error: prodErr } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", id)
    .maybeSingle();

  if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 500 });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Reproduce menu (status=published, no is_available filter)
  const { data: menuRows } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("sort_order");

  // Reproduce homepage (status=published, is_available=true)
  const { data: homeRows } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("is_available", true)
    .order("sort_order");

  // Featured
  const { data: featuredRows } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("is_featured", true)
    .eq("is_available", true)
    .order("sort_order")
    .limit(100);

  // Categories
  const { data: cats } = await supabase.from("categories").select("*").order("sort_order");

  // Build duplicate info
  function dupInfo(rows: any[] | null) {
    const counts: Record<string, number> = {};
    for (const r of rows ?? []) counts[r.id] = (counts[r.id] || 0) + 1;
    const dups = Object.entries(counts).filter(([, v]) => v > 1).map(([k, v]) => ({ id: k, count: v }));
    return { total: (rows ?? []).length, unique: Object.keys(counts).length, dupCount: dups.length, dups };
  }

  return NextResponse.json({
    product,
    menuRowsCount: (menuRows ?? []).length,
    menuMatches: (menuRows ?? []).filter((r: any) => r.id === id).length,
    menuDupInfo: dupInfo(menuRows),
    homeRowsCount: (homeRows ?? []).length,
    homeMatches: (homeRows ?? []).filter((r: any) => r.id === id).length,
    homeDupInfo: dupInfo(homeRows),
    featuredRowsCount: (featuredRows ?? []).length,
    featuredMatches: (featuredRows ?? []).filter((r: any) => r.id === id).length,
    featuredDupInfo: dupInfo(featuredRows),
    categoriesCount: (cats ?? []).length,
    categoryDupInfo: dupInfo(cats),
  });
}
