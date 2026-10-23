/* ========================================
   SUA CASA IMÓVEIS - SCRIPT PRINCIPAL
   ======================================== */

// ====== ESTADO ======
let tipoNegocio = 'venda'; // 'venda' ou 'aluguel'

// ====== ELEMENTOS ======
const cards          = document.querySelectorAll('.card');
const btnBuscar      = document.getElementById('btn-buscar');
const btnLimpar      = document.getElementById('btn-limpar');
const formBusca      = document.getElementById('form-busca');
const contador       = document.getElementById('contador-resultados');
const semResultados  = document.getElementById('sem-resultados');
const menuToggle     = document.getElementById('menu-toggle');
const nav            = document.getElementById('nav');

// ====== 1. ABAS COMPRAR / ALUGAR ======
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tipoNegocio = btn.dataset.type;

        // Re-filtra automaticamente se já houver algum filtro ativo
        if (temFiltroAtivo()) filtrarImoveis();
    });
});

// ====== 2. FUNÇÃO AUXILIAR: tem filtro? ======
function temFiltroAtivo() {
    return (
        document.getElementById('tipo').value   !== '' ||
        document.getElementById('bairro').value !== '' ||
        document.getElementById('preco').value  !== ''
    );
}

// ====== 3. FILTRO PRINCIPAL ======
function filtrarImoveis() {
    const tipo    = document.getElementById('tipo').value.toLowerCase();
    const bairro  = document.getElementById('bairro').value.toLowerCase();
    const preco   = parseFloat(document.getElementById('preco').value) || Infinity;
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

    // Contador
    contador.textContent = encontrados === 1
        ? '1 imóvel encontrado'
        : `${encontrados} imóveis encontrados`;

    // Mensagem de nenhum resultado
    semResultados.style.display = encontrados === 0 ? '' : 'none';

    // Rola suavemente até os destaques
    document.getElementById('destaques').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ====== 4. EVENTOS DE BUSCA ======
btnBuscar.addEventListener('click', filtrarImoveis);

// Buscar também ao apertar Enter no formulário
formBusca.addEventListener('submit', e => {
    e.preventDefault();
    filtrarImoveis();
});

// Re-filtra automaticamente ao mudar selects/input (só se já houver filtro)
['tipo', 'bairro', 'preco'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        if (temFiltroAtivo()) filtrarImoveis();
    });
});

// ====== 5. BOTÃO LIMPAR FILTROS ======
btnLimpar.addEventListener('click', () => {
    formBusca.reset();
    tipoNegocio = 'venda';

    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.type-btn[data-type="venda"]').classList.add('active');

    // Mostra todos os cards
    cards.forEach(card => card.style.display = '');
    contador.textContent = cards.length === 1
        ? '1 imóvel encontrado'
        : `${cards.length} imóveis encontrados`;
    semResultados.style.display = 'none';

    document.getElementById('destaques').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ====== 6. MENU HAMBURGUER ======
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('aberto');
});

// Fecha o menu ao clicar em um link
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('aberto');
    });
});

// ====== 7. CONTADOR INICIAL ======
// Mostra o total de cards ao carregar a página
contador.textContent = cards.length === 1
    ? '1 imóvel encontrado'
    : `${cards.length} imóveis encontrados`;