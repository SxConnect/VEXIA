// Script de teste para submeter uma resposta
const fetch = require('node-fetch');

const testData = {
    questionarioId: '4527bac4-75ce-41a7-bee7-0dc58311f9ca',
    nome: 'Teste Debug',
    whatsapp: '+5521999999999',
    tipoEmpresa: 'Teste',
    respostas: [
        {
            perguntaId: 'aaa90614-71fb-4b14-980f-f22cb1e2e322',
            resposta: JSON.stringify({ opcaoId: 'algum-id-de-opcao' }),
            respostaTexto: null
        }
    ]
};

console.log('Enviando:', JSON.stringify(testData, null, 2));

fetch('http://localhost:3000/api/public/responder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
})
    .then(res => res.json())
    .then(data => console.log('Resposta:', data))
    .catch(err => console.error('Erro:', err));
