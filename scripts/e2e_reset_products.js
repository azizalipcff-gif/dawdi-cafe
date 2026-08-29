import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function main() {
  const { data: existing } = await supabase.from('products').select('id,name').ilike('name', 'E2E Product%');
  if (existing && existing.length > 0) {
    console.log('deleting', existing.length, 'existing E2E products');
    const ids = existing.map((r) => r.id);
    await supabase.from('products').delete().in('id', ids);
  }

  const now = new Date().toISOString();
  const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/images/e2e%2Ftest-img-1787976489710.png`;
  const products = [
    {
      name: 'E2E Product A (published, available, not featured)',
      description: 'A',
      price: 10,
      discount: 0,
      image_url: imageUrl,
      is_available: true,
      is_featured: false,
      is_recommended: false,
      status: 'published',
      sort_order: 100,
      created_at: now,
      updated_at: now,
    },
    {
      name: 'E2E Product B (published, available, featured)',
      description: 'B',
      price: 12,
      discount: 0,
      image_url: imageUrl,
      is_available: true,
      is_featured: true,
      is_recommended: false,
      status: 'published',
      sort_order: 101,
      created_at: now,
      updated_at: now,
    },
    {
      name: 'E2E Product C (pending, available, featured)',
      description: 'C',
      price: 9,
      discount: 0,
      image_url: imageUrl,
      is_available: true,
      is_featured: true,
      is_recommended: false,
      status: 'pending',
      sort_order: 102,
      created_at: now,
      updated_at: now,
    },
  ];
  const { data: inserted, error } = await supabase.from('products').insert(products).select('*');
  if (error) {
    console.error('insert error', error);
    process.exit(1);
  }
  console.log('reset products created', inserted.map((p) => p.id));
}

main();
