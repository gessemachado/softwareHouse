import type { Credenciado, SHCredenciado } from '../types/sh.types'
import { mockRepresentantes } from './representantes'
import { mockFingers } from './fingers'

export const mockCredenciadosDisponiveis: Credenciado[] = [
  { id: 'cred-1', nome: 'Supermercado Bom Preço Ltda', cnpj: '11.222.333/0001-44', cidade: 'Anápolis', estado: 'GO' },
  { id: 'cred-2', nome: 'Rede Farmácias Saúde SA', cnpj: '22.333.444/0001-55', cidade: 'São Paulo', estado: 'SP' },
  { id: 'cred-3', nome: 'Comercial Varejo Central Ltda', cnpj: '33.444.555/0001-66', cidade: 'Rio de Janeiro', estado: 'RJ' },
  { id: 'cred-4', nome: 'Distribuidora Alpha Atacado SA', cnpj: '44.555.666/0001-77', cidade: 'Curitiba', estado: 'PR' },
  { id: 'cred-5', nome: 'Posto Combustíveis BR Ltda', cnpj: '55.666.777/0001-88', cidade: 'Porto Alegre', estado: 'RS' },
  { id: 'cred-6', nome: 'Magazine Eletrônicos Ltda', cnpj: '66.777.888/0001-99', cidade: 'São Paulo', estado: 'SP' },
  { id: 'cred-7', nome: 'Supermercados Norte Ltda', cnpj: '77.888.999/0001-10', cidade: 'Fortaleza', estado: 'CE' },
  { id: 'cred-8', nome: 'Padaria e Confeitaria Real Ltda', cnpj: '88.999.000/0001-21', cidade: 'Campo Grande', estado: 'MS' },
  { id: 'cred-9', nome: 'Lojas Moda Fashion SA', cnpj: '99.000.111/0001-32', cidade: 'Manaus', estado: 'AM' },
  { id: 'cred-10', nome: 'Auto Peças Total Ltda', cnpj: '10.111.222/0001-43', cidade: 'Belo Horizonte', estado: 'MG' },
  { id: 'cred-11', nome: 'Restaurante Sabor & Arte Ltda', cnpj: '21.222.333/0001-54', cidade: 'Salvador', estado: 'BA' },
  { id: 'cred-12', nome: 'Academia FitMax SA', cnpj: '32.333.444/0001-65', cidade: 'Curitiba', estado: 'PR' },
]

const reps = mockRepresentantes
const fingers = mockFingers

export const mockCredenciadosVinculados: SHCredenciado[] = [
  // sh-1 Tech Solutions
  { id: 'shcred-1', software_house_id: 'sh-1', credenciado_id: 'cred-1', representante_id: 'rep-1', finger_id: 'finger-1', credenciado: mockCredenciadosDisponiveis[0], representante: reps[0], finger: fingers[0] },
  { id: 'shcred-2', software_house_id: 'sh-1', credenciado_id: 'cred-6', representante_id: 'rep-2', finger_id: 'finger-2', credenciado: mockCredenciadosDisponiveis[5], representante: reps[1], finger: fingers[1] },
  { id: 'shcred-3', software_house_id: 'sh-1', credenciado_id: 'cred-10', representante_id: 'rep-3', finger_id: 'finger-3', credenciado: mockCredenciadosDisponiveis[9], representante: reps[2], finger: fingers[2] },

  // sh-2 Sistemas Integrados
  { id: 'shcred-4', software_house_id: 'sh-2', credenciado_id: 'cred-2', representante_id: 'rep-5', finger_id: 'finger-4', credenciado: mockCredenciadosDisponiveis[1], representante: reps[4], finger: fingers[3] },
  { id: 'shcred-5', software_house_id: 'sh-2', credenciado_id: 'cred-5', representante_id: 'rep-6', finger_id: 'finger-5', credenciado: mockCredenciadosDisponiveis[4], representante: reps[5], finger: fingers[4] },

  // sh-3 Digital Commerce
  { id: 'shcred-6', software_house_id: 'sh-3', credenciado_id: 'cred-3', representante_id: 'rep-8', finger_id: 'finger-6', credenciado: mockCredenciadosDisponiveis[2], representante: reps[7], finger: fingers[5] },

  // sh-4 Cloud Retail
  { id: 'shcred-7', software_house_id: 'sh-4', credenciado_id: 'cred-9', representante_id: 'rep-10', finger_id: 'finger-7', credenciado: mockCredenciadosDisponiveis[8], representante: reps[9], finger: fingers[6] },
  { id: 'shcred-8', software_house_id: 'sh-4', credenciado_id: 'cred-11', representante_id: 'rep-11', finger_id: 'finger-8', credenciado: mockCredenciadosDisponiveis[10], representante: reps[10], finger: fingers[7] },

  // sh-5 CodeMaster
  { id: 'shcred-9', software_house_id: 'sh-5', credenciado_id: 'cred-4', representante_id: 'rep-12', finger_id: 'finger-9', credenciado: mockCredenciadosDisponiveis[3], representante: reps[11], finger: fingers[8] },
  { id: 'shcred-10', software_house_id: 'sh-5', credenciado_id: 'cred-12', representante_id: 'rep-13', finger_id: 'finger-9', credenciado: mockCredenciadosDisponiveis[11], representante: reps[12], finger: fingers[8] },
]
