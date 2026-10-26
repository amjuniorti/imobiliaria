const SUPABASE_URL = 'https://hkqnpvixhrdorugcavtl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcW5wdml4aHJkb3J1Z2NhdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODQ2OTAsImV4cCI6MjEwODM2MDY5MH0.XZOr0ykH00awbxSpsV7zgAS6n81xIqiGkxQOZqOseFI';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true } });

const modalLogin = document.getElementById('modal-login');
const btnAbrirLogin = document.getElementById('btn-abrir-login');
const btnFecharLogin = document.getElementById('btn-fechar-login');
const formLoginSite = document.getElementById('form-login-site');
const erroLoginSite = document.getElementById('erro-login-site');

if (btnAbrirLogin) {
    btnAbrirLogin.addEventListener('click', (e) => {
        e.preventDefault();
        modalLogin.style.display = 'flex';
        setTimeout(() => modalLogin.classList.add('ativo'), 10);
    });
}

if (btnFecharLogin) {
    btnFecharLogin.addEventListener('click', () => {
        modalLogin.classList.remove('ativo');
        setTimeout(() => modalLogin.style.display = 'none', 300);
    });
}

if (formLoginSite) {
    formLoginSite.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-entrar');
        const textoOriginal = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Entrando...';
        btn.disabled = true;

        const email = document.getElementById('login-email-site').value;
        const senha = document.getElementById('login-senha-site').value;

        const { data, error } = await _supabase.auth.signInWithPassword({ email, password: senha });

        if (error) {
            erroLoginSite.style.display = 'block';
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        } else {
            erroLoginSite.style.display = 'none';
            
            // LÓGICA DE REDIRECIONAMENTO
            const role = data.user.user_metadata?.role || 'proprietario'; 
            
            if (role === 'inquilino') {
                window.location.href = "inquilino.html";
            } else if (role === 'proprietario') {
                window.location.href = "proprietario.html";
            } else {
                window.location.href = "admin.html"; 
            }
        }
    });
}