import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Missing Supabase configuration');
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      logger.error(`Supabase connection test failed: ${error.message}`);
      throw error;
    }

    logger.info('✅ Supabase connection successful');
  } catch (error) {
    logger.error(`❌ Supabase connection failed: ${error}`);
    throw error;
  }
};

// Test connection on startup
testConnection();

export default supabase;