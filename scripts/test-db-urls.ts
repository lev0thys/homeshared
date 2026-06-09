import { PrismaClient } from '@prisma/client';

async function main() {
  const direct = process.env.DIRECT_DATABASE_URL;
  if (!direct) throw new Error('DIRECT_DATABASE_URL manquant');

  const password = direct.match(/postgres:([^@]+)@/)?.[1];
  if (!password) throw new Error('Mot de passe illisible');

  const ref = 'ygjgwyvokflwlnlhrolw';
  const attempts: { label: string; url: string }[] = [
    { label: 'direct', url: direct },
    {
      label: 'aws-0 session',
      url: `postgresql://postgres.${ref}:${password}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?schema=public`,
    },
    {
      label: 'aws-1 session',
      url: `postgresql://postgres.${ref}:${password}@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?schema=public`,
    },
    {
      label: 'aws-0 transaction',
      url: `postgresql://postgres.${ref}:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public`,
    },
    {
      label: 'aws-1 transaction',
      url: `postgresql://postgres.${ref}:${password}@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public`,
    },
  ];

  for (const { label, url } of attempts) {
    const prisma = new PrismaClient({ datasources: { db: { url } } });
    try {
      await prisma.$queryRaw`SELECT 1 AS ok`;
      console.log(`✓ ${label}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message.split('\n')[0] : String(err);
      console.log(`✗ ${label} — ${msg}`);
    } finally {
      await prisma.$disconnect();
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
