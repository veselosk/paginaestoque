const supabaseUrl = "https://mvhmwahesfnxjarftmxe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aG13YWhlc2ZueGphcmZ0bXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2OTU0MzcsImV4cCI6MjA2ODI3MTQzN30.5XTYVIepzAnWrPYGSUk5OT1hS2p8QoqGm0JP0gD1hVs";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('item-form');
const listaItens = document.querySelector('#lista-itens tbody');
const filtroCategoria = document.getElementById('filtro-categoria');

// Mostrar itens do Supabase
async function mostrarItens(filtro = 'todos') {
  listaItens.innerHTML = '';

  let { data: itens, error } = await supabase.from('estoque').select('*');

  if (error) {
    console.error('Erro ao buscar itens:', error.message);
    return;
  }

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

  // Botões de remoção
  document.querySelectorAll('.btn-remover').forEach(btn => {
    btn.onclick = async e => {
      const id = e.target.getAttribute('data-id');
      await supabase.from('estoque').delete().eq('id', id);
      mostrarItens(filtroCategoria.value);
    };
  });
}

// Adicionar novo item
form.addEventListener('submit', async e => {
  e.preventDefault();

  const novoItem = {
    tipo: document.getElementById('tipo').value.trim(),
    model: document.getElementById('model').value.trim(),
    produto_id: document.getElementById('produto_id').value.trim(),
    quant: Number(document.getElementById('quant').value),
    categoria: document.getElementById('categoria').value,
    description: document.getElementById('description').value.trim()
  };

  const { error } = await supabase.from('estoque').insert(novoItem);

  if (error) {
    alert('Erro ao adicionar item: ' + error.message);
    return;
  }

  form.reset();
  mostrarItens(filtroCategoria.value);
});

// Filtro por categoria
filtroCategoria.addEventListener('change', () => {
  mostrarItens(filtroCategoria.value);
});

// Inicializar
mostrarItens();
