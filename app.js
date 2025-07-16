const form = document.getElementById('item-form');
const listaItens = document.querySelector('#lista-itens tbody');
const filtroCategoria = document.getElementById('filtro-categoria');

let itens = JSON.parse(localStorage.getItem('estoque')) || [];

function salvarItens() {
  localStorage.setItem('estoque', JSON.stringify(itens));
}

function mostrarItens(filtro = 'todos') {
  listaItens.innerHTML = '';

  const itensFiltrados = filtro === 'todos' ? itens : itens.filter(i => i.categoria === filtro);

  if (itensFiltrados.length === 0) {
    listaItens.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum item encontrado.</td></tr>`;
    return;
  }

  itensFiltrados.forEach((item, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.tipo}</td>
      <td>${item.model}</td>
      <td>${item.id}</td>
      <td>${item.quant}</td>
      <td>${item.categoria}</td>
      <td>${item.description}</td>
      <td><button class="btn-remover" data-index="${index}">❌</button></td>
    `;

    listaItens.appendChild(tr);
  });

  document.querySelectorAll('.btn-remover').forEach(btn => {
    btn.onclick = e => {
      const idx = e.target.getAttribute('data-index');
      itens.splice(idx, 1);
      salvarItens();
      mostrarItens(filtroCategoria.value);
    };
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const novoItem = {
    tipo: form.tipo.value.trim(),
    model: form.model.value.trim(),
    id: form.id.value.trim(),
    quant: Number(form.quant.value),
    description: form.description.value.trim(),
    categoria: form.categoria.value
  };

  itens.push(novoItem);
  salvarItens();
  mostrarItens(filtroCategoria.value);

  form.reset();
});

filtroCategoria.addEventListener('change', () => {
  mostrarItens(filtroCategoria.value);
});

mostrarItens();
