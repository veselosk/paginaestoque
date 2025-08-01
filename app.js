// 🔗 Configuração do JSONBin
const BIN_ID = '688d03e7f7e7a370d1f1c1a8';
const MASTER_KEY = '$2a$10$PykMSAtn5B6alL3JT.p5u.yLqJY3kiPmUachbC7NLfblp/0gXcvDy';
const url = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// 🔄 Lista local (cache)
let itens = [];

// 🔧 Elementos do DOM
const form = document.getElementById('item-form');
const listaItens = document.querySelector('#lista-itens tbody');
const filtroCategoria = document.getElementById('filtro-categoria');

// ⬇️ Carregar dados do JSONBin
async function carregarItens() {
  try {
    const res = await fetch(url, {
      headers: {
        'X-Master-Key': MASTER_KEY
      }
    });

    const json = await res.json();
    itens = json.record;
    mostrarItens();
  } catch (err) {
    console.error('Erro ao carregar JSONBin:', err);
    listaItens.innerHTML = `<tr><td colspan="7">Erro ao carregar itens.</td></tr>`;
  }
}

// 💾 Salvar dados no JSONBin
async function salvarItens() {
  try {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      },
      body: JSON.stringify(itens)
    });
  } catch (err) {
    console.error('Erro ao salvar JSONBin:', err);
    alert('Erro ao salvar os dados!');
  }
}

// 📋 Mostrar itens na tabela
function mostrarItens(filtro = 'todos') {
  listaItens.innerHTML = '';

  const itensFiltrados = filtro === 'todos'
    ? itens
    : itens.filter(i => i.categoria === filtro);

  if (itensFiltrados.length === 0) {
    listaItens.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum item encontrado.</td></tr>`;
    return;
  }

  itensFiltrados.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.tipo}</td>
      <td>${item.model}</td>
      <td>${item.produto_id}</td>
      <td>${item.quant}</td>
      <td>${item.categoria}</td>
      <td>${item.description}</td>
      <td><button class="btn-remover" data-id="${item.id}">❌</button></td>
    `;
    listaItens.appendChild(tr);
  });

  document.querySelectorAll('.btn-remover').forEach(btn => {
    btn.onclick = e => {
      const id = parseInt(e.target.getAttribute('data-id'));
      itens = itens.filter(i => i.id !== id);
      salvarItens();
      mostrarItens(filtroCategoria.value);
    };
  });
}

// ➕ Adicionar novo item
form.addEventListener('submit', e => {
  e.preventDefault();

  const novoItem = {
    id: Date.now(),
    tipo: document.getElementById('tipo').value.trim(),
    model: document.getElementById('model').value.trim(),
    produto_id: document.getElementById('produto_id').value.trim(),
    quant: parseInt(document.getElementById('quant').value),
    categoria: document.getElementById('categoria').value,
    description: document.getElementById('description').value.trim()
  };

  itens.push(novoItem);
  salvarItens();
  form.reset();
  mostrarItens(filtroCategoria.value);
});

// 🎯 Filtro de categoria
filtroCategoria.addEventListener('change', () => {
  mostrarItens(filtroCategoria.value);
});

// 🚀 Inicialização
carregarItens();
