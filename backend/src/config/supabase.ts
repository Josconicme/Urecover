import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Find the project root to locate the config file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../../config.json');

let config;
try {
  const configFile = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configFile);
} catch (error) {
  logger.error(`Could not read or parse config.json at ${configPath}`, error);
  throw new Error('Could not load configuration from config.json');
}

const supabaseUrl = config.SUPABASE_URL;
const supabaseServiceKey = config.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Missing Supabase configuration in config.json');
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided in config.json');
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