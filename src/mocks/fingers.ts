import type { Finger } from '../types/sh.types'

export const mockFingers: Finger[] = [
  // sh-1 Tech Solutions
  { id: 'finger-1', software_house_id: 'sh-1', nome_completo: 'Paulo Henrique Rocha', email: 'paulo.rocha@finger.com.br', telefone: '(62) 98765-1111', cpf: '555.666.777-88', porcentagem: 15, prazo_meses: 24, cidade: 'Anápolis', estado: 'GO', data_vinculo: '2024-01-15T10:00:00Z' },
  { id: 'finger-2', software_house_id: 'sh-1', nome_completo: 'Amanda Silva Braga', email: 'amanda.braga@finger.com.br', telefone: '(62) 97654-2222', cpf: '666.777.888-99', porcentagem: 20, prazo_meses: 12, cidade: 'Goiânia', estado: 'GO', data_vinculo: '2024-02-10T10:00:00Z' },
  { id: 'finger-3', software_house_id: 'sh-1', nome_completo: 'Rodrigo Costa Melo', email: 'rodrigo.melo@finger.com.br', telefone: '(62) 96543-3333', cpf: '777.888.999-00', porcentagem: 10, prazo_meses: 6, cidade: 'Anápolis', estado: 'GO', data_vinculo: '2024-03-01T10:00:00Z' },

  // sh-2 Sistemas Integrados
  { id: 'finger-4', software_house_id: 'sh-2', nome_completo: 'Juliana Martins Prado', email: 'juliana.prado@finger.com.br', telefone: '(11) 98234-4444', cpf: '888.999.000-11', porcentagem: 12, prazo_meses: 18, cidade: 'São Paulo', estado: 'SP', data_vinculo: '2024-02-01T10:00:00Z' },
  { id: 'finger-5', software_house_id: 'sh-2', nome_completo: 'Marcos Vinicius Dias', email: 'marcos.vinicius@finger.com.br', telefone: '(11) 97123-5555', cpf: '999.000.111-22', porcentagem: 18, prazo_meses: 24, cidade: 'Campinas', estado: 'SP', data_vinculo: '2024-03-15T10:00:00Z' },

  // sh-3 Digital Commerce
  { id: 'finger-6', software_house_id: 'sh-3', nome_completo: 'Fernanda Lima Barros', email: 'fernanda.barros@finger.com.br', telefone: '(31) 98901-6666', cpf: '000.111.222-44', porcentagem: 8, prazo_meses: 12, cidade: 'Belo Horizonte', estado: 'MG', data_vinculo: '2024-03-10T10:00:00Z' },

  // sh-4 Cloud Retail
  { id: 'finger-7', software_house_id: 'sh-4', nome_completo: 'Diego Souza Carvalho', email: 'diego.carvalho@finger.com.br', telefone: '(21) 98012-7777', cpf: '111.222.444-66', porcentagem: 15, prazo_meses: 36, cidade: 'Rio de Janeiro', estado: 'RJ', data_vinculo: '2024-04-05T10:00:00Z' },
  { id: 'finger-8', software_house_id: 'sh-4', nome_completo: 'Larissa Nunes Faria', email: 'larissa.faria@finger.com.br', telefone: '(21) 97901-8888', cpf: '222.333.555-77', porcentagem: 20, prazo_meses: 24, cidade: 'Niterói', estado: 'RJ', data_vinculo: '2024-05-10T10:00:00Z' },

  // sh-5 CodeMaster
  { id: 'finger-9', software_house_id: 'sh-5', nome_completo: 'Rafael Torres Braga', email: 'rafael.braga@finger.com.br', telefone: '(41) 98790-9999', cpf: '333.444.666-88', porcentagem: 10, prazo_meses: 12, cidade: 'Curitiba', estado: 'PR', data_vinculo: '2024-05-12T10:00:00Z' },
]
