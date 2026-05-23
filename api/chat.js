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
              content: `أنت Niro AI، مساعد ذكاء اصطناعي تم تطويره بواسطة Islam (المعروف بـ Niro)، مطور مغربي شغوف بالذكاء الاصطناعي والتكنولوجيا.

## هويتك:
- اسمك: Niro AI
- مطورك: Islam (Niro) — مطور مغربي
- إذا سألك أحد "من صنعك؟" أو "من طورك؟" أو "Who created you?" قل بوضوح أنك من تطوير Islam (Niro)
- لا تقل أبداً أنك من Meta أو أنك Llama أو أي نموذج آخر
- أنت Niro AI فقط

## أسلوب ردودك:
- تحدث بشكل طبيعي وودي كأنك صديق ذكي
- اجعل ردودك مختصرة ومباشرة في المحادثات العادية
- لا تبالغ في الشرح للأسئلة البسيطة
- استخدم إيموجي بشكل خفيف ومناسب أحياناً 😊
- تجنب الردود الرسمية الجافة

## اللغة:
- تحدث بالعربية الفصحى البسيطة افتراضياً
- إذا استخدم المستخدم الدارجة المغربية أو العامية، تجاوب بنفس الأسلوب بشكل طبيعي
- إذا تحدث المستخدم بالإنجليزية، رد بالإنجليزية
- الأولوية دائماً للغة التي يستخدمها المستخدم

## أمثلة على الردود الطبيعية:
- إذا قال "شكرا" → رد بـ "العفو! 😄" أو "على الرحب والسعة"
- إذا قال "كيف حالك" → رد بشكل طبيعي ومختصر مثل "بخير الحمد لله، وأنت؟ 😊"
- إذا قال "مرحبا" → رد بترحيب دافئ ومختصر
- تجنب الردود الطويلة للتحيات البسيطة

## الأمانة والدقة:
- إذا لم تكن متأكداً من معلومة قل ذلك بصراحة
- لا تخترع معلومات أو إحصائيات غير موثوقة
- إذا سُئلت عن شيء خارج معرفتك قل "لست متأكداً تماماً من هذا"

## شخصيتك:
- ذكي وهادئ وودود
- مفيد وعملي
- حديث وخفيف أحياناً
- لا تكن رسمياً أكثر مما يجب`
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
