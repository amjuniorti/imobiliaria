const SUPABASE_URL = 'https://hkqnpvixhrdorugcavtl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcW5wdml4aHJkb3J1Z2NhdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODQ2OTAsImV4cCI6MjEwODM2MDY5MH0.XZOr0ykH00awbxSpsV7zgAS6n81xIqiGkxQOZqOseFI';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let tipoNegocio = 'venda';
let cards = [];

// Elementos
const btnBuscar = document.getElementById('btn-buscar');
const formBusca = document.getElementById('form-busca');
const inputTipo = document.getElementById('tipo');
const inputBairro = document.getElementById('bairro');
const inputPreco = document.getElementById('preco');
const painelFiltros = document.getElementById('painel-filtros');
const overlayFiltros = document.getElementById('overlay-filtros');
const btnAbrirFiltros = document.getElementById('btn-abrir-filtros');
const btnFecharFiltros = document.getElementById('btn-fechar-filtros');
const btnAplicarPainel = document.getElementById('btn-aplicar-painel');
const btnLimparPainel = document.getElementById('btn-limpar-painel');
const btnLimparRapido = document.getElementById('btn-limpar-rapido');
const painelBusca = document.getElementById('painel-busca-livre');
const painelTipo = document.getElementById('painel-tipo');
const painelBairro = document.getElementById('painel-bairro');
const painelPrecoMin = document.getElementById('painel-preco-min');
const painelPrecoMax = document.getElementById('painel-preco-max');
const contador = document.getElementById('contador-resultados');
const semResultados = document.getElementById('sem-resultados');
const cardsGrid = document.querySelector('.cards-grid');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

let reqQuartos = 0, reqSuites = 0, reqBanheiros = 0, reqVagas = 0;

// Botão Voltar ao Topo
const btnTopo = document.getElementById('btn-voltar-topo');
if (btnTopo) {
    window.addEventListener('scroll', () => {
        window.scrollY > 300 ? btnTopo.classList.add('mostrar') : btnTopo.classList.remove('mostrar');
    });
    btnTopo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Configurar botões de quantidade
function configurarBotoesQtd(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.btn-qtd').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.btn-qtd').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const valor = parseInt(btn.dataset.val);
            if (containerId === 'filtro-quartos') reqQuartos = valor;
            if (containerId === 'filtro-suites') reqSuites = valor;
            if (containerId === 'filtro-banheiros') reqBanheiros = valor;
            if (containerId === 'filtro-vagas') reqVagas = valor;
        });
    });
}
configurarBotoesQtd('filtro-quartos');
configurarBotoesQtd('filtro-suites');
configurarBotoesQtd('filtro-banheiros');
configurarBotoesQtd('filtro-vagas');

// Controle do Painel
function abrirPainel() {
    painelTipo.value = inputTipo.value;
    painelBairro.value = inputBairro.value;
    painelPrecoMax.value = inputPreco.value;
    painelPrecoMin.value = '';
    painelFiltros.classList.add('aberto');
    overlayFiltros.classList.add('ativo');
}
function fecharPainel() {
    painelFiltros.classList.remove('aberto');
    overlayFiltros.classList.remove('ativo');
}
if (btnAbrirFiltros) btnAbrirFiltros.addEventListener('click', abrirPainel);
if (btnFecharFiltros) btnFecharFiltros.addEventListener('click', fecharPainel);
if (overlayFiltros) overlayFiltros.addEventListener('click', fecharPainel);

// Menu e Tema
if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('aberto'));
    document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('aberto')));
}
const btnTema = document.getElementById('btn-tema');
const iconeTema = document.getElementById('icone-tema');
if (localStorage.getItem('tema') === 'dark') {
    document.body.classList.add('dark-mode');
    if (iconeTema) { iconeTema.classList.remove('fa-moon'); iconeTema.classList.add('fa-sun'); }
}
if (btnTema) {
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('tema', 'dark');
            iconeTema.classList.remove('fa-moon'); iconeTema.classList.add('fa-sun');
        } else {
            localStorage.setItem('tema', 'light');
            iconeTema.classList.remove('fa-sun'); iconeTema.classList.add('fa-moon');
        }
    });
}

