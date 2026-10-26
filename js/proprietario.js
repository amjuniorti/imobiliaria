const SUPABASE_URL = 'https://hkqnpvixhrdorugcavtl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcW5wdml4aHJkb3J1Z2NhdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODQ2OTAsImV4cCI6MjEwODM2MDY5MH0.XZOr0ykH00awbxSpsV7zgAS6n81xIqiGkxQOZqOseFI';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true } });

// Tema e Menu
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('aberto'));
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
            localStorage.setItem('tema', 'dark'); iconeTema.classList.remove('fa-moon'); iconeTema.classList.add('fa-sun');
        } else {
            localStorage.setItem('tema', 'light'); iconeTema.classList.remove('fa-sun'); iconeTema.classList.add('fa-moon');
        }
    });
}

// Controle de Sessão e Dados
async function initProprietario() {
    const { data: { session } } = await _supabase.auth.getSession();
    
    if (!session) {
        alert("Você precisa estar logado como proprietário.");
        window.location.href = "index.html"; // Redireciona se não estiver logado
        return;
    }

    document.getElementById('nome-proprietario').textContent = `Bem-vindo, ${session.user.email}`;
    
    // Carrega dados de exemplo (aqui você conectaria com as tabelas do Supabase)
    carregarTabelas();
}

// Lógica das Abas
document.querySelectorAll('.tab-btn-dash').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn-dash').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Botão Sair
document.getElementById('btn-sair').addEventListener('click', async (e) => {
    e.preventDefault();
    await _supabase.auth.signOut();
    window.location.href = "index.html";
});

// Funções de Dados (Mockup)
function carregarTabelas() {
    // Dados de exemplo apenas para visualização inicial
    const mockImoveis = [
        { titulo: "Casa a Venda 3 Quartos", status: "Alugado", inquilino: "Carlos Silva", valor: 2500 },
        { titulo: "Apartamento Padrão", status: "Alugado", inquilino: "Ana Souza", valor: 1800 }
    ];

    const tbodyImoveis = document.getElementById('tabela-imoveis');
    let totalRenda = 0;

    tbodyImoveis.innerHTML = '';
    mockImoveis.forEach(imovel => {
        totalRenda += imovel.valor;
        tbodyImoveis.innerHTML += `
            <tr>
                <td><strong>${imovel.titulo}</strong></td>
                <td><span class="status-badge status-pago">${imovel.status}</span></td>
                <td>${imovel.inquilino}</td>
                <td>R$ ${imovel.valor.toLocaleString('pt-BR')} / mês</td>
            </tr>
        `;
    });

    document.getElementById('resumo-alugados').textContent = mockImoveis.length;
    document.getElementById('resumo-renda').textContent = `R$ ${totalRenda.toLocaleString('pt-BR')}`;

    // Tabela de Contratos Mockup
    const tbodyContratos = document.getElementById('tabela-contratos');
    tbodyContratos.innerHTML = `
        <tr>
            <td>#CTR-001</td>
            <td>Casa a Venda 3 Quartos</td>
            <td>10/11/2026</td>
            <td><span class="status-badge status-pago">Ativo</span></td>
        </tr>
    `;
}

initProprietario();