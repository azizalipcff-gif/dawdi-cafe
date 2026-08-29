const { createClient } = require('@supabase/supabase-js');
const id = 'a4f9251a-fcc3-4723-9395-56f39620a879';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing Supabase env vars. NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.');
  process.exit(2);
}
const supabase = createClient(url, key);
(async () => {
  console.log('Inspecting product', id);
  const { data: product, error: prodErr } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .maybeSingle();
  if (prodErr) {
    console.error('Error fetching product:', prodErr);
  } else if (!product) {
    console.log('Product not found');
  } else {
    console.log('Product row:', JSON.stringify(product, null, 2));
  }

  // Reproduce getProducts(false) used by menu (status=published, no is_available filter)
  const { data: allMenuRows } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .order('sort_order');
  console.log('\nMenu query returned rows:', (allMenuRows || []).length);
  const menuMatches = (allMenuRows || []).filter((r) => r.id === id);
  console.log('Menu rows matching id:', menuMatches.length);

  // Reproduce getProducts(true) used by homepage (status=published, is_available=true)
  const { data: homeRows } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .eq('is_available', true)
    .order('sort_order');
  console.log('\nHomepage query returned rows:', (homeRows || []).length);
  const homeMatches = (homeRows || []).filter((r) => r.id === id);
  console.log('Homepage rows matching id:', homeMatches.length);

  // Check featured query
  const { data: featuredRows } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .eq('is_available', true)
    .order('sort_order')
    .limit(50);
  console.log('\nFeatured query returned rows:', (featuredRows || []).length);
  const featuredMatches = (featuredRows || []).filter((r) => r.id === id);
  console.log('Featured rows matching id:', featuredMatches.length);

  // Check duplicates in raw menuRows (by id)
  function dupInfo(rows) {
    const counts = {};
    for (const r of rows) counts[r.id] = (counts[r.id] || 0) + 1;
    const dups = Object.entries(counts).filter(([k,v])=>v>1);
    return { total: rows.length, unique: Object.keys(counts).length, dupCount: dups.length, dups };
  }
  console.log('\nMenu rows dup info:', dupInfo(allMenuRows || []));
  console.log('Homepage rows dup info:', dupInfo(homeRows || []));
  console.log('Featured rows dup info:', dupInfo(featuredRows || []));

  // Check categories count and duplicates
  const { data: cats } = await supabase.from('categories').select('*').order('sort_order');
  console.log('\nCategories total:', (cats || []).length);
  const catCounts = {};
  for (const c of (cats || [])) catCounts[c.id] = (catCounts[c.id] || 0) + 1;
  const catDups = Object.entries(catCounts).filter(([k,v])=>v>1);
  console.log('Categories dup count:', catDups.length, catDups.slice(0,5));

  process.exit(0);
})();
