import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://juuwryshbnlzxpbkrffm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1dXdyeXNoYm5senhwYmtyZmZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA1NDQzNCwiZXhwIjoyMDkxNjMwNDM0fQ.gyGWgwj0aQCe6599tmyCMtWYUD-g89S0A7OoCwCXu8A'
)

async function seed() {
  console.log('Inserindo credenciados...')
  const { data: creds, error: e1 } = await sb.from('credenciados').insert([
    { nome: 'Supermercado BomPreço',       cnpj: '11.222.333/0001-44', cidade: 'São Paulo',        estado: 'SP' },
    { nome: 'Farmácia Saúde Total',        cnpj: '22.333.444/0001-55', cidade: 'Rio de Janeiro',   estado: 'RJ' },
    { nome: 'Auto Peças Rápido',           cnpj: '33.444.555/0001-66', cidade: 'Belo Horizonte',   estado: 'MG' },
    { nome: 'Padaria Pão Quente',          cnpj: '44.555.666/0001-77', cidade: 'Curitiba',         estado: 'PR' },
    { nome: 'Posto Combustível Central',   cnpj: '55.666.777/0001-88', cidade: 'Porto Alegre',     estado: 'RS' },
    { nome: 'Ótica Visão Clara',           cnpj: '66.777.888/0001-99', cidade: 'Salvador',         estado: 'BA' },
    { nome: 'Loja de Roupas ModaFácil',    cnpj: '77.888.999/0001-00', cidade: 'Fortaleza',        estado: 'CE' },
    { nome: 'Pizzaria Bella Napoli',       cnpj: '88.999.000/0001-11', cidade: 'Brasília',         estado: 'DF' },
  ]).select()
  if (e1) { console.error('credenciados:', e1.message); process.exit(1) }
  console.log('  ok:', creds.length)

  console.log('Inserindo software houses...')
  const { data: shs, error: e2 } = await sb.from('software_houses').insert([
    {
      cnpj: '12.345.678/0001-90', nome_fantasia: 'TechSoft Solutions',
      razao_social: 'TechSoft Solutions Ltda', email: 'contato@techsoft.com.br',
      telefone: '(11) 98765-4321', cep: '01310-100', logradouro: 'Av. Paulista',
      numero: '1000', bairro: 'Bela Vista', municipio: 'São Paulo', estado: 'SP',
      prazo_pagamento: 30, participacao_sh: 70, participacao_representante: 15, status: 'ativa',
    },
    {
      cnpj: '98.765.432/0001-10', nome_fantasia: 'InovaSys',
      razao_social: 'InovaSys Tecnologia Ltda', email: 'comercial@inovasys.com.br',
      telefone: '(21) 97654-3210', cep: '20040-020', logradouro: 'Av. Rio Branco',
      numero: '200', bairro: 'Centro', municipio: 'Rio de Janeiro', estado: 'RJ',
      prazo_pagamento: 15, participacao_sh: 65, participacao_representante: 20, status: 'ativa',
    },
    {
      cnpj: '11.223.344/0001-55', nome_fantasia: 'DataBridge',
      razao_social: 'DataBridge Sistemas S.A.', email: 'suporte@databridge.com.br',
      telefone: '(31) 96543-2109', cep: '30112-000', logradouro: 'Rua dos Caetés',
      numero: '500', bairro: 'Centro', municipio: 'Belo Horizonte', estado: 'MG',
      prazo_pagamento: 45, participacao_sh: 60, participacao_representante: 25, status: 'ativa',
    },
    {
      cnpj: '55.667.788/0001-33', nome_fantasia: 'CodeMaster',
      razao_social: 'CodeMaster Dev Ltda', email: 'financeiro@codemaster.com.br',
      telefone: '(41) 95432-1098', cep: '80010-010', logradouro: 'Rua XV de Novembro',
      numero: '300', bairro: 'Centro', municipio: 'Curitiba', estado: 'PR',
      prazo_pagamento: 30, participacao_sh: 72, participacao_representante: 18, status: 'inativa',
    },
  ]).select()
  if (e2) { console.error('software_houses:', e2.message); process.exit(1) }
  console.log('  ok:', shs.length)

  console.log('Inserindo representantes...')
  const { data: reps, error: e3 } = await sb.from('representantes').insert([
    { software_house_id: shs[0].id, nome_completo: 'Carlos Eduardo Mendes',  email: 'carlos@techsoft.com.br',    telefone: '(11) 91234-5678', cpf: '123.456.789-00', cidade: 'São Paulo',       estado: 'SP', data_vinculo: '2024-01-15' },
    { software_house_id: shs[0].id, nome_completo: 'Ana Paula Rodrigues',     email: 'ana@techsoft.com.br',       telefone: '(11) 92345-6789', cpf: '234.567.890-11', cidade: 'Campinas',        estado: 'SP', data_vinculo: '2024-03-01' },
    { software_house_id: shs[1].id, nome_completo: 'Roberto Alves Lima',      email: 'roberto@inovasys.com.br',   telefone: '(21) 93456-7890', cpf: '345.678.901-22', cidade: 'Rio de Janeiro',  estado: 'RJ', data_vinculo: '2024-02-10' },
    { software_house_id: shs[2].id, nome_completo: 'Fernanda Costa Silva',    email: 'fernanda@databridge.com.br',telefone: '(31) 94567-8901', cpf: '456.789.012-33', cidade: 'Belo Horizonte', estado: 'MG', data_vinculo: '2024-04-05' },
    { software_house_id: shs[3].id, nome_completo: 'Marcos Oliveira Neto',    email: 'marcos@codemaster.com.br',  telefone: '(41) 95678-9012', cpf: '567.890.123-44', cidade: 'Curitiba',        estado: 'PR', data_vinculo: '2023-11-20' },
  ]).select()
  if (e3) { console.error('representantes:', e3.message); process.exit(1) }
  console.log('  ok:', reps.length)

  console.log('Inserindo fingers...')
  const { data: fingers, error: e4 } = await sb.from('fingers').insert([
    { software_house_id: shs[0].id, nome_completo: 'Patricia Souza',      email: 'patricia@techsoft.com.br',  telefone: '(11) 96789-0123', cpf: '678.901.234-55', porcentagem: 10, prazo_meses: 12, cidade: 'São Paulo', estado: 'SP', data_vinculo: '2024-01-15' },
    { software_house_id: shs[0].id, nome_completo: 'Diego Ferreira',       email: 'diego@techsoft.com.br',     telefone: '(11) 97890-1234', cpf: '789.012.345-66', porcentagem:  8, prazo_meses:  6, cidade: 'Santos',    estado: 'SP', data_vinculo: '2024-03-01' },
    { software_house_id: shs[1].id, nome_completo: 'Juliana Martins',      email: 'juliana@inovasys.com.br',   telefone: '(21) 98901-2345', cpf: '890.123.456-77', porcentagem: 12, prazo_meses: 24, cidade: 'Niterói',   estado: 'RJ', data_vinculo: '2024-02-10' },
    { software_house_id: shs[2].id, nome_completo: 'André Santos Pereira', email: 'andre@databridge.com.br',   telefone: '(31) 99012-3456', cpf: '901.234.567-88', porcentagem:  9, prazo_meses: 12, cidade: 'Contagem',  estado: 'MG', data_vinculo: '2024-04-05' },
    { software_house_id: shs[3].id, nome_completo: 'Luciana Ribeiro',      email: 'luciana@codemaster.com.br', telefone: '(41) 90123-4567', cpf: '012.345.678-99', porcentagem: 11, prazo_meses: 18, cidade: 'Londrina',  estado: 'PR', data_vinculo: '2023-11-20' },
  ]).select()
  if (e4) { console.error('fingers:', e4.message); process.exit(1) }
  console.log('  ok:', fingers.length)

  console.log('Inserindo vínculos sh_credenciados...')
  const { data: shc, error: e5 } = await sb.from('sh_credenciados').insert([
    { software_house_id: shs[0].id, credenciado_id: creds[0].id, representante_id: reps[0].id, finger_id: fingers[0].id },
    { software_house_id: shs[0].id, credenciado_id: creds[1].id, representante_id: reps[1].id, finger_id: fingers[1].id },
    { software_house_id: shs[0].id, credenciado_id: creds[2].id, representante_id: reps[0].id, finger_id: fingers[0].id },
    { software_house_id: shs[1].id, credenciado_id: creds[3].id, representante_id: reps[2].id, finger_id: fingers[2].id },
    { software_house_id: shs[1].id, credenciado_id: creds[4].id, representante_id: reps[2].id, finger_id: fingers[2].id },
    { software_house_id: shs[2].id, credenciado_id: creds[5].id, representante_id: reps[3].id, finger_id: fingers[3].id },
    { software_house_id: shs[2].id, credenciado_id: creds[6].id, representante_id: reps[3].id, finger_id: fingers[3].id },
    { software_house_id: shs[3].id, credenciado_id: creds[7].id, representante_id: reps[4].id, finger_id: fingers[4].id },
  ]).select()
  if (e5) { console.error('sh_credenciados:', e5.message); process.exit(1) }
  console.log('  ok:', shc.length)

  console.log('\nSeed completo!')
}

seed()
