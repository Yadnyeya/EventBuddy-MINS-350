// Setup Demo User for EventBuddy
// Creates the demo user shown on the login page

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createDemoUser() {
  console.log('🔧 Setting up demo user...\n');

  const demoEmail = 'john.doe@university.edu';
  const demoPassword = 'demo123';

  try {
    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: 'John Doe'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('✅ Demo user already exists');
        console.log(`📧 Email: ${demoEmail}`);
        console.log(`🔑 Password: ${demoPassword}\n`);
        return;
      }
      throw authError;
    }

    console.log('✅ Demo auth user created');

    // Create student profile
    const { error: profileError } = await supabase
      .from('student')
      .insert({
        student_id: authData.user.id,
        email: demoEmail,
        year: 'Junior'
      });

    if (profileError && !profileError.message.includes('duplicate')) {
      console.warn('⚠️  Could not create student profile:', profileError.message);
    } else {
      console.log('✅ Student profile created');
    }

    // Add some sample interests
    const interests = ['Technology', 'Photography', 'Hiking'];
    for (const interest of interests) {
      await supabase
        .from('interest')
        .insert({
          student_id: authData.user.id,
          interest_name: interest
        });
    }
    console.log('✅ Sample interests added');

    console.log('\n🎉 Demo user setup complete!');
    console.log(`📧 Email: ${demoEmail}`);
    console.log(`🔑 Password: ${demoPassword}`);
    console.log('\nYou can now log in with these credentials!\n');

  } catch (error) {
    console.error('❌ Error setting up demo user:', error.message);
    process.exit(1);
  }
}

createDemoUser();
