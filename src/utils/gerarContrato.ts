import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, TableRow, TableCell, Table,
  WidthType,
} from 'docx'
import type { SoftwareHouse } from '../types/sh.types'

// ─── helpers ──────────────────────────────────────────────────────────────────

function pctExtenso(n: number): string {
  const map: Record<number, string> = {
    5: 'cinco', 10: 'dez', 12: 'doze', 15: 'quinze',
    20: 'vinte', 25: 'vinte e cinco', 30: 'trinta',
  }
  return map[n] ?? String(n)
}

function run(text: string, bold = false, size = 22): TextRun {
  return new TextRun({ text, bold, size, font: 'Times New Roman' })
}

function para(children: TextRun[], alignment: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.JUSTIFIED): Paragraph {
  return new Paragraph({ children, alignment, spacing: { after: 160 } })
}

function titulo(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, font: 'Times New Roman', allCaps: true })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
  })
}

function clausula(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, font: 'Times New Roman', allCaps: true })],
    spacing: { before: 300, after: 160 },
  })
}

function item(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Times New Roman' })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120 },
    indent: { left: 360 },
  })
}

function dataFormatada(date = new Date()): string {
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── main ─────────────────────────────────────────────────────────────────────

export async function gerarContrato(sh: SoftwareHouse): Promise<void> {
  const pct      = sh.participacao_sh
  const pctText  = `${pct}% (${pctExtenso(pct)} por cento)`
  const parceiro = sh.razao_social
  const cnpjParceiro = sh.cnpj
  const endParceiro  = `${sh.logradouro}, nº ${sh.numero}, Bairro: ${sh.bairro}, CEP: ${sh.cep}, ${sh.municipio}/${sh.estado}`

  // Usa os sócios cadastrados; se houver mais de um, lista todos na identificação
  const socios   = sh.socios ?? []
  const socio1   = socios[0]
  const repNome  = socio1?.nome  ?? '___________________'
  const repCPF   = socio1?.cpf   ?? '___.___.___-__'
  const repEmail = socio1?.email ?? '___________________'
  const repTipo  = socio1?.tipo  ?? 'Sócio Administrador'

  // Texto de qualificação dos signatários
  const qualificacaoParceiro = socios.length > 1
    ? socios.map(s => `${s.nome}, ${s.tipo}, CPF nº ${s.cpf}`).join('; e ')
    : `${repNome}, ${repTipo}, CPF/MF nº ${repCPF} e endereço eletrônico ${repEmail}`

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1418, bottom: 1418, left: 1701, right: 1134 } } },
      children: [

        titulo('CONTRATO DE PARCERIA TECNOLÓGICA E COMERCIAL'),

        para([run('Por este instrumento particular e na melhor forma de direito, as partes:')]),

        para([
          run('BUYHELP SOFTWARE E SERVIÇOS LTDA', true),
          run(', com sede na Cidade de Barueri, Estado de São Paulo, na Alameda: Rio Negro, nº 503, Bairro: Alphaville – Centro Industrial e Empresarial, CEP 06.454-000, inscrita no CNPJ/MF sob o nº '),
          run('51.743.548/0001-62', true),
          run(', neste ato representada por Flávio Naves da Silva, CEO, com CPF/MF nº 006.123.271-83, endereço eletrônico flavio.navis@BuyHelp.com.br, doravante denominada '),
          run('"BUYHELP"', true),
          run(';'),
        ]),

        para([
          run('e '),
          run(parceiro, true),
          run(', sociedade empresária limitada, inscrita no CNPJ/MF sob o nº '),
          run(cnpjParceiro, true),
          run(`, com sede na ${endParceiro}, neste ato representada por ${qualificacaoParceiro}, na forma de seus atos constitutivos, doravante denominada `),
          run('"PARCEIRO"', true),
          run('.'),
        ]),

        para([run('BUYHELP e PARCEIRO são doravante denominados, em conjunto, como "PARTES" e, individual e indistintamente, como "PARTE".')]),

        para([run('CONSIDERANDO QUE:', true)]),

        item('A BUYHELP é sociedade empresária especializada em, por meio de um software de sua propriedade, realizar a coleta das informações relativas aos produtos específicos adquiridos por um consumidor final (pessoa física) em um estabelecimento comercial credenciado e licenciado junto à BUYHELP para, após a coleta, realizar análises das operações e, quando possível, conceder descontos à compra, preservando a margem bruta do estabelecimento que vende os produtos ao consumidor ("Plataforma BuyHelp");'),

        item(`O PARCEIRO é uma empresa idônea, com experiência no mercado em que atua, oferece uma plataforma tecnológica própria de ERP aos estabelecimentos comerciais a si vinculados ("Estabelecimentos Comerciais"), os quais demonstraram interesse na possibilidade de utilizar a Plataforma BuyHelp;`),

        item('BUYHELP e PARCEIRO verificaram uma possibilidade de celebrar uma parceria, por meio da qual o PARCEIRO atuará como agente integrador das operações solicitadas pelos clientes, comercializando, implantando e prestando suporte da Plataforma BuyHelp aos Estabelecimentos Comerciais que estivessem sob a Aplicação do Parceiro;'),

        item('As Partes desejam acordar os termos e condições aplicáveis para a formalização dessa parceria;'),

        para([run('RESOLVEM AS PARTES firmar o presente Contrato de Parceria Tecnológica e Comercial ("Contrato"), que se regerá pelas seguintes cláusulas e condições:')]),

        // ── CLÁUSULA 1 ──────────────────────────────────────────────────────────
        clausula('CLÁUSULA 1ª – DEFINIÇÕES'),

        para([run('1.1 Para os fins deste Contrato, aplicam-se as seguintes definições:')]),
        item('a) "Carteira de Clientes": conjunto de Estabelecimentos Credenciados pelo PARCEIRO no âmbito do presente Contrato;'),
        item('b) "Contrato BuyHelp": Contrato de credenciamento e licenciamento celebrado entre BUYHELP e um Estabelecimento Comercial;'),
        item('c) "Estabelecimento Credenciado": cada um dos Estabelecimentos Indicados pelo PARCEIRO, cujo credenciamento foi aprovado pela BUYHELP;'),
        item('d) "Estabelecimento Indicado": Estabelecimento Comercial indicado pelo Parceiro em decorrência de suas atividades no âmbito deste Contrato;'),
        item('e) "Perdas": danos diretos comprovadamente incorridos por uma Parte, incluindo custos, despesas, honorários advocatícios e verbas de sucumbência;'),
        item('f) "Políticas": todas as políticas e procedimentos da BUYHELP que vierem a ser disponibilizados;'),
        item('g) "Propriedade Intelectual": inclui patentes, marcas, direitos autorais, segredos comerciais, softwares e demais direitos de propriedade intelectual;'),
        item('h) "Suporte de Primeiro Nível": atendimento inicial aos estabelecimentos credenciados, incluindo orientação sobre uso básico, resolução de problemas simples de conectividade, esclarecimento de dúvidas operacionais básicas, treinamento inicial e encaminhamento de problemas complexos para níveis superiores.'),
        para([run('1.2 Qualquer alteração ao Contrato apenas será válida se formalizada por escrito e assinado pelas Partes.')]),

        // ── CLÁUSULA 2 ──────────────────────────────────────────────────────────
        clausula('CLÁUSULA 2ª - DO OBJETO'),

        para([run('2.1 O Contrato tem como objeto o estabelecimento dos termos e condições que irão guiar o relacionamento das Partes no que diz respeito à comercialização, implantação e suporte completos, pelo PARCEIRO, da Plataforma BuyHelp aos Estabelecimentos Comerciais ("Parceria").')]),
        para([run('2.2 No âmbito da Parceria, o PARCEIRO atuará como agente integrador das operações solicitadas pelos clientes, sendo responsável por:')]),
        item('a) Integração: Integrar a Plataforma BuyHelp à Aplicação do Parceiro, sem custos para a BUYHELP, a fim de que os Estabelecimentos Comerciais possam oferecer a Plataforma BuyHelp aos seus consumidores finais;'),
        item('b) Indicação, Credenciamento e Acompanhamento: Realizar a indicação e o credenciamento de Estabelecimentos Comerciais a si vinculados para participarem da rede de Estabelecimentos Credenciados, bem como o acompanhamento dos Estabelecimentos Credenciados que vierem a integrar a sua Carteira de Clientes.'),
        para([run('2.3 Cada Estabelecimento Credenciado receberá um token único e intransferível para comunicação com a Plataforma BuyHelp, sendo expressamente vedado o compartilhamento entre estabelecimentos.')]),

        // ── CLÁUSULA 3 ──────────────────────────────────────────────────────────
        clausula('CLÁUSULA 3ª - DA INTEGRAÇÃO TECNOLÓGICA'),

        para([run('3.1 A BUYHELP disponibilizará ao PARCEIRO as ferramentas e diretrizes necessárias para a integração da Plataforma BuyHelp à Aplicação do Parceiro.')]),
        para([run('3.2 O PARCEIRO será responsável por realizar todas as adaptações tecnológicas necessárias, sem custos para a BUYHELP.')]),
        para([run('3.3 Cada estabelecimento receberá um token único e intransferível para comunicação com a Plataforma BuyHelp.')]),
        para([run('3.4 Os tokens são de uso exclusivo do estabelecimento para o qual foram gerados, sendo expressamente vedado: a) Compartilhamento de tokens entre estabelecimentos; b) Uso de token de um estabelecimento por outro; c) Cessão ou transferência de tokens a terceiros; d) Utilização de tokens para fins diversos da intermediação autorizada.')]),
        para([run('3.5 A BUYHELP se reserva o direito de revogar tokens em caso de uso indevido, mediante notificação prévia ao PARCEIRO.')]),

        // ── CLÁUSULA 4 ──────────────────────────────────────────────────────────
        clausula('CLÁUSULA 4ª - DAS OBRIGAÇÕES DO PARCEIRO'),

        para([run('4.1 Sem prejuízo das demais obrigações previstas neste Contrato, são obrigações do PARCEIRO:')]),
        item('a) Realizar as integrações e adaptações tecnológicas necessárias na Aplicação do Parceiro para viabilizar a utilização da Plataforma BuyHelp, sem custos para a BUYHELP;'),
        item('b) Prestar a Indicação e o Credenciamento de Estabelecimentos Comerciais a si vinculados para participarem da rede de Estabelecimentos Credenciados da BUYHELP;'),
        item('c) Observar e exigir que os Estabelecimentos Credenciados observem as Políticas e/ou diretrizes informadas pela BUYHELP;'),
        item('d) Não firmar qualquer compromisso vinculante em nome da BUYHELP, esclarecendo aos Estabelecimentos Comerciais que não possui autoridade para tanto;'),
        item('e) Garantir que os Estabelecimentos Credenciados reconhecem que a utilização da Plataforma BuyHelp está vinculada à celebração e ao cumprimento do Contrato BuyHelp;'),
        item('f) Utilizar e zelar pela marca e nome da BUYHELP de acordo com este Contrato e recomendações da BUYHELP;'),
        item('g) Fornecer suporte técnico de primeiro nível aos estabelecimentos integrados, compreendendo: resolução de problemas de conectividade simples; esclarecimento de dúvidas operacionais básicas; suporte para configurações básicas do sistema; encaminhamento de problemas complexos para suporte especializado da BUYHELP;'),
        item('h) Orientar sobre o uso correto dos tokens únicos e comunicar imediatamente qualquer uso indevido;'),
        item('i) Conceder acesso sem custos adicionais aos eventos que a BUYHELP julgar importantes, considerando que o PARCEIRO já remunera a parceria através da recorrência;'),

        // ── CLÁUSULA 5 ──────────────────────────────────────────────────────────
        clausula('CLÁUSULA 5ª - DAS OBRIGAÇÕES DA BUYHELP'),

        para([run('5.1 Sem prejuízo das demais obrigações previstas neste Contrato, são obrigações da BUYHELP:')]),
        item('a) Disponibilizar a Plataforma BuyHelp aos Estabelecimentos Credenciados, nos termos do Contrato BuyHelp;'),
        item('b) Disponibilizar os sistemas, ferramentas e/ou adaptações tecnológicas para viabilizar a Integração pelo Parceiro;'),
        item('c) Definir e apresentar ao PARCEIRO as diretrizes e as condições comerciais aplicáveis à Plataforma BuyHelp;'),
        item('d) Realizar o pagamento da Remuneração ao PARCEIRO, exclusivamente sobre o produto de intermediação recorrente;'),
        item('e) Realizar treinamentos, apresentações e fornecer orientações ao PARCEIRO sobre a Plataforma BuyHelp;'),
        item('f) Fornecer suporte comercial ao PARCEIRO, incluindo: participação em reuniões com prospects quando necessário; elaboração de propostas comerciais personalizadas; suporte técnico-comercial para fechamento de negócios; materiais de marketing e vendas atualizados; treinamento comercial da equipe do PARCEIRO; apoio em apresentações para grandes contas;'),
        item('g) Gerar tokens únicos para cada estabelecimento credenciado;'),
        item('h) Fornecer suporte técnico especializado (primeiro, segundo e terceiro níveis);'),
        item('i) Fornecer relatórios mensais sobre: receitas geradas pelos estabelecimentos da carteira do PARCEIRO; comissões devidas e pagas; volume de transações processadas por estabelecimento; performance dos estabelecimentos credenciados;'),

        // ── CLÁUSULA 6 ──────────────────────────────────────────────────────────
        clausula('CLÁUSULA 6ª - DA REMUNERAÇÃO E CONDIÇÕES DE PAGAMENTO'),

        para([
          run('6.1 Como contrapartida pelos serviços prestados, a BUYHELP pagará ao PARCEIRO '),
          run(pctText, true),
          run(' sobre o valor líquido da receita mensal recorrente gerada exclusivamente pelo produto de intermediação entre a BUYHELP e os supermercados credenciados através do PARCEIRO.'),
        ]),
        para([run('6.2 IMPORTANTE: A remuneração do PARCEIRO incide SOMENTE sobre o produto de intermediação recorrente entre BUYHELP e o supermercado credenciado, NÃO incidindo sobre: a) Serviços de implantação; b) Outros eventuais produtos da BUYHELP;')]),
        para([run('6.3 O valor líquido da receita recorrente será calculado após a dedução dos seguintes impostos, taxas e contribuições incidentes sobre o faturamento da BUYHELP: a) Impostos Federais: PIS, COFINS; b) ISS (Imposto sobre Serviços de Qualquer Natureza); c) Outros tributos que venham a incidir especificamente sobre a receita de intermediação.')]),
        para([run('6.4 Não haverá cobrança de taxa de setup, implementação ou qualquer outro custo inicial por parte do PARCEIRO.')]),
        para([run('6.5 O PARCEIRO reconhece e declara que os valores estipulados contemplam todos os custos e despesas envolvidos na Integração e na prestação dos Serviços, sendo que nenhum pagamento a título de reembolso ou despesa adicional será feito pela BUYHELP.')]),
        para([run('6.6 O pagamento será efetuado mensalmente, até o 10º (décimo) dia útil do mês subsequente, mediante apresentação de relatório detalhado das transações processadas.')]),
        para([run('6.7 A comissão será devida enquanto o estabelecimento permanecer ativo e processando transações de intermediação através da tecnologia BUYHELP.')]),

        // ── CLÁUSULA 7 ──────────────────────────────────────────────────────────
        clausula('CLÁUSULA 7ª - DA AUSÊNCIA DE EXCLUSIVIDADE'),

        para([run('7.1 NÃO HAVERÁ EXCLUSIVIDADE para o PARCEIRO em qualquer território, segmento ou modalidade de atuação.')]),
        para([run('7.2 A BUYHELP poderá: a) Atender diretamente estabelecimentos que a procurem; b) Firmar parcerias com outros integradores; c) Comercializar através de outros canais; d) Participar de licitações e concorrências.')]),

        // ── CLÁUSULA 8 ──────────────────────────────────────────────────────────
        clausula('CLÁUSULA 8ª - DA RESPONSABILIDADE E INDENIZAÇÃO'),

        para([run('8.1 Responsabilidade do Parceiro: O PARCEIRO será responsável por: a) Integração da Plataforma BuyHelp à Aplicação do Parceiro; b) Prestação de Indicação, Credenciamento e Acompanhamento; c) Disponibilização aos Estabelecimentos Credenciados do acesso à Plataforma BuyHelp; d) Prestação dos Serviços do Parceiro; e) Suporte técnico de primeiro nível conforme definido neste contrato.')]),
        para([run('8.2 Responsabilidade da BUYHELP: A BUYHELP será responsável por: a) Disponibilização da Plataforma BuyHelp; b) Demais atos jurídicos necessários para possibilitar a Integração; c) Suporte técnico especializado; d) Suporte comercial conforme estabelecido neste contrato.')]),
        para([run('8.3 O PARCEIRO se obriga, de modo irrevogável e irretratável, a defender, indenizar e manter a BUYHELP indene em relação a toda e qualquer Perda comprovadamente incorrida em decorrência de ato ou fato que o PARCEIRO tenha dado causa.')]),
        para([run('8.4 Na hipótese de uma das Partes vir a ser demandada por obrigação de qualquer natureza por terceiro, por ato ou fato decorrente da outra Parte, a Parte Responsável se obriga a assumir a responsabilidade pelas obrigações exigidas.')]),

        // ── CLÁUSULA 9 ──────────────────────────────────────────────────────────
        clausula('CLÁUSULA 9ª - DA PROPRIEDADE INTELECTUAL E MARCAS'),

        para([run('9.1 As Partes são legítimas proprietárias dos direitos de Propriedade Intelectual necessários à condução dos seus negócios.')]),
        para([run('9.2 A tecnologia de intermediação, algoritmos, métodos e processos da BUYHELP permanecem de sua exclusiva propriedade intelectual.')]),
        para([run('9.3 Os códigos de integração desenvolvidos pelo PARCEIRO serão de propriedade do PARCEIRO, podendo ser utilizados em outros projetos desde que não violem a confidencialidade da BUYHELP.')]),
        para([run('9.4 Exclusivamente para fins da consecução das obrigações deste Contrato, as Partes concedem-se mutuamente licença limitada, revogável, intransferível e não-exclusiva de uso das suas respectivas marcas.')]),
        para([run('9.5 Na hipótese de rescisão ou término do Contrato, as Partes deverão cessar, no prazo de 5 (cinco) dias, o uso de toda e qualquer marca, logotipos e Propriedade Intelectual da outra Parte.')]),

        // ── CLÁUSULA 10 ─────────────────────────────────────────────────────────
        clausula('CLÁUSULA 10ª - DA CONFIDENCIALIDADE E SEGURANÇA DAS INFORMAÇÕES'),

        para([run('10.1 As Partes obrigam-se a manter estrita confidencialidade e sigilo sobre qualquer Informação Confidencial da outra Parte a que tiverem acesso em razão do presente Contrato.')]),
        para([run('10.2 Por informações confidenciais entende-se qualquer dado, informação, documento e conhecimento obtido pela parte receptora junto à parte divulgadora, incluindo fórmulas, algoritmos, processos, clientes, condições comerciais, custos, estratégias e know-how.')]),
        para([run('10.3 Não é considerada Informação Confidencial aquela que: a) Estiver em domínio público antes de sua obtenção; b) Cair em domínio público sem descumprimento deste Contrato; c) Legitimamente já era conhecida pela outra Parte; d) Seja desenvolvida independentemente pela Parte Receptora.')]),
        para([run('10.4 As Partes são responsáveis pela segurança de todas as informações fornecidas e devem manter procedimentos de segurança que evitem a utilização indevida de dados pessoais.')]),
        para([run('10.5 As Partes declaram expressamente que cumprem a Lei nº 13.709/2018 (LGPD) no que se refere ao objeto deste Contrato.')]),
        para([run('10.6 O dever de confidencialidade permanecerá em vigor durante a vigência deste Contrato e pelo prazo de 5 (cinco) anos a contar de seu término.')]),

        // ── CLÁUSULA 11 ─────────────────────────────────────────────────────────
        clausula('CLÁUSULA 11ª - DA PROTEÇÃO DE FUNCIONÁRIOS E PARCEIROS (NÃO ALICIAMENTO)'),

        para([run('11.1 Durante a vigência deste contrato e por 12 (doze) meses após sua rescisão, nenhuma das PARTES poderá, sem o consentimento expresso e por escrito da outra:')]),
        item('a) Contratar, solicitar, induzir ou tentar contratar funcionários, consultores, prestadores de serviços ou parceiros da outra PARTE;'),
        item('b) Solicitar que funcionários ou parceiros da outra PARTE deixem seus cargos ou funções;'),
        item('c) Interferir nas relações contratuais da outra PARTE com seus funcionários ou parceiros.'),
        para([run('11.2 Esta cláusula aplica-se a todos os níveis hierárquicos e modalidades de contratação (CLT, PJ, consultoria, parceria).')]),
        para([run('11.3 A violação desta cláusula sujeitará a PARTE infratora ao pagamento de multa de R$ 500.000,00 (quinhentos mil reais) por cada funcionário ou parceiro aliciado.')]),

        // ── CLÁUSULA 12 ─────────────────────────────────────────────────────────
        clausula('CLÁUSULA 12ª - DA NÃO CONCORRÊNCIA'),

        para([run('12.1 Durante a vigência deste contrato e por 36 (trinta e seis) meses após sua rescisão, o PARCEIRO se compromete a não:')]),
        item('a) Desenvolver, comercializar ou distribuir soluções concorrentes à tecnologia de intermediação da BUYHELP;'),
        item('b) Prestar serviços de integração para concorrentes diretos da BUYHELP;'),
        item('c) Utilizar conhecimentos adquiridos sobre a tecnologia BUYHELP em benefício de terceiros;'),
        item('d) Divulgar informações técnicas ou comerciais da BUYHELP.'),
        para([run('12.2 A violação desta cláusula sujeitará o PARCEIRO ao pagamento de multa de R$ 5.000.000,00 (cinco milhões de reais).')]),

        // ── CLÁUSULA 13 ─────────────────────────────────────────────────────────
        clausula('CLÁUSULA 13ª - DO PRAZO DE VIGÊNCIA E EXTINÇÃO'),

        para([run('13.1 Prazo de Vigência: Este Contrato entra em vigor na presente data e vigorará pelo prazo de 24 (vinte e quatro) meses.')]),
        para([run('13.2 Renovação Automática: O Contrato será automaticamente renovado por períodos de 12 (doze) meses, salvo manifestação contrária com antecedência de 90 (noventa) dias.')]),
        para([run('13.3 Resilição Unilateral: Qualquer das Partes poderá rescindir o Contrato, a qualquer tempo, mediante comunicação por escrito com, no mínimo, 90 (noventa) dias de antecedência.')]),
        para([run('13.4 Resolução: O presente Contrato poderá ser resolvido imediatamente nas seguintes hipóteses: a) Descumprimento de qualquer disposição do presente Contrato; b) Constatação de fraude pelas Partes; c) Decretação de falência ou recuperação judicial; d) Uso indevido do nome ou marca de uma Parte; e) Violação das cláusulas de não aliciamento ou não concorrência; f) Uso indevido de tokens de acesso.')]),
        para([run('13.5 Independência do Contrato BuyHelp: A extinção do Contrato não afetará qualquer Contrato BuyHelp celebrado entre a BUYHELP e qualquer Estabelecimento Credenciado.')]),
        para([run('13.6 Manutenção das Obrigações: O término do Contrato não exonera as Partes do cumprimento de todas as obrigações decorrentes do Contrato, inclusive quanto à obrigação da BUYHELP em manter a remuneração enquanto vigentes os credenciamentos gerados.')]),
        para([run('13.7 Cláusulas Perenes: As disposições das Cláusulas 9, 10, 11, 12 e 13 subsistirão em caso de resilição ou extinção do Contrato.')]),

        // ── CLÁUSULA 14 ─────────────────────────────────────────────────────────
        clausula('CLÁUSULA 14ª - DAS PENALIDADES'),

        para([run('14.1 O descumprimento de obrigações contratuais sujeitará a PARTE infratora ao pagamento de uma multa de 10% sobre o valor das comissões pagas nos últimos 12 meses.')]),
        para([run('14.2 A penalidade não exime do cumprimento das obrigações nem da reparação de danos.')]),

        // ── CLÁUSULA 15 ─────────────────────────────────────────────────────────
        clausula('CLÁUSULA 15ª - DAS DISPOSIÇÕES GERAIS'),

        para([run('15.1 Cessão: O PARCEIRO não poderá ceder este Contrato sem o consentimento prévio e escrito da BUYHELP.')]),
        para([run('15.2 Responsabilidades: O presente Contrato não estabelece vínculo trabalhista entre as Partes. Cada Parte arcará com as despesas e obrigações trabalhistas e previdenciárias referentes aos seus empregados.')]),
        para([run('15.3 Acordo Integral: O presente Contrato constitui o único e integral entendimento entre as Partes, substituindo integralmente quaisquer outros documentos anteriores.')]),
        para([run('15.4 Independência das Disposições: Caso qualquer disposição seja considerada inválida, as demais permanecerão em vigor.')]),
        para([run('15.5 Independência das Partes: As Partes declaram estar agindo de forma independente, não constituindo joint venture ou associação.')]),
        para([run('15.6 Tolerância: A tolerância de qualquer Parte em demandar o cumprimento de qualquer direito não importará em renúncia ao exercício de tal direito.')]),
        para([run('15.7 Tributos: Os tributos e contribuições que incidam sobre as importâncias pagas em decorrência deste Contrato serão suportados pelo seu contribuinte.')]),
        para([run('15.8 Irretratabilidade: Este Contrato é celebrado em caráter irretratável, vinculando as Partes, seus herdeiros e sucessores.')]),

        // ── CLÁUSULA 16 ─────────────────────────────────────────────────────────
        clausula('CLÁUSULA 16ª - DO FORO'),

        para([run('16.1 Qualquer questão ou disputa decorrente deste Contrato deverá ser submetida ao Foro da Comarca de Barueri, Estado de São Paulo, com expressa renúncia a qualquer outro foro.')]),

        // ── Assinaturas ─────────────────────────────────────────────────────────
        new Paragraph({ spacing: { before: 400 } }),

        para([run(`E, assim, estando justas e contratadas, as Partes assinam o presente Contrato em ${dataFormatada()}.`)]),

        new Paragraph({ spacing: { before: 600 } }),

        // Tabela de assinaturas
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top:    { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left:   { style: BorderStyle.NONE },
            right:  { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: '_______________________________', size: 22, font: 'Times New Roman' })],
                      alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: 'BUYHELP SOFTWARE E SERVIÇOS LTDA', bold: true, size: 22, font: 'Times New Roman' })],
                      alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: 'Flávio Naves da Silva – CEO', size: 20, font: 'Times New Roman' })],
                      alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: 'CPF: 006.123.271-83', size: 20, font: 'Times New Roman' })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: parceiro, bold: true, size: 22, font: 'Times New Roman' })],
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 200 },
                    }),
                    ...(socios.length === 0
                      ? [
                          new Paragraph({
                            children: [new TextRun({ text: '_______________________________', size: 22, font: 'Times New Roman' })],
                            alignment: AlignmentType.CENTER,
                          }),
                          new Paragraph({
                            children: [new TextRun({ text: repNome, size: 20, font: 'Times New Roman' })],
                            alignment: AlignmentType.CENTER,
                          }),
                          new Paragraph({
                            children: [new TextRun({ text: `CPF: ${repCPF}`, size: 20, font: 'Times New Roman' })],
                            alignment: AlignmentType.CENTER,
                          }),
                        ]
                      : socios.flatMap(s => [
                          new Paragraph({
                            children: [new TextRun({ text: '_______________________________', size: 22, font: 'Times New Roman' })],
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 300 },
                          }),
                          new Paragraph({
                            children: [new TextRun({ text: s.nome, bold: true, size: 20, font: 'Times New Roman' })],
                            alignment: AlignmentType.CENTER,
                          }),
                          new Paragraph({
                            children: [new TextRun({ text: s.tipo, size: 20, font: 'Times New Roman' })],
                            alignment: AlignmentType.CENTER,
                          }),
                          new Paragraph({
                            children: [new TextRun({ text: `CPF: ${s.cpf}`, size: 20, font: 'Times New Roman' })],
                            alignment: AlignmentType.CENTER,
                          }),
                        ])
                    ),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `Contrato_${sh.razao_social.replace(/\s+/g, '_')}.docx`
  a.click()
  URL.revokeObjectURL(url)
}
