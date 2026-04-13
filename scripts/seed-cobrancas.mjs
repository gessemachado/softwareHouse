import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://juuwryshbnlzxpbkrffm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1dXdyeXNoYm5senhwYmtyZmZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA1NDQzNCwiZXhwIjoyMDkxNjMwNDM0fQ.gyGWgwj0aQCe6599tmyCMtWYUD-g89S0A7OoCwCXu8A'
)

const periodos = ['01/2026', '02/2026', '03/2026', '04/2026']

// Valores base por vínculo (fictícios mas realistas)
const valoresPorVinculo = [
  1850.00, 2300.00, 975.50, 3100.00,
  1420.00, 2750.00, 1680.00, 890.00,
]

async function seed() {
  const { data: shcs, error } = await sb
    .from('sh_credenciados')
    .select('id')
    .order('created_at')

  if (error) { console.error(error.message); process.exit(1) }
  console.log('Vínculos encontrados:', shcs.length)

  const inserts = []
  shcs.forEach((shc, idx) => {
    periodos.forEach((periodo, pIdx) => {
      // Variação mensal de ±15%
      const base = valoresPorVinculo[idx] ?? 1500
      const variacao = 1 + (Math.sin(idx + pIdx) * 0.15)
      const valor = Math.round(base * variacao * 100) / 100
      inserts.push({
        sh_credenciado_id: shc.id,
        periodo,
        valor_taxa: valor,
      })
    })
  })

  console.log('Inserindo', inserts.length, 'cobranças...')
  const { data, error: e2 } = await sb
    .from('cobrancas')
    .insert(inserts)
    .select()

  if (e2) { console.error(e2.message); process.exit(1) }
  console.log('ok:', data.length, 'cobranças inseridas')
  console.log('\nSeed de cobranças completo!')
}

seed()
