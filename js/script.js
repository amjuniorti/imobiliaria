// ====== ESTADO ======
let tipoNegocio = 'venda'; // 'venda' ou 'aluguel'

// ====== BOTÕES COMPRAR / ALUGAR ======
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tipoNegocio = btn.dataset.type;
    });
});

// ====== FUNÇÃO DE FILTRO ======
function filtrarImoveis() {
    const tipo    = document.getElementById('tipo').value.toLowerCase();
    const bairro  = document.getElementById('bairro').value.toLowerCase();
    const preco   = parseFloat(document.getElementById('preco').value) || Infinity;
    const cards   = document.querySelectorAll('.card');
    let encontrados = 0;

    cards.forEach(card => {
        const cardTipo    = card.dataset.tipo.toLowerCase();
        const cardBairro  = card.dataset.bairro.toLowerCase();
        const cardPreco   = parseFloat(card.dataset.preco);
        const cardNegocio = card.dataset.negocio.toLowerCase();

        const bateTipo    = !tipo    || cardTipo   === tipo;
        const bateBairro  = !bairro  || cardBairro === bairro;
        const batePreco   = cardPreco <= preco;
        const bateNegocio = cardNegocio === tipoNegocio;

        if (bateTipo && bateBairro && batePreco && bateNegocio) {
            card.style.display = '';
            encontrados++;
        } else {
            card.style.display = 'none';
        }
    });

    // Mensagem de "nenhum resultado"
    let msg = document.getElementById('sem-resultados');
    if (encontrados === 0) {
        if (!msg) {
            msg = document.createElement('p');
            msg.id = 'sem-resultados';
            msg.style.cssText = 'text-align:center;padding:40px;color:#718096;font-size:16px;';
            msg.innerHTML = '😕 Nenhum imóvel encontrado com esses filtros. <a href="#" id="limpar-filtros" style="color:#2b6cb0;">Limpar filtros</a>';
            document.querySelector('.cards-grid').after(msg);
            document.getElementById('limpar-filtros').addEventListener('click', e => {
                e.preventDefault();
                document.getElementById('form-busca').reset();
                tipoNegocio = 'venda';
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.type-btn[data-type="venda"]').classList.add('active');
                filtrarImoveis();
            });
        }
        msg.style.display = '';
    } else if (msg) {
        msg.style.display = 'none';
    }

    // Rola para os destaques
    document.getElementById('destaques').scrollIntoView({ behavior: 'smooth' });
}

// ====== EVENTOS ======
document.getElementById('btn-buscar').addEventListener('click', filtrarImoveis);

// Buscar também ao pressionar Enter
document.getElementById('form-busca').addEventListener('submit', e => {
    e.preventDefault();
    filtrarImoveis();
});

// Re-filtrar automaticamente ao trocar Comprar/Alugar
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // só re-filtra se já houver filtro ativo
        const temFiltro = document.getElementById('tipo').value ||
                          document.getElementById('bairro').value ||
                          document.getElementById('preco').value;
        if (temFiltro) filtrarImoveis();
    });
});