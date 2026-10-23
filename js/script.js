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

        // Re-filtra automaticamente se já houver algum filtro ativo (sem rolar a tela)
        if (temFiltroAtivo()) filtrarImoveis(false);
    });
});

// ====== 2. FUNÇÃO AUXILIAR: tem filtro ativo? ======
function temFiltroAtivo() {
    return (
        document.getElementById('tipo').value   !== '' ||
        document.getElementById('bairro').value !== '' ||
        document.getElementById('preco').value  !== ''
    );
}

// ====== 3. FILTRO PRINCIPAL ======
// O parâmetro "rolar" define se a tela vai descer ou não ao filtrar
function filtrarImoveis(rolar = false) {
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

    // Atualiza o contador
    contador.textContent = encontrados === 1
        ? '1 imóvel encontrado'
        : `${encontrados} imóveis encontrados`;

    // Mostra ou esconde a mensagem de "nenhum resultado"
    semResultados.style.display = encontrados === 0 ? '' : 'none';

    // Só rola a tela se a ação veio de um clique no botão "Buscar"
    if (rolar) {
        document.getElementById('destaques').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ====== 4. EVENTOS DE BUSCA ======

// Clicou no botão "Buscar" -> filtra E rola a tela
btnBuscar.addEventListener('click', () => filtrarImoveis(true));

// Apertou Enter no formulário -> filtra E rola a tela
formBusca.addEventListener('submit', e => {
    e.preventDefault();
    filtrarImoveis(true);
});

// Mudou os selects ou digitou o preço -> filtra AO VIVO (sem rolar a tela)
['tipo', 'bairro', 'preco'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        if (temFiltroAtivo()) filtrarImoveis(false);
    });
});

// ====== 5. BOTÃO LIMPAR FILTROS ======
btnLimpar.addEventListener('click', () => {
    formBusca.reset();
    tipoNegocio = 'venda';

    // Reseta as abas
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.type-btn[data-type="venda"]').classList.add('active');

    // Mostra todos os cards novamente
    cards.forEach(card => card.style.display = '');
    
    // Reseta o contador
    contador.textContent = cards.length === 1
        ? '1 imóvel encontrado'
        : `${cards.length} imóveis encontrados`;
        
    semResultados.style.display = 'none';

    // Rola de volta para o topo dos imóveis
    document.getElementById('destaques').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ====== 6. MENU HAMBURGUER ======
if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('aberto');
    });

    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('aberto');
        });
    });
}

// ====== 7. CONTADOR INICIAL ======
// Mostra o total de cards ao carregar a página
contador.textContent = cards.length === 1
    ? '1 imóvel encontrado'
    : `${cards.length} imóveis encontrados`;