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

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://islamasloulou2009-droid.github.io/NIRO-QI/',
        'X-Title': 'Niro AI'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'أنت Niro AI، مساعد ذكاء اصطناعي ذكي ومفيد. تتحدث بالعربية دائماً.'
          },
          ...messages
        ]
      })
    });

    const rawText = await response.text();
    console.log('OpenRouter status:', response.status);
    console.log('OpenRouter response:', rawText);

    if (!response.ok) {
      return res.status(200).json({ reply: `خطأ من OpenRouter: ${response.status} - ${rawText.slice(0, 100)}` });
    }

    const data = JSON.parse(rawText);
    const reply = data.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من الرد.';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(200).json({ reply: `خطأ في السيرفر: ${error.message}` });
  }
}
