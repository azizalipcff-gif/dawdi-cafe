/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// Load .env.local manually so this script has the same env as Next in dev
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2];
      // strip surrounding quotes
      if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function uploadTestImage() {
  const imgPath = path.resolve(__dirname, 'test-img.png');
  // 1x1 transparent PNG
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAnMB9J7KacwAAAAASUVORK5CYII=';
  const buf = Buffer.from(pngBase64, 'base64');
  fs.writeFileSync(imgPath, buf);

  const key = `e2e/test-img-${Date.now()}.png`;
  const { data, error } = await supabase.storage.from('images').upload(key, buf, { cacheControl: '3600', upsert: false, contentType: 'image/png' });
  if (error) {
    console.error('upload error', error);
    throw error;
  }
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/images/${encodeURIComponent(key)}`;
  console.log('uploaded image url', publicUrl);
  return publicUrl;
}

async function createProducts(imageUrl) {
  const now = new Date().toISOString();
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

  const { data, error } = await supabase.from('products').insert(products).select('*');
  if (error) {
    console.error('insert products error', error);
    throw error;
  }
  console.log('created products', data.map((p) => ({ id: p.id, name: p.name })));
  return data;
}

async function createAdminUser() {
  const email = `e2e-admin+${Date.now()}@example.com`;
  const password = 'Password123!';
  console.log('creating admin user', email);
  // Use the admin API
  try {
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) {
      console.error('create user error', error);
      throw error;
    }
    const uid = data?.user?.id;
    console.log('created admin user id', uid);
    // Add to admins table if exists (best-effort)
    try {
      const adminsTable = await supabase.from('admins').select('id').limit(1);
      if (!adminsTable.error) {
        await supabase.from('admins').insert([{ user_id: uid }]);
        console.log('inserted into admins table');
      }
    } catch (e) {
      // ignore
    }
    return { email, password, id: uid };
  } catch (err) {
    console.error('admin create failed', err.message || err);
    throw err;
  }
}

(async function main() {
  try {
    const imageUrl = await uploadTestImage();
    const prods = await createProducts(imageUrl);
    const admin = await createAdminUser();
    console.log('done', { products: prods.map((p) => p.id), admin });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
