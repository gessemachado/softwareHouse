import type { Credenciado, SHCredenciado } from '../types/sh.types'
import { mockRepresentantes } from './representantes'
import { mockFingers } from './fingers'

export const mockCredenciadosDisponiveis: Credenciado[] = [
  { id: 'cred-1', nome: 'Inovação Tech', cnpj: '11.111.111/0001-11', cidade: 'São Paulo', estado: 'SP' },
  { id: 'cred-2', nome: 'Smart Business', cnpj: '22.222.222/0001-22', cidade: 'Campinas', estado: 'SP' },
  { id: 'cred-3', nome: 'Cloud Systems', cnpj: '33.333.333/0001-33', cidade: 'Rio de Janeiro', estado: 'RJ' },
  { id: 'cred-4', nome: 'Data Solutions', cnpj: '44.444.444/0001-44', cidade: 'Belo Horizonte', estado: 'MG' },
  { id: 'cred-5', nome: 'Mega Systems', cnpj: '55.555.555/0001-55', cidade: 'Curitiba', estado: 'PR' },
  { id: 'cred-6', nome: 'Tech Solutions', cnpj: '66.666.666/0001-66', cidade: 'Porto Alegre', estado: 'RS' },
]

export const mockCredenciadosVinculados: SHCredenciado[] = [
  {
    id: 'shcred-1',
    software_house_id: 'sh-1',
    credenciado_id: 'cred-7',
    representante_id: 'rep-1',
    finger_id: 'finger-1',
    credenciado: { id: 'cred-7', nome: 'Credenciado Ltda', cnpj: '77.777.777/0001-77', cidade: 'São Paulo', estado: 'SP' },
    representante: mockRepresentantes[0],
    finger: mockFingers[0],
  },
  {
    id: 'shcred-2',
    software_house_id: 'sh-1',
    credenciado_id: 'cred-8',
    representante_id: 'rep-2',
    finger_id: 'finger-2',
    credenciado: { id: 'cred-8', nome: 'Tech Solutions SA', cnpj: '88.888.888/0001-88', cidade: 'Campinas', estado: 'SP' },
    representante: mockRepresentantes[1],
    finger: mockFingers[1],
  },
  {
    id: 'shcred-3',
    software_house_id: 'sh-1',
    credenciado_id: 'cred-9',
    representante_id: 'rep-3',
    finger_id: 'finger-3',
    credenciado: { id: 'cred-9', nome: 'Digital Commerce SA', cnpj: '99.999.999/0001-99', cidade: 'Rio de Janeiro', estado: 'RJ' },
    representante: mockRepresentantes[2],
    finger: mockFingers[2],
  },
]
