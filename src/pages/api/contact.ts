import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  // Stub — replace with real email/CRM integration
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
