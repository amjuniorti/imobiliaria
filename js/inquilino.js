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

// Controle de Sessão
async function initInquilino() {
    const { data: { session } } = await _supabase.auth.getSession();
    
    if (!session) {
        alert("Você precisa estar logado como inquilino.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById('nome-inquilino').textContent = `Bem-vindo, ${session.user.email}`;
}

// Botão Sair
document.getElementById('btn-sair').addEventListener('click', async (e) => {
    e.preventDefault();
    await _supabase.auth.signOut();
    window.location.href = "index.html";
});

// Simulação de Boleto
function gerarBoleto() {
    alert("Gerando boleto... Aqui você pode integrar com uma API de pagamentos (como Asaas, Pagar.me) ou gerar um PDF.");
}

// Enviar Ocorrência (Simulado)
document.getElementById('form-ocorrencia').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const textoOriginal = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    const titulo = document.getElementById('ocorrencia-titulo').value;
    const descricao = document.getElementById('ocorrencia-desc').value;

    // AQUI VOCÊ INSERE NO SUPABASE:
    /*
    const { error } = await _supabase.from('ocorrencias').insert([{
        titulo: titulo,
        descricao: descricao,
        inquilino_id: (await _supabase.auth.getUser()).data.user.id
    }]);
    if (error) alert('Erro ao enviar: ' + error.message);
    else { alert('Ocorrência enviada!'); e.target.reset(); }
    */

    // Simulação de sucesso:
    setTimeout(() => {
        alert('Ocorrência enviada com sucesso! O proprietário foi notificado.');
        e.target.reset();
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }, 1000);
});

initInquilino();