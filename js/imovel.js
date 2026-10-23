/* ========================================
   PÁGINA DE DETALHES DO IMÓVEL
   ======================================== */

// ====== BANCO DE DADOS DOS IMÓVEIS ======
// Cada id corresponde ao "?id=" da URL
const IMOVEIS = {
    1: {
        id: 1,
        titulo: 'Casa Residencial 3 Quartos',
        negocio: 'venda',
        tipo: 'Casa',
        bairro: 'Santa Rosália',
        endereco: 'Rua das Acácias, 120 — Bairro Santa Rosália',
        preco: 450000,
        precoTexto: 'R$ 450.000',
        precoNota: 'Aceita financiamento • IPTU R$ 180/mês',
        quartos: 3,
        banheiros: 2,
        vagas: 2,
        area: 180,
        descricao: 'Excelente casa residencial com acabamento de primeira linha, localizada em bairro tranquilo e arborizado. Possui sala ampla com pé-direito alto, cozinha planejada, área de serviço e quintal com churrasqueira. Pronta para morar!',
        comodidades: [
            'Churrasqueira', 'Quintal', 'Cozinha planejada',
            'Armários embutidos', 'Área de serviço', 'Portão eletrônico',
            'Piscina', 'Jardim'
        ],
        imagens: [
            'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'
        ]
    },
    2: {
        id: 2,
        titulo: 'Apartamento Moderno no Centro',
        negocio: 'aluguel',
        tipo: 'Apartamento',
        bairro: 'Centro',
        endereco: 'Av. Central, 850 — Centro',
        preco: 1800,
        precoTexto: 'R$ 1.800',
        precoNota: 'por mês • Condomínio R$ 350 • IPTU R$ 90',
        quartos: 2,
        banheiros: 1,
        vagas: 1,
        area: 65,
        descricao: 'Apartamento moderno e bem localizado, a poucos passos do comércio, bancos e transporte público. Totalmente reformado, com piso porcelanato, cozinha integrada e varanda. Ideal para quem busca praticidade no dia a dia.',
        comodidades: [
            'Elevador', 'Portaria 24h', 'Academia',
            'Salão de festas', 'Varanda', 'Interfone'
        ],
        imagens: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'
        ]
    },
    3: {
        id: 3,
        titulo: 'Casa em Condomínio Fechado',
        negocio: 'venda',
        tipo: 'Casa',
        bairro: 'Jardim dos Estados',
        endereco: 'Rua dos Ipês, 45 — Jardim dos Estados',
        preco: 890000,
        precoTexto: 'R$ 890.000',
        precoNota: 'Condomínio R$ 600/mês • IPTU R$ 320/mês',
        quartos: 4,
        banheiros: 3,
        vagas: 3,
        area: 320,
        descricao: 'Espaçosa casa em condomínio fechado com segurança 24h, ideal para famílias. Possui 4 quartos (sendo 2 suítes), sala de estar e jantar integradas, cozinha gourmet, área de lazer privativa com piscina e churrasqueira. Condomínio conta com quadra, playground e salão de festas.',
        comodidades: [
            'Piscina privativa', 'Churrasqueira', 'Segurança 24h',
            'Quadra poliesportiva', 'Playground', 'Salão de festas',
            'Jardim', 'Closet'
        ],
        imagens: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200',
            'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200'
        ]
    },
    4: {
        id: 4,
        titulo: 'Apartamento 2 Quartos com Varanda',
        negocio: 'venda',
        tipo: 'Apartamento',
        bairro: 'Santa Rosália',
        endereco: 'Rua das Palmeiras, 300 — Bairro Santa Rosália',
        preco: 320000,
        precoTexto: 'R$ 320.000',
        precoNota: 'Condomínio R$ 280 • IPTU R$ 95',
        quartos: 2,
        banheiros: 2,
        vagas: 1,
        area: 72,
        descricao: 'Apartamento novo com 2 quartos (1 suíte), varanda com vista aberta, cozinha americana e área de lazer completa no condomínio. Excelente oportunidade para primeira moradia ou investimento.',
        comodidades: [
            'Varanda', 'Piscina', 'Academia',
            'Salão de festas', 'Elevador', 'Portaria 24h'
        ],
        imagens: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200',
            'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200'
        ]
    },
    5: {
        id: 5,
        titulo: 'Casa Térrea com Quintal',
        negocio: 'aluguel',
        tipo: 'Casa',
        bairro: 'Centro',
        endereco: 'Rua São João, 210 — Centro',
        preco: 2500,
        precoTexto: 'R$ 2.500',
        precoNota: 'por mês • IPTU R$ 140',
        quartos: 3,
        banheiros: 2,
        vagas: 2,
        area: 150,
        descricao: 'Casa térrea com amplo quintal, ideal para quem tem pets ou crianças. Cozinha grande, sala em dois ambientes, área de serviço coberta e garagem para 2 carros. Localização privilegiada, próxima a escolas e supermercados.',
        comodidades: [
            'Quintal amplo', 'Área de serviço', 'Garagem coberta',
            'Aceita pets', 'Armários planejados'
        ],
        imagens: [
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'
        ]
    },
    6: {
        id: 6,
        titulo: 'Apartamento Garden com Área Gourmet',
        negocio: 'venda',
        tipo: 'Apartamento',
        bairro: 'Jardim dos Estados',
        endereco: 'Rua dos Girassóis, 88 — Jardim dos Estados',
        preco: 420000,
        precoTexto: 'R$ 420.000',
        precoNota: 'Condomínio R$ 420 • IPTU R$ 130',
        quartos: 3,
        banheiros: 2,
        vagas: 2,
        area: 110,
        descricao: 'Apartamento garden no térreo com área gourmet privativa, perfeito para receber amigos e família. Possui 3 quartos (1 suíte), sala ampla integrada à cozinha e quintal privativo com churrasqueira. Condomínio com lazer completo.',
        comodidades: [
            'Área gourmet privativa', 'Churrasqueira', 'Quintal privativo',
            'Piscina', 'Academia', 'Playground',
            'Salão de festas', 'Portaria 24h'
        ],
        imagens: [
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200'
        ]
    }
};

