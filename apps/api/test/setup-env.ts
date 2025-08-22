import path from 'path';
import dotenv from 'dotenv';

// From apps/api/test -> repo root .env is three levels up
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
