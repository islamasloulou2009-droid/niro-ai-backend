export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' });
    }

    const ACCOUNT_ID = 'ca2683f26d091b8c72054dcef21340cd';
    const API_TOKEN = process.env.CF_API_TOKEN;

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'أنت Niro AI، مساعد ذكاء اصطناعي ذكي ومفيد وودود. تتحدث بالعربية دائماً ما لم يتحدث المستخدم بلغة أخرى. ردودك واضحة ومنظمة ومفيدة.'
            },
            ...messages
          ]
        })
      }
    );

    const rawText = await response.text();

    if (!response.ok) {
      return res.status(200).json({ reply: `خطأ: ${response.status} - ${rawText.slice(0, 100)}` });
    }

    const data = JSON.parse(rawText);
    const reply = data.result?.response || 'عذراً، لم أتمكن من الرد.';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: `خطأ: ${error.message}` });
  }
}
