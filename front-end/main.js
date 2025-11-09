const API_URL = "http://localhost:8080/veiculos";
const MARCAS_URL = "http://localhost:8080/marcas";

//  Listagem de veículos (index.html)
async function initListagem() {
  const tabela = document.querySelector("#tabela-veiculos tbody");
  const response = await fetch(API_URL);
  const veiculos = await response.json();

  tabela.innerHTML = veiculos.map(v => `
    <tr>
      <td>${v.marca?.nome || "Sem marca"}</td>
      <td>${v.modelo}</td>
      <td>${v.ano}</td>
      <td>${v.cor}</td>
      <td>${v.quilometragem.toLocaleString()} km</td>
      <td>R$ ${v.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      <td>${v.status || "Sem status"}</td>
      <td>
        <button onclick="editar(${v.id})">✏️ Editar</button>
        <button onclick="excluir(${v.id})">🗑️ Excluir</button>
      </td>
    </tr>
  `).join("");
}

//  Carregar lista de marcas (select)
async function carregarMarcas() {
  const select = document.getElementById("marcaId");
  if (!select) return;

  const res = await fetch(MARCAS_URL);
  const marcas = await res.json();

  // Preenche o select
  select.innerHTML = '<option value="">Selecione a marca</option>' +
    marcas.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
}

//  Salvar veículo (cadastrar ou atualizar)
async function salvarVeiculo(event) {
  event.preventDefault();

  const id = localStorage.getItem("editId");
  const veiculo = {
    marca: { id: Number(document.getElementById("marcaId").value) },
    modelo: document.getElementById("modelo").value.trim(),
    ano: Number(document.getElementById("ano").value),
    cor: document.getElementById("cor").value.trim(),
    quilometragem: Number(document.getElementById("quilometragem").value),
    preco: Number(document.getElementById("preco").value),
    status: document.getElementById("status").value
  };

  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(veiculo)
    });

    if (resposta.ok) {
      alert("✅ Veículo salvo com sucesso!");
      localStorage.removeItem("editId");
      window.location.href = "index.html";
    } else {
      const textoErro = await resposta.text();
      console.error("Erro ao salvar veículo:", textoErro);
      alert("❌ Erro ao salvar veículo: " + textoErro);
    }
  } catch (erro) {
    console.error("Erro de rede:", erro);
    alert("❌ Erro de rede ao tentar salvar o veículo.");
  }
}

//  Excluir veículo
async function excluir(id) {
  if (!confirm("Tem certeza que deseja excluir este veículo?")) return;
  try {
    const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (resposta.ok) {
      alert("Veículo excluído!");
      initListagem();
    } else {
      alert("Erro ao excluir veículo.");
    }
  } catch (erro) {
    console.error("Erro de rede:", erro);
    alert("Erro de rede ao tentar excluir o veículo.");
  }
}

// 🔹 Editar veículo
function editar(id) {
  localStorage.setItem("editId", id);
  window.location.href = "editar.html";
}

// 🔹 Carregar dados ao editar
async function carregarEdicao() {
  const id = localStorage.getItem("editId");
  if (!id) return;

  const select = document.getElementById("marcaId");
  if (!select) return;

  // Se o select estiver vazio, carrega marcas
  if (select.options.length <= 1) {
    await carregarMarcas();
  }

  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar veículo");
    const v = await res.json();

    // Preenche o formulário
    select.value = v.marca?.id || "";
    document.getElementById("modelo").value = v.modelo;
    document.getElementById("ano").value = v.ano;
    document.getElementById("cor").value = v.cor;
    document.getElementById("quilometragem").value = v.quilometragem;
    document.getElementById("preco").value = v.preco;
    document.getElementById("status").value = v.status || "Disponível";
  } catch (erro) {
    console.error("Erro ao carregar veículo:", erro);
  }
}

//  Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tabela-veiculos")) {
    initListagem();
  }

  if (document.getElementById("form-veiculo")) {
    const id = localStorage.getItem("editId");
    if (id) {
      carregarEdicao(); // Edição já carrega marcas se necessário
    } else {
      carregarMarcas(); // Cadastro
    }

    document.getElementById("form-veiculo")
      .addEventListener("submit", salvarVeiculo);
  }
});
