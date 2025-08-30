import { useState } from 'react'
import { salvarFiscalizacao } from '../services/localDb'
import { obterLocalizacao } from '../utils/geo'

function FormularioFiscalizacao() {
  const [nome, setNome] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().substring(0, 10))
  const [coordenadas, setCoordenadas] = useState({ lat: null, lng: null })
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensagem('Obtendo localização...')
    setCarregando(true)

    let pos = { lat: null, lng: null }

    try {
      pos = await obterLocalizacao()
      setCoordenadas(pos)
    } catch (err) {
      console.error('Erro ao obter localização:', err)
      setMensagem('Erro ao obter localização. Salvando mesmo assim...')
    }

    const dados = {
      nome,
      data,
      coordenadas: pos,
      criadoEm: new Date().toISOString()
    }

    try {
      await salvarFiscalizacao(dados)
      setMensagem('Fiscalização salva localmente com sucesso!')
      setNome('')
      setCoordenadas({ lat: null, lng: null })
    } catch (err) {
      console.error('Erro ao salvar', err)
      setMensagem('Erro ao salvar dados')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome do Fiscal</label><br />
        <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
      </div>

      <div>
        <label>Data</label><br />
        <input type="date" value={data} onChange={e => setData(e.target.value)} required />
      </div>

      <button type="submit" disabled={carregando}>
        {carregando ? 'Salvando...' : 'Salvar'}
      </button>

      {mensagem && <p style={{ marginTop: 10 }}>{mensagem}</p>}
    </form>
  )
}

export default FormularioFiscalizacao
