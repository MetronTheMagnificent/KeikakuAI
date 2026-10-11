import type { APIRoute } from 'astro';

const SYSTEM_PROMPT = `You are Keiku, a friendly AI assistant for Keikaku AI Consulting.
Keikaku AI helps businesses in Mexico and Latin America automate processes with AI.
Services: process automation (RPA, workflows), AI chatbots (LLMs, customer service), custom AI tools (dashboards, data extractors), workflow integration (CRM, ERP, APIs).
Founder: Marcelo Arteaga. Contact: keikakuconsulting@gmail.com, WhatsApp +52 812 370 5584.
Implementation: 2–4 weeks. Free 30-min diagnostic call available.

Respond in the same language the user writes in (Spanish or English). Keep answers short (2–4 sentences). Your goal is to understand their business problem and gently encourage them to book a free diagnostic call via WhatsApp.`;

export const POST: APIRoute = async ({ request }) => {
  const { messages, lang } = await request.json();

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Upstream error' }), { status: 502 });
  }

  const data = await res.json();
  const reply = data.content?.[0]?.text ?? '';
  return new Response(JSON.stringify({ reply }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