// ====== PEGA O ID DA URL ======
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'), 10);
const imovel = IMOVEIS[id];

// ====== ELEMENTOS ======
const loading   = document.getElementById('loading');
const erro      = document.getElementById('erro');
const conteudo  = document.getElementById('conteudo-imovel');

// ====== SE NÃO ENCONTRAR, MOSTRA ERRO ======
if (!imovel) {
    loading.style.display = 'none';
    erro.style.display = '';
} else {
    renderizarImovel(imovel);
    loading.style.display = 'none';
    conteudo.style.display = '';
    document.title = `${imovel.titulo} | Sua Casa Imóveis`;
}

// ====== FUNÇÃO PRINCIPAL ======
function renderizarImovel(im) {
    // Breadcrumb
    document.getElementById('breadcrumb-nome').textContent = im.titulo;

    // Tag (Venda / Aluguel)
    const tag = document.getElementById('imovel-tag');
    tag.textContent = im.negocio === 'aluguel' ? 'Aluguel' : 'Venda';
    if (im.negocio === 'aluguel') tag.classList.add('aluguel');

    // Imagem principal + miniaturas
    const imgPrincipal = document.getElementById('imagem-principal');
    imgPrincipal.src = im.imagens[0];
    imgPrincipal.alt = im.titulo;

    const miniaturas = document.getElementById('miniaturas');
    miniaturas.innerHTML = '';
    im.imagens.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${im.titulo} - foto ${i + 1}`;
        if (i === 0) img.classList.add('ativa');
        img.addEventListener('click', () => {
            imgPrincipal.src = src;
            miniaturas.querySelectorAll('img').forEach(m => m.classList.remove('ativa'));
            img.classList.add('ativa');
        });
        miniaturas.appendChild(img);
    });

    // Título e endereço
    document.getElementById('imovel-titulo').textContent = im.titulo;
    document.getElementById('imovel-endereco').textContent = im.endereco;

    // Preço
    document.getElementById('imovel-preco').textContent = im.precoTexto;
    document.getElementById('imovel-preco-nota').textContent = im.precoNota;

    // Características (quartos, banheiros, vagas, área)
    const carac = document.getElementById('imovel-caracteristicas');
    carac.innerHTML = `
        <div class="carac-item">
            <i class="fa-solid fa-bed"></i>
            <strong>${im.quartos}</strong>
            <span>Quartos</span>
        </div>
        <div class="carac-item">
            <i class="fa-solid fa-bath"></i>
            <strong>${im.banheiros}</strong>
            <span>Banheiros</span>
        </div>
        <div class="carac-item">
            <i class="fa-solid fa-car"></i>
            <strong>${im.vagas}</strong>
            <span>Vagas</span>
        </div>
        <div class="carac-item">
            <i class="fa-solid fa-ruler-combined"></i>
            <strong>${im.area} m²</strong>
            <span>Área útil</span>
        </div>
    `;

    // Descrição
    document.getElementById('imovel-descricao').textContent = im.descricao;

    // Comodidades
    const comod = document.getElementById('imovel-comodidades');
    comod.innerHTML = '';
    im.comodidades.forEach(c => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-check"></i> ${c}`;
        comod.appendChild(li);
    });

    // Botão WhatsApp com mensagem pré-preenchida
    const msg = encodeURIComponent(`Olá! Tenho interesse no imóvel "${im.titulo}" (código ${im.id}). Poderia me dar mais informações?`);
    document.getElementById('btn-whatsapp').href =
        `https://wa.me/5511999999999?text=${msg}`;
}

// ====== MENU HAMBURGUER ======
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('aberto'));
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('aberto'));
    });
}