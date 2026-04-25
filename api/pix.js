// Arquivo: api/pix.js
export default async function handler(req, res) {
  // 1. Configuração de CORS (Permite que o seu site converse com este servidor)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Garante que só aceitamos requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // 3. Faz a requisição REAL para a Pagap escondendo a sua Secret Key
    const pagapResponse = await fetch("https://api.pagap.com.br/functions/v1/create-pix-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // A chave secreta será puxada das configurações da Vercel (invisível no código)
        "x-api-key": process.env.PAGAP_SECRET_KEY 
      },
      body: JSON.stringify(req.body) // Repassa os dados (nome, cpf, valor) que vieram do seu site
    });

    const data = await pagapResponse.json();

    // 4. Devolve a resposta da Pagap para o seu site
    return res.status(pagapResponse.status).json(data);

  } catch (error) {
    console.error("Erro no servidor interno:", error);
    return res.status(500).json({ error: 'Erro ao conectar com a Pagap' });
  }
}