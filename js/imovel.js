/* ========================================
   PÁGINA DE DETALHES DO IMÓVEL
   ======================================== */

const SUPABASE_URL = 'https://hkqnpvixhrdorugcavtl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcW5wdml4aHJkb3J1Z2NhdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODQ2OTAsImV4cCI6MjEwODM2MDY5MH0.XZOr0ykH00awbxSpsV7zgAS6n81xIqiGkxQOZqOseFI';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WHATSAPP_NUMERO = '5521987654321';

const loading = document.getElementById('loading');
const erro = document.getElementById('erro');
const conteudo = document.getElementById('conteudo-imovel');

const params = new URLSearchParams(window.location.search);
const idImovel = params.get('id');

// ====== MENU HAMBURGUER ======
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('aberto'));
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('aberto'));
    });
}

// ====== TEMA ======
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
            iconeTema.classList.remove('fa-moon');
            iconeTema.classList.add('fa-sun');
        } else {
            localStorage.setItem('tema', 'light');
            iconeTema.classList.remove('fa-sun');
            iconeTema.classList.add('fa-moon');
        }
    });
}

// ====== TROCAR IMAGEM PRINCIPAL ======
window.trocarImagem = function(el, src) {
    document.getElementById('imagem-principal').src = src;
    document.querySelectorAll('.galeria-miniaturas img').forEach(i => i.classList.remove('ativa'));
    el.classList.add('ativa');
};

// ====== MOSTRAR ERRO ======
function mostrarErro() {
    if (loading) loading.style.display = 'none';
    if (erro) erro.style.display = 'block';
    if (conteudo) conteudo.style.display = 'none';
}

// ====== CARREGAR IMÓVEL ======
async function carregarImovel() {
    if (!idImovel) {
        mostrarErro();
        return;
    }

    try {
        const { data, error } = await _supabase
            .from('imoveis')
            .select('*')
            .eq('id', idImovel)
            .single();

        if (error || !data) {
            console.error('Erro ao buscar imóvel:', error);
            mostrarErro();
            return;
        }

        loading.style.display = 'none';
        erro.style.display = 'none';
        conteudo.style.display = 'block';

        document.getElementById('breadcrumb-nome').textContent = data.titulo;
        document.title = `${data.titulo} | Sua Casa Imóveis`;
        document.getElementById('imovel-titulo').textContent = data.titulo;
        document.getElementById('imovel-codigo').textContent = data.codigo || data.id;
        document.getElementById('imovel-endereco').textContent = data.bairro;

        const tag = document.getElementById('imovel-tag');
        tag.textContent = data.negocio === 'aluguel' ? 'Aluguel' : 'Venda';
        tag.classList.toggle('aluguel', data.negocio === 'aluguel');

        const precoFormatado = (data.preco || 0).toLocaleString('pt-BR');
        const precoEl = document.getElementById('imovel-preco');
        if (data.negocio === 'aluguel') {
            precoEl.innerHTML = `R$ ${precoFormatado} <small style="font-size:16px; font-weight:normal;">/mês</small>`;
        } else {
            precoEl.textContent = `R$ ${precoFormatado}`;
        }
        document.getElementById('imovel-preco-nota').textContent = data.nota_preco || '';

        // Adiciona a Suíte nas características (se existir)
        document.getElementById('imovel-caracteristicas').innerHTML = `
            <div class="carac-item">
                <i class="fa-solid fa-bed"></i>
                <strong>${data.quartos ?? 0}</strong>
                <span>Quartos</span>
            </div>
            <div class="carac-item">
                <i class="fa-solid fa-door-open"></i>
                <strong>${data.suites ?? 0}</strong>
                <span>Suítes</span>
            </div>
            <div class="carac-item">
                <i class="fa-solid fa-bath"></i>
                <strong>${data.banheiros ?? 0}</strong>
                <span>Banheiros</span>
            </div>
            <div class="carac-item">
                <i class="fa-solid fa-car"></i>
                <strong>${data.vagas ?? 0}</strong>
                <span>Vagas</span>
            </div>
            <div class="carac-item">
                <i class="fa-solid fa-house"></i>
                <strong style="font-size:16px;">${data.tipo || '—'}</strong>
                <span>Tipo</span>
            </div>
        `;

        document.getElementById('imovel-descricao').textContent = data.descricao || 'Sem descrição disponível.';

        const ulCom = document.getElementById('imovel-comodidades');
        ulCom.innerHTML = '';
        const listaCom = (data.comodidades || '').split(',').map(c => c.trim()).filter(Boolean);
        if (listaCom.length === 0) {
            ulCom.innerHTML = '<li style="background:transparent;border:none;"><span style="color:var(--text-muted);">Sem comodidades informadas.</span></li>';
        } else {
            listaCom.forEach(c => {
                ulCom.innerHTML += `<li><i class="fa-solid fa-check"></i> ${c}</li>`;
            });
        }

        let fotos = (data.fotos && data.fotos.length > 0)
            ? data.fotos
            : ['https://via.placeholder.com/800x500?text=Sem+Foto'];

        const principal = document.getElementById('imagem-principal');
        principal.src = fotos[0];
        principal.alt = data.titulo;

        const miniaturas = document.getElementById('miniaturas');
        miniaturas.innerHTML = '';
        fotos.forEach((foto, i) => {
            const img = document.createElement('img');
            img.src = foto;
            img.alt = `${data.titulo} - foto ${i + 1}`;
            if (i === 0) img.classList.add('ativa');
            img.addEventListener('click', () => window.trocarImagem(img, foto));
            miniaturas.appendChild(img);
        });

        const msg = encodeURIComponent(
            `Olá! Tenho interesse no imóvel ${data.codigo || data.id} - ${data.titulo} (${data.bairro}).`
        );
        document.getElementById('btn-whatsapp').href = `https://wa.me/${WHATSAPP_NUMERO}?text=${msg}`;

    } catch (err) {
        console.error('Erro inesperado:', err);
        mostrarErro();
    }
}

carregarImovel();