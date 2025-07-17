import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = "https://mvhmwahesfnxjarftmxe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aG13YWhlc2ZueGphcmZ0bXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2OTU0MzcsImV4cCI6MjA2ODI3MTQzN30.5XTYVIepzAnWrPYGSUk5OT1hS2p8QoqGm0JP0gD1hVs";
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('item-form');
const listaItens = document.querySelector('#lista-itens tbody');
const filtroCategoria = document.getElementById('filtro-categoria');

// Mostrar itens
async function mostrarItens(filtro = 'todos') {
  listaItens.innerHTML = '';
  const { data: itens, error } = await supabase.from('estoque').select('*');

  if (error) {
    console.error('Erro ao buscar itens:', error.message);
    return;
  }

  const itensFiltrados = filtro === 'todos' ? itens : itens.filter(i => i.categoria === filtro);

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
    btn.onclick = async e => {
      const id = e.target.getAttribute('data-id');
      await supabase.from('estoque').delete().eq('id', id);
      mostrarItens(filtroCategoria.value);
    };
  });
}

// Adicionar item
form.addEventListener('submit', async e => {
  e.preventDefault();

  const novoItem = {
    tipo: form.tipo.value.trim(),
    model: form.model.value.trim(),
    produto_id: form.produto_id.value.trim(),
    quant: Number(form.quant.value),
    categoria: form.categoria.value,
    description: form.description.value.trim()
  };

  const { error } = await supabase.from('estoque').insert(novoItem);

  if (error) {
    alert('Erro ao adicionar item: ' + error.message);
    return;
  }

  form.reset();
  mostrarItens(filtroCategoria.value);
});

// Filtrar
filtroCategoria.addEventListener('change', () => {
  mostrarItens(filtroCategoria.value);
});

// Inicializar
mostrarItens();
