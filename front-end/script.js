/* js/main.js
   Pontos:
   - API_URL: altere se seu backend estiver em outro host/porta.
   - O script oferece fallback local (mockData) caso a API não responda.
*/

const API_URL = 'http://localhost:8080/veiculos'; // ajuste se necessário

// --- MOCK (fallback para visualizar sem backend) ---
const mockData = [
  { id: 1, marca: "Honda", modelo: "Civic", ano: 2022, cor: "Preto", preco: 85000, quilometragem: 30000 },
  { id: 2, marca: "Toyota", modelo: "Corolla", ano: 2021, cor: "Branco", preco: 90000, quilometragem: 25000 },
  { id: 3, marca: "Ford", modelo: "Fiesta", ano: 2020, cor: "Prata", preco: 60000, quilometragem: 50000 },
  { id: 4, marca: "Chevrolet", modelo: "Onix", ano: 2019, cor: "Vermelho", preco: 55000, quilometragem: 42000 }
];

// --- Helpers ---
function formatPrice(v){
  return v == null ? '' : `R$ ${Number(v).toLocaleString('pt-BR')}`;
}
function showMessage(el, text){
  if(!el) return;
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(()=> el.style.display = 'none', 3500);
}

// --- INDEX.PHP / index.html functions ---
async function fetchJson(url, opts = {}){
  try {
    const res = await fetch(url, opts);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e){
    console.warn('API indisponível, usando mock', e);
    return null;
  }
}

async function listVehicles() {
  const tableBody = document.getElementById('tableBody');
  if(!tableBody) return;
  tableBody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';

  const data = await fetchJson(API_URL);
  const vehicles = data ?? mockData;

  if(vehicles.length === 0){
    tableBody.innerHTML = '<tr><td colspan="6">Nenhum veículo encontrado.</td></tr>';
    return;
  }

  tableBody.innerHTML = vehicles.map(v =>
    `<tr>
      <td>${v.marca}</td>
      <td>${v.modelo}</td>
      <td>${v.ano}</td>
      <td>${v.cor ?? ''}</td>
      <td>${formatPrice(v.preco)}</td>
      <td>
        <a class="btn" href="editar.html?id=${v.id}">Editar</a>
        <button class="btn ghost" onclick="confirmDelete(${v.id})">Excluir</button>
      </td>
    </tr>`).join('');
}

async function searchVehicles(query){
  // tenta usar o backend com query param
  const url = `${API_URL}?q=${encodeURIComponent(query)}`;
  const data = await fetchJson(url);
  const vehicles = data ?? mockData.filter(v =>
    (v.marca + ' ' + v.modelo).toLowerCase().includes(query.toLowerCase())
  );

  const tableBody = document.getElementById('tableBody');
  if(!tableBody) return;
  if(vehicles.length === 0){
    tableBody.innerHTML = '<tr><td colspan="6">Nenhum veículo encontrado.</td></tr>';
    return;
  }
  tableBody.innerHTML = vehicles.map(v =>
    `<tr>
      <td>${v.marca}</td>
      <td>${v.modelo}</td>
      <td>${v.ano}</td>
      <td>${v.cor ?? ''}</td>
      <td>${formatPrice(v.preco)}</td>
      <td>
        <a class="btn" href="editar.html?id=${v.id}">Editar</a>
        <button class="btn ghost" onclick="confirmDelete(${v.id})">Excluir</button>
      </td>
    </tr>`).join('');
}

