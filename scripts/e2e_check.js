const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '..', '.env.local');
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

(async function () {
  const { data, error } = await supabase.from('products').select('*').ilike('name', 'E2E Product%');
  if (error) {
    console.error('error', error);
    process.exit(1);
  }
  console.log('found', data.length, 'products');
  for (const p of data) {
    console.log(p.id, p.name, p.status, p.is_available, p.is_featured, p.image_url);
  }
})();
