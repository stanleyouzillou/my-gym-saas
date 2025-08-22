import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  // Path is relative to the repository root
  schema: 'prisma/schema.prisma',
});
