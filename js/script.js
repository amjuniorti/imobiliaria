/* ========================================
   PÁGINA INICIAL - SUPABASE, FILTROS E TEMA
   ======================================== */

const SUPABASE_URL = 'https://hkqnpvixhrdorugcavtl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcW5wdml4aHJkb3J1Z2NhdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODQ2OTAsImV4cCI6MjEwODM2MDY5MH0.XZOr0ykH00awbxSpsV7zgAS6n81xIqiGkxQOZqOseFI';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let tipoNegocio = 'venda';
let cards = [];

const cardsGrid = document.querySelector('.cards-grid');
const contador = document.getElementById('contador-resultados');
const semResultados = document.getElementById('sem-resultados');
const btnBuscar = document.getElementById('btn-buscar');
const btnLimpar = document.getElementById('btn-limpar');
const formBusca = document.getElementById('form-busca');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

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
        cardsGrid.innerHTML = '<p style="text-align:center; width: 100%; grid-column: 1/-1; padding: 40px; color: #718096;">Nenhum imóvel cadastrado ainda.</p>';
        if (contador) contador.textContent = '0 imóveis encontrados';
        return;
    }

    let htmlContent = '';
    const bairrosUnicos = new Set();
    const tiposUnicos = new Set();
    
    data.forEach(imovel => {
        const tagClass = imovel.negocio === 'aluguel' ? 'tag-aluguel' : '';
        const precoFormatado = imovel.preco.toLocaleString('pt-BR');
        const precoTexto = imovel.negocio === 'aluguel' ? `R$ ${precoFormatado} <small>/mês</small>` : `R$ ${precoFormatado}`;
        
        let fotoCapa = 'https://via.placeholder.com/500x300?text=Sem+Foto';
        if (imovel.fotos && imovel.fotos.length > 0) fotoCapa = imovel.fotos[0];
        else if (imovel.imagem_url) fotoCapa = imovel.imagem_url;

        if (imovel.bairro) bairrosUnicos.add(imovel.bairro.trim());
        if (imovel.tipo) tiposUnicos.add(imovel.tipo.trim());

        htmlContent += `
            <div class="card" style="display: block;" data-tipo="${imovel.tipo.toLowerCase()}" data-bairro="${imovel.bairro.toLowerCase()}" data-preco="${imovel.preco}" data-negocio="${imovel.negocio}">
                <div class="card-tag ${tagClass}">${imovel.negocio === 'aluguel' ? 'Aluguel' : 'Venda'}</div>
                <img src="${fotoCapa}" alt="${imovel.titulo}">
                <div class="card-body">
                    <span class="card-price">${precoTexto}</span>
                    <h3>${imovel.titulo}</h3>
                    <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${imovel.bairro}</p>
                    <div class="card-details">
                        <span><i class="fa-solid fa-bed"></i> ${imovel.quartos} Qts</span>
                        <span><i class="fa-solid fa-bath"></i> ${imovel.banheiros} Banheiros</span>
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

    preencherFiltroBairros(bairrosUnicos);
    preencherFiltroTipos(tiposUnicos);
}

function preencherFiltroBairros(bairrosSet) {
    const selectBairro = document.getElementById('bairro');
    if (!selectBairro) return;
    selectBairro.innerHTML = '<option value="">Todos os Bairros</option>';
    Array.from(bairrosSet).sort().forEach(bairro => {
        selectBairro.innerHTML += `<option value="${bairro.toLowerCase()}">${bairro}</option>`;
    });
}

function preencherFiltroTipos(tiposSet) {
    const selectTipo = document.getElementById('tipo');
    if (!selectTipo) return;
    selectTipo.innerHTML = '<option value="">Todos os Tipos</option>';
    Array.from(tiposSet).sort().forEach(tipo => {
        selectTipo.innerHTML += `<option value="${tipo.toLowerCase()}">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>`;
    });
}

if (document.querySelectorAll('.type-btn').length > 0) {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tipoNegocio = btn.dataset.type;
            if (temFiltroAtivo()) filtrarImoveis(false);
        });
    });
}

function temFiltroAtivo() {
    return (
        document.getElementById('tipo').value !== '' ||
        document.getElementById('bairro').value !== '' ||
        document.getElementById('preco').value !== ''
    );
}

function filtrarImoveis(rolar = false) {
    const tipo = document.getElementById('tipo').value.toLowerCase();
    const bairro = document.getElementById('bairro').value.toLowerCase();
    const preco = parseFloat(document.getElementById('preco').value) || Infinity;
    let encontrados = 0;

    cards.forEach(card => {
        const cardTipo = card.dataset.tipo;
        const cardBairro = card.dataset.bairro;
        const cardPreco = parseFloat(card.dataset.preco);
        const cardNegocio = card.dataset.negocio;

        const bateTipo = !tipo || cardTipo.includes(tipo);
        const bateBairro = !bairro || cardBairro.includes(bairro);
        const batePreco = cardPreco <= preco;
        const bateNegocio = cardNegocio === tipoNegocio;

        if (bateTipo && bateBairro && batePreco && bateNegocio) {
            card.style.display = 'block';
            encontrados++;
        } else {
            card.style.display = 'none';
        }
    });

    if (contador) contador.textContent = encontrados === 1 ? '1 imóvel encontrado' : `${encontrados} imóveis encontrados`;
    if (semResultados) semResultados.style.display = encontrados === 0 ? 'block' : 'none';

    if (rolar) {
        const destaques = document.getElementById('destaques');
        if (destaques) destaques.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

if (btnBuscar && formBusca) {
    btnBuscar.addEventListener('click', () => filtrarImoveis(true));
    formBusca.addEventListener('submit', e => { e.preventDefault(); filtrarImoveis(true); });

    ['tipo', 'bairro', 'preco'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                if (temFiltroAtivo()) filtrarImoveis(false);
            });
        }
    });

    btnLimpar.addEventListener('click', () => {
        formBusca.reset();
        tipoNegocio = 'venda';
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        const btnVenda = document.querySelector('.type-btn[data-type="venda"]');
        if (btnVenda) btnVenda.classList.add('active');
        cards.forEach(card => card.style.display = 'block');
        if (contador) contador.textContent = `${cards.length} imóveis encontrados`;
        if (semResultados) semResultados.style.display = 'none';
        const destaques = document.getElementById('destaques');
        if (destaques) destaques.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('aberto'));
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('aberto'));
    });
}

// MÁSCARA DE TELEFONE CORRIGIDA
const telInput = document.getElementById('telefone-contato') || document.getElementById('telefone-imovel');
if (telInput) {
    telInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); 
        if (value.length > 11) value = value.slice(0, 11); 

        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            value = value.replace(/^(\d*)/, '($1');
        }
        e.target.value = value;
    });
}

// FORMULÁRIO DE CONTATO CORRIGIDO
const formContato = document.querySelector('.contato-form');
if (formContato) {
    formContato.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = formContato.querySelector('button');
        const textoOriginal = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;
        
        const inputs = formContato.querySelectorAll('input, textarea');
        const nome = inputs[0].value;
        const email = inputs[1].value;
        const telefone = inputs[2].value;
        const mensagem = inputs[3].value;

        const { error } = await _supabase.from('mensagens').insert([{
            nome: nome, email: email, telefone: telefone, mensagem: mensagem
        }]);

        if (error) {
            console.error("ERRO SUPABASE:", error);
            alert('Erro ao enviar: ' + error.message);
        } else {
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            formContato.reset();
        }
        
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    });
}

const btnTema = document.getElementById('btn-tema');
const iconeTema = document.getElementById('icone-tema');

if (localStorage.getItem('tema') === 'dark') {
    document.body.classList.add('dark-mode');
    if(iconeTema) {
        iconeTema.classList.remove('fa-moon');
        iconeTema.classList.add('fa-sun');
    }
}

if (btnTema) {
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('tema', 'dark');
            iconeTema.classList.remove('fa-moon');
            iconeTema.classList.add('fa-sun');
        } else {
            localStorage.setItem('tema', 'light');
            iconeTema.classList.remove('fa-sun');
            iconeTema.classList.add('fa-moon');
        }
    });
}

carregarImoveisSite();