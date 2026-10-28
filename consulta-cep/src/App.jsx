
import { useState } from 'react'
import './App.css'

function App() {
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function consultarCep(event) {
    event.preventDefault()

    const cepLimpo = cep.replace(/\D/g, '')

    if (cepLimpo.length !== 8) {
      setErro('Digite um CEP válido com 8 números.')
      setEndereco(null)
      return
    }

    setCarregando(true)
    setErro('')
    setEndereco(null)

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível consultar o CEP.')
      }

      const dados = await resposta.json()

      if (dados.erro) {
        throw new Error('CEP não encontrado.')
      }

      setEndereco(dados)
    } catch (erro) {
      setErro(erro.message || 'Ocorreu um erro na consulta.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="container">
      <h1>Consulta de CEP</h1>
      <p>Encontre informações de um endereço brasileiro.</p>

      <form onSubmit={consultarCep}>
        <label htmlFor="cep">CEP</label>

        <input
          id="cep"
          type="text"
          value={cep}
          onChange={(event) => setCep(event.target.value)}
          placeholder="Digite o CEP"
          maxLength={9}
        />

        <button type="submit" disabled={carregando}>
          {carregando ? 'Consultando...' : 'Consultar'}
        </button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      {endereco && (
        <section className="resultado">
          <h2>Endereço encontrado</h2>

          <p><strong>CEP:</strong> {endereco.cep}</p>
          <p><strong>Logradouro:</strong> {endereco.logradouro || 'Não informado'}</p>
          <p><strong>Bairro:</strong> {endereco.bairro || 'Não informado'}</p>
          <p><strong>Cidade:</strong> {endereco.localidade}</p>
          <p><strong>Estado:</strong> {endereco.uf}</p>
        </section>
      )}
    </main>
  )
}

export default App
