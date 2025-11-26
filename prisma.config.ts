import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'postgres://postgres:1234@127.0.0.1:5432/abo_rami',
  },
});