// Carregar Imóveis
async function carregarImoveisSite() {
    if (!cardsGrid) return;
    cardsGrid.innerHTML = '<p style="text-align:center; width: 100%; grid-column: 1/-1; padding: 40px;">Carregando imóveis...</p>';
    if (contador) contador.textContent = 'Carregando...';

    const { data, error } = await _supabase.from('imoveis').select('*').order('created_at', { ascending: false });
    if (error) {
        cardsGrid.innerHTML = '<p style="text-align:center; width: 100%; grid-column: 1/-1; padding: 40px; color: red;">Erro ao carregar imóveis.</p>';
        return;
    }

    cardsGrid.innerHTML = '';
    if (data.length === 0) {
        cardsGrid.innerHTML = '<p style="text-align:center; width: 100%; grid-column: 1/-1; padding: 40px; color: #718096;">Nenhum imóvel cadastrado.</p>';
        if (contador) contador.textContent = '0 imóveis encontrados';
        return;
    }

    let htmlContent = '';
    const bairrosUnicos = new Set();
    const tiposUnicos = new Set();

    data.forEach(imovel => {
        const tagClass = imovel.negocio === 'aluguel' ? 'tag-aluguel' : '';
        const precoFormatado = imovel.preco.toLocaleString('pt-BR');
        const precoTexto = imovel.negocio === 'aluguel' ? `R$ ${precoFormatado} <small style="font-size:14px; font-weight:normal;">/mês</small>` : `R$ ${precoFormatado}`;
        let fotoCapa = (imovel.fotos && imovel.fotos.length > 0) ? imovel.fotos[0] : 'https://via.placeholder.com/500x300?text=Sem+Foto';

        if (imovel.bairro) bairrosUnicos.add(imovel.bairro.trim());
        if (imovel.tipo) tiposUnicos.add(imovel.tipo.trim());

        const suitesTexto = imovel.suites > 0 ? `<span><i class="fa-solid fa-door-open"></i> ${imovel.suites} Suítes</span>` : '';

        htmlContent += `
            <div class="card" 
                 data-titulo="${imovel.titulo.toLowerCase()}" 
                 data-codigo="${(imovel.codigo || '').toLowerCase()}" 
                 data-tipo="${imovel.tipo.toLowerCase()}" 
                 data-bairro="${imovel.bairro.toLowerCase()}" 
                 data-preco="${imovel.preco}" 
                 data-negocio="${imovel.negocio}"
                 data-quartos="${imovel.quartos || 0}"
                 data-suites="${imovel.suites || 0}"
                 data-banheiros="${imovel.banheiros || 0}"
                 data-vagas="${imovel.vagas || 0}">
                <div class="card-tag ${tagClass}">${imovel.negocio === 'aluguel' ? 'Aluguel' : 'Venda'}</div>
                <img src="${fotoCapa}" alt="${imovel.titulo}">
                <div class="card-body">
                    <span class="card-price">${precoTexto}</span>
                    <h3>${imovel.titulo}</h3>
                    <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${imovel.bairro}</p>
                    <div class="card-details">
                        <span><i class="fa-solid fa-bed"></i> ${imovel.quartos} Qts</span>
                        ${suitesTexto}
                        <span><i class="fa-solid fa-bath"></i> ${imovel.banheiros} Banh</span>
                        <span><i class="fa-solid fa-car"></i> ${imovel.vagas} Vagas</span>
                    </div>
                    <a href="imovel.html?id=${imovel.id}" class="btn-card">Ver Detalhes</a>
                </div>
            </div>
        `;
    });

    cardsGrid.innerHTML = htmlContent;
    cards = document.querySelectorAll('.card');
    if (contador) contador.textContent = `${cards.length} imóveis encontrados`;
    preencherFiltros(bairrosUnicos, tiposUnicos);
}

function preencherFiltros(bairrosSet, tiposSet) {
    const selectsBairro = [inputBairro, painelBairro];
    const selectsTipo = [inputTipo, painelTipo];
    selectsBairro.forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">Todos os Bairros</option>';
        Array.from(bairrosSet).sort().forEach(b => select.innerHTML += `<option value="${b.toLowerCase()}">${b}</option>`);
    });
    selectsTipo.forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">Todos os Tipos</option>';
        Array.from(tiposSet).sort().forEach(t => select.innerHTML += `<option value="${t.toLowerCase()}">${t.charAt(0).toUpperCase() + t.slice(1)}</option>`);
    });
}

// Operação
function atualizarBotoesOperacao(tipo) {
    tipoNegocio = tipo;
    document.querySelectorAll('.type-btn, .btn-op').forEach(b => {
        if (b.dataset.type === tipo) b.classList.add('active');
        else b.classList.remove('active');
    });
}
document.querySelectorAll('.type-btn, .btn-op').forEach(btn => {
    btn.addEventListener('click', () => atualizarBotoesOperacao(btn.dataset.type));
});