async function confirmDelete(id){
  if(!confirm('Confirma exclusão deste veículo?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if(!res.ok) throw new Error('Falha ao excluir');
    // refresh
    listVehicles();
  } catch (e){
    // se API indisponível, remove do mock (apenas visual)
    const idx = mockData.findIndex(m => m.id === id);
    if(idx >= 0){
      mockData.splice(idx, 1);
      listVehicles();
    } else {
      alert('Erro ao excluir. Veja console para mais detalhes.');
      console.error(e);
    }
  }
}

// --- CADASTRO ---
function initCadastro(){
  const form = document.getElementById('formCadastro');
  const msg = document.getElementById('msg');

  if(!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const veiculo = {
      marca: document.getElementById('marca').value.trim(),
      modelo: document.getElementById('modelo').value.trim(),
      ano: Number(document.getElementById('ano').value),
      cor: document.getElementById('cor').value.trim(),
      quilometragem: Number(document.getElementById('quilometragem').value),
      preco: Number(document.getElementById('preco').value)
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(veiculo)
      });
      if(!res.ok) throw new Error('Servidor não respondeu');
      const created = await res.json();
      showMessage(msg, 'Veículo cadastrado com sucesso!');
      setTimeout(()=> window.location.href = 'index.html', 800);
    } catch (e){
      // fallback: adiciona no mock
      const newId = mockData.length ? Math.max(...mockData.map(x=>x.id)) + 1 : 1;
      veiculo.id = newId;
      mockData.push(veiculo);
      showMessage(msg, 'API indisponível — cadastro local realizado (mock).');
      setTimeout(()=> window.location.href = 'index.html', 800);
      console.warn(e);
    }
  });
}

// --- EDITAR ---
function getQueryParam(name){
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function initEditar(){
  const id = getQueryParam('id');
  const msg = document.getElementById('msgEdit');
  const form = document.getElementById('formEditar');
  if(!form) return;

  // busca dados do veículo
  let vehicle = null;
  try {
    const data = await fetchJson(`${API_URL}/${id}`);
    vehicle = data ?? mockData.find(x=> String(x.id) === String(id));
  } catch(e){
    console.warn(e);
    vehicle = mockData.find(x=> String(x.id) === String(id));
  }

  if(!vehicle){
    alert('Veículo não encontrado');
    window.location.href = 'index.html';
    return;
  }

  // preenche campos
  document.getElementById('editId').value = vehicle.id;
  document.getElementById('editMarca').value = vehicle.marca || '';
  document.getElementById('editModelo').value = vehicle.modelo || '';
  document.getElementById('editAno').value = vehicle.ano || '';
  document.getElementById('editCor').value = vehicle.cor || '';
  document.getElementById('editQuilometragem').value = vehicle.quilometragem || 0;
  document.getElementById('editPreco').value = vehicle.preco || 0;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idToUpdate = document.getElementById('editId').value;
    const updated = {
      marca: document.getElementById('editMarca').value.trim(),
      modelo: document.getElementById('editModelo').value.trim(),
      ano: Number(document.getElementById('editAno').value),
      cor: document.getElementById('editCor').value.trim(),
      quilometragem: Number(document.getElementById('editQuilometragem').value),
      preco: Number(document.getElementById('editPreco').value)
    };

    try {
      const res = await fetch(`${API_URL}/${idToUpdate}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(updated)
      });
      if(!res.ok) throw new Error('Erro no servidor');
      showMessage(msg, 'Atualizado com sucesso!');
      setTimeout(()=> window.location.href = 'index.html', 900);
    } catch (e){
      // fallback: atualiza mock
      const idx = mockData.findIndex(x=> String(x.id) === String(idToUpdate));
      if(idx >= 0){
        mockData[idx] = { id: Number(idToUpdate), ...updated };
        showMessage(msg, 'API indisponível — alteração aplicada localmente (mock).');
        setTimeout(()=> window.location.href = 'index.html', 900);
      } else {
        alert('Erro ao atualizar. Veja console.');
        console.error(e);
      }
    }
  });
}

// --- INITS para index (list + search) ---
function initIndex(){
  listVehicles();

  const btnSearch = document.getElementById('btnSearch');
  const btnClear = document.getElementById('btnClear');
  const searchInput = document.getElementById('searchInput');

  if(btnSearch){
    btnSearch.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if(!q) listVehicles();
      else searchVehicles(q);
    });
  }

  if(btnClear){
    btnClear.addEventListener('click', () => {
      searchInput.value = '';
      listVehicles();
    });
  }

  // permite buscar ao pressionar Enter
  if(searchInput){
    searchInput.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        e.preventDefault();
        const q = searchInput.value.trim();
        if(!q) listVehicles();
        else searchVehicles(q);
      }
    });
  }
}

// Exporta funções para uso nos HTML inline (confirmDelete)
window.confirmDelete = confirmDelete;
window.initIndex = initIndex;
window.initCadastro = initCadastro;
window.initEditar = initEditar;