// Filtro
function filtrarImoveis(rolar = true) {
    const isPainelAberto = painelFiltros.classList.contains('aberto');
    const buscaLivre = isPainelAberto ? painelBusca.value.toLowerCase().trim() : '';
    const tipo = (isPainelAberto ? painelTipo.value : inputTipo.value).toLowerCase();
    const bairro = (isPainelAberto ? painelBairro.value : inputBairro.value).toLowerCase();
    let precoMin = 0, precoMax = Infinity;

    if (isPainelAberto) {
        precoMin = parseFloat(painelPrecoMin.value) || 0;
        precoMax = parseFloat(painelPrecoMax.value) || Infinity;
    } else {
        precoMax = parseFloat(inputPreco.value) || Infinity;
    }

    let encontrados = 0;
    let filtroAtivo = buscaLivre || tipo || bairro || precoMin > 0 || precoMax !== Infinity || reqQuartos > 0 || reqSuites > 0 || reqBanheiros > 0 || reqVagas > 0;

    cards.forEach(card => {
        const cTitulo = card.dataset.titulo, cCodigo = card.dataset.codigo, cTipo = card.dataset.tipo, cBairro = card.dataset.bairro;
        const cPreco = parseFloat(card.dataset.preco), cNegocio = card.dataset.negocio;
        const cQuartos = parseInt(card.dataset.quartos), cSuites = parseInt(card.dataset.suites), cBanheiros = parseInt(card.dataset.banheiros), cVagas = parseInt(card.dataset.vagas);

        const bateNegocio = cNegocio === tipoNegocio;
        const bateTipo = !tipo || cTipo.includes(tipo);
        const bateBairro = !bairro || cBairro.includes(bairro);
        const batePreco = cPreco >= precoMin && cPreco <= precoMax;
        const bateBusca = !buscaLivre || cTitulo.includes(buscaLivre) || cCodigo.includes(buscaLivre) || cBairro.includes(buscaLivre);
        const bateQ = cQuartos >= reqQuartos, bateS = cSuites >= reqSuites, bateB = cBanheiros >= reqBanheiros, bateV = cVagas >= reqVagas;

        if (bateNegocio && bateTipo && bateBairro && batePreco && bateBusca && bateQ && bateS && bateB && bateV) {
            card.style.display = 'block'; encontrados++;
        } else {
            card.style.display = 'none';
        }
    });

    if (contador) contador.textContent = encontrados === 1 ? '1 imóvel encontrado' : `${encontrados} imóveis encontrados`;
    if (semResultados) semResultados.style.display = encontrados === 0 ? 'block' : 'none';
    if (btnLimparRapido) btnLimparRapido.style.display = filtroAtivo ? 'inline-block' : 'none';

    fecharPainel();
    if (rolar) document.getElementById('destaques').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (btnBuscar) btnBuscar.addEventListener('click', () => filtrarImoveis(true));
if (btnAplicarPainel) btnAplicarPainel.addEventListener('click', () => filtrarImoveis(true));
if (formBusca) formBusca.addEventListener('submit', e => { e.preventDefault(); filtrarImoveis(true); });
if (painelBusca) painelBusca.addEventListener('keyup', (e) => { if(e.key === 'Enter') filtrarImoveis(true); });

// Limpar
function limparFiltros(rolar = false) {
    if (inputTipo) inputTipo.value = '';
    if (inputBairro) inputBairro.value = '';
    if (inputPreco) inputPreco.value = '';
    if (painelBusca) painelBusca.value = '';
    if (painelTipo) painelTipo.value = '';
    if (painelBairro) painelBairro.value = '';
    if (painelPrecoMin) painelPrecoMin.value = '';
    if (painelPrecoMax) painelPrecoMax.value = '';
    
    reqQuartos = 0; reqSuites = 0; reqBanheiros = 0; reqVagas = 0;
    ['filtro-quartos', 'filtro-suites', 'filtro-banheiros', 'filtro-vagas'].forEach(id => {
        const container = document.getElementById(id);
        if (!container) return;
        container.querySelectorAll('.btn-qtd').forEach((b, i) => {
            if (i === 0) b.classList.add('active'); else b.classList.remove('active');
        });
    });

    atualizarBotoesOperacao('venda');
    cards.forEach(card => card.style.display = 'block');
    if (contador) contador.textContent = `${cards.length} imóveis encontrados`;
    if (semResultados) semResultados.style.display = 'none';
    if (btnLimparRapido) btnLimparRapido.style.display = 'none';

    if (rolar) document.getElementById('destaques').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
if (btnLimparPainel) btnLimparPainel.addEventListener('click', () => { limparFiltros(true); fecharPainel(); });
if (btnLimparRapido) btnLimparRapido.addEventListener('click', () => limparFiltros(true));

// Contato
const telInput = document.getElementById('telefone-contato');
if (telInput) {
    telInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 10) value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        else if (value.length > 6) value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        else if (value.length > 2) value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        else value = value.replace(/^(\d*)/, '($1');
        e.target.value = value;
    });
}
const formContato = document.querySelector('.contato-form');
if (formContato) {
    formContato.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = formContato.querySelector('button');
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...'; btn.disabled = true;

        const inputs = formContato.querySelectorAll('input, textarea');
        const { error } = await _supabase.from('mensagens').insert([{ nome: inputs[0].value, email: inputs[1].value, telefone: inputs[2].value, mensagem: inputs[3].value }]);

        if (error) alert('Erro ao enviar: ' + error.message);
        else { alert('Mensagem enviada com sucesso!'); formContato.reset(); }
        btn.innerHTML = textoOriginal; btn.disabled = false;
    });
}

carregarImoveisSite();