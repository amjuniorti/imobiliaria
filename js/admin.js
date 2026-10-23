/* ========================================
   ADMIN - LÓGICA COMPLETA E TEMA
   ======================================== */

const SUPABASE_URL = 'https://hkqnpvixhrdorugcavtl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcW5wdml4aHJkb3J1Z2NhdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODQ2OTAsImV4cCI6MjEwODM2MDY5MH0.XZOr0ykH00awbxSpsV7zgAS6n81xIqiGkxQOZqOseFI';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true } });

// Elementos
const telaLogin = document.getElementById('tela-login');
const painelAdmin = document.getElementById('painel-admin');
const formImovel = document.getElementById('form-imovel');
const listaAdmin = document.getElementById('lista-admin');
const listaMensagens = document.getElementById('lista-mensagens');
const fotosAtuaisContainer = document.getElementById('fotos-atuais');
const inputImagem = document.getElementById('imagem');
const btnSair = document.getElementById('btn-sair');

// Variáveis de estado
let todosImoveisAdmin = [];
let fotosEmEdicao = []; 

// ====== TEMA CLARO / ESCURO ======
const btnTema = document.getElementById('btn-tema');
const iconeTema = document.getElementById('icone-tema');

if (localStorage.getItem('tema') === 'dark') {
    document.body.classList.add('dark-mode');
    if(iconeTema) { iconeTema.classList.remove('fa-moon'); iconeTema.classList.add('fa-sun'); }
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

// ====== LOGIN E SESSÃO ======
async function checarSessao() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        telaLogin.style.display = 'none';
        painelAdmin.style.display = 'block';
        if (btnSair) btnSair.style.display = 'inline-block';
        carregarImoveis();
    } else {
        telaLogin.style.display = 'flex';
        painelAdmin.style.display = 'none';
        if (btnSair) btnSair.style.display = 'none';
    }
}
checarSessao();

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const btn = e.target.querySelector('button');
    btn.innerHTML = 'Entrando...'; btn.disabled = true;

    const { error } = await _supabase.auth.signInWithPassword({ email, password: senha });
    
    if (error) {
        document.getElementById('erro-login').style.display = 'block';
        btn.innerHTML = 'Entrar no Painel'; btn.disabled = false;
    } else {
        document.getElementById('erro-login').style.display = 'none';
        btn.innerHTML = 'Entrar no Painel'; btn.disabled = false;
        checarSessao();
    }
});

if (btnSair) {
    btnSair.addEventListener('click', async (e) => {
        e.preventDefault();
        await _supabase.auth.signOut();
        checarSessao();
    });
}

// ====== ABAS ======
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        if (btn.dataset.tab === 'tab-mensagens') carregarMensagens();
    });
});

// ====== BUSCAR IMÓVEIS ======
async function carregarImoveis() {
    listaAdmin.innerHTML = '<p>Carregando...</p>';
    const { data, error } = await _supabase.from('imoveis').select('*').order('created_at', { ascending: false });
    
    if (!error && data) {
        todosImoveisAdmin = data;
        renderizarAdminFiltrado();
    } else {
        listaAdmin.innerHTML = '<p style="color:red;">Erro ao carregar imóveis.</p>';
    }
}

function renderizarAdminFiltrado() {
    const termoBusca = document.getElementById('busca-admin').value.toLowerCase();
    const filtroNegocio = document.getElementById('filtro-negocio-admin').value;

    const filtrados = todosImoveisAdmin.filter(imovel => {
        const bateTexto = imovel.titulo.toLowerCase().includes(termoBusca) || 
                          imovel.bairro.toLowerCase().includes(termoBusca) ||
                          (imovel.codigo && imovel.codigo.toLowerCase().includes(termoBusca));
        const bateNegocio = filtroNegocio === 'todos' || imovel.negocio === filtroNegocio;
        return bateTexto && bateNegocio;
    });

    listaAdmin.innerHTML = '';
    if (filtrados.length === 0) {
        listaAdmin.innerHTML = '<p class="alerta-vazio">Nenhum imóvel encontrado.</p>';
        return;
    }

    filtrados.forEach(imovel => {
        const div = document.createElement('div');
        div.className = 'item-admin';
        let capa = imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : 'https://via.placeholder.com/90';
        
        div.innerHTML = `
            <img src="${capa}">
            <div class="item-admin-info">
                <h4>${imovel.titulo} <span style="font-size:12px; color:#ed8936;">#${imovel.codigo || imovel.id}</span></h4>
                <p>R$ ${imovel.preco.toLocaleString('pt-BR')} • ${imovel.bairro}</p>
            </div>
            <div class="item-admin-acoes">
                <button class="btn-acao edit" onclick="editarImovel(${imovel.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-acao delete" onclick="excluirImovel(${imovel.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        listaAdmin.appendChild(div);
    });
}

document.getElementById('busca-admin').addEventListener('input', renderizarAdminFiltrado);
document.getElementById('filtro-negocio-admin').addEventListener('change', renderizarAdminFiltrado);

// ====== FOTOS ======
function renderizarFotosEdicao() {
    fotosAtuaisContainer.innerHTML = '';
    if (fotosEmEdicao.length === 0) {
        fotosAtuaisContainer.innerHTML = '<p style="font-size:13px; color:var(--text-muted);">Nenhuma foto selecionada.</p>';
        return;
    }

    fotosEmEdicao.forEach((item, index) => {
        let url = typeof item === 'string' ? item : URL.createObjectURL(item);
        const div = document.createElement('div');
        div.className = `foto-edit-container ${index === 0 ? 'capa' : ''}`;
        
        let setaEsq = index > 0 ? `<button type="button" onclick="moverFotoEsquerda(${index})"><i class="fa-solid fa-chevron-left"></i></button>` : `<span></span>`;
        let setaDir = index < fotosEmEdicao.length - 1 ? `<button type="button" onclick="moverFotoDireita(${index})"><i class="fa-solid fa-chevron-right"></i></button>` : `<span></span>`;

        div.innerHTML = `
            ${index === 0 ? '<span class="capa-label">CAPA</span>' : ''}
            <img src="${url}" alt="Foto">
            <button type="button" class="btn-remover-foto" onclick="removerFotoEdicao(${index})">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="controles-foto">${setaEsq} ${setaDir}</div>
        `;
        fotosAtuaisContainer.appendChild(div);
    });
}

window.previewNovasFotos = function(event) {
    const arquivos = event.target.files;
    for (let i = 0; i < arquivos.length; i++) fotosEmEdicao.push(arquivos[i]); 
    inputImagem.value = ''; 
    renderizarFotosEdicao(); 
};

window.removerFotoEdicao = function(index) {
    fotosEmEdicao.splice(index, 1);
    renderizarFotosEdicao();
};

window.moverFotoEsquerda = function(index) {
    if (index > 0) {
        [fotosEmEdicao[index - 1], fotosEmEdicao[index]] = [fotosEmEdicao[index], fotosEmEdicao[index - 1]];
        renderizarFotosEdicao();
    }
};

window.moverFotoDireita = function(index) {
    if (index < fotosEmEdicao.length - 1) {
        [fotosEmEdicao[index + 1], fotosEmEdicao[index]] = [fotosEmEdicao[index], fotosEmEdicao[index + 1]];
        renderizarFotosEdicao();
    }
};

// ====== EDITAR / SALVAR IMÓVEL ======
window.editarImovel = function(id) {
    const imovel = todosImoveisAdmin.find(i => i.id === id);
    document.getElementById('imovel-id').value = imovel.id;
    document.getElementById('codigo').value = imovel.codigo || '';
    document.getElementById('titulo').value = imovel.titulo;
    document.getElementById('negocio').value = imovel.negocio;
    document.getElementById('tipo').value = imovel.tipo;
    document.getElementById('bairro').value = imovel.bairro;
    document.getElementById('preco').value = imovel.preco;
    document.getElementById('quartos').value = imovel.quartos;
    document.getElementById('banheiros').value = imovel.banheiros;
    document.getElementById('vagas').value = imovel.vagas;
    document.getElementById('nota_preco').value = imovel.nota_preco || '';
    document.getElementById('descricao').value = imovel.descricao || '';
    document.getElementById('comodidades').value = imovel.comodidades || '';
    
    fotosEmEdicao = imovel.fotos ? [...imovel.fotos] : []; 
    renderizarFotosEdicao();

    document.getElementById('form-titulo').textContent = 'Editar Imóvel';
    document.getElementById('btn-cancelar').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

formImovel.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-salvar');
    btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

    try {
        const id = document.getElementById('imovel-id').value;
        let urlsFinais = [];

        for (let i = 0; i < fotosEmEdicao.length; i++) {
            const item = fotosEmEdicao[i];
            if (typeof item === 'string') {
                urlsFinais.push(item);
            } else {
                const nome = `${Date.now()}-${item.name}`;
                const { error: uploadError } = await _supabase.storage.from('fotos-imoveis').upload(nome, item);
                if (uploadError) throw uploadError;
                const { data } = _supabase.storage.from('fotos-imoveis').getPublicUrl(nome);
                urlsFinais.push(data.publicUrl); 
            }
        }

        let codigoGerado = document.getElementById('codigo').value;
        if (!codigoGerado) codigoGerado = 'IMV-' + Date.now().toString().slice(-6); 

        const dados = {
            titulo: document.getElementById('titulo').value,
            negocio: document.getElementById('negocio').value,
            tipo: document.getElementById('tipo').value,
            bairro: document.getElementById('bairro').value,
            preco: parseInt(document.getElementById('preco').value),
            quartos: parseInt(document.getElementById('quartos').value),
            banheiros: parseInt(document.getElementById('banheiros').value),
            vagas: parseInt(document.getElementById('vagas').value),
            nota_preco: document.getElementById('nota_preco').value,
            descricao: document.getElementById('descricao').value,
            comodidades: document.getElementById('comodidades').value,
            fotos: urlsFinais,
            codigo: codigoGerado
        };

        if (id) {
            const { error } = await _supabase.from('imoveis').update(dados).eq('id', id);
            if (error) throw error;
            alert('Imóvel editado com sucesso!');
        } else {
            if (urlsFinais.length === 0) throw new Error('Adicione pelo menos uma foto.');
            const { error } = await _supabase.from('imoveis').insert([dados]);
            if (error) throw error;
            alert('Imóvel cadastrado com sucesso!');
        }

        resetForm(); carregarImoveis();
    } catch (err) {
        alert('Erro ao salvar: ' + err.message);
    } finally {
        btn.disabled = false; btn.innerHTML = 'Salvar Imóvel';
    }
});

window.excluirImovel = async function(id) {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;
    const { error } = await _supabase.from('imoveis').delete().eq('id', id);
    if (error) alert('Erro ao excluir: ' + error.message);
    else carregarImoveis();
};

document.getElementById('btn-cancelar').addEventListener('click', resetForm);
function resetForm() {
    formImovel.reset();
    document.getElementById('imovel-id').value = '';
    document.getElementById('codigo').value = '';
    document.getElementById('form-titulo').textContent = 'Adicionar Novo Imóvel';
    document.getElementById('btn-cancelar').style.display = 'none';
    fotosEmEdicao = []; 
    fotosAtuaisContainer.innerHTML = ''; 
}

// ====== MENSAGENS ======
async function carregarMensagens() {
    listaMensagens.innerHTML = '<p>Carregando...</p>';
    const { data } = await _supabase.from('mensagens').select('*').order('created_at', { ascending: false });
    
    listaMensagens.innerHTML = '';
    if (!data || data.length === 0) {
        listaMensagens.innerHTML = '<p class="alerta-vazio">Nenhuma mensagem recebida ainda.</p>';
        return;
    }

    data.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'item-admin';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'flex-start';
        
        // Borda verde se estiver lida
        div.style.borderLeft = msg.lida ? '4px solid #38a169' : '4px solid transparent';

        let acoesHTML = msg.lida ? `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; width: 100%;">
                <span style="font-size:14px; color:#38a169; font-weight:bold; display:flex; align-items:center; gap:6px;">
                    <i class="fa-solid fa-circle-check" style="font-size: 18px;"></i> Mensagem Concluída
                </span>
                <button onclick="excluirMensagem(${msg.id})" class="btn-acao delete" style="background:#e53e3e; color:#fff; border:none; padding: 6px 12px; border-radius:4px; cursor:pointer;">
                    <i class="fa-solid fa-trash"></i> Apagar
                </button>
            </div>
        ` : `
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <!-- PASSO O EVENT COMO PARÂMETRO AQUI -->
                <button onclick="marcarLida(${msg.id}, event)" class="btn-acao" style="background:#38a169; color:#fff; border:none; padding: 6px 12px; border-radius:4px; cursor:pointer;">
                    <i class="fa-solid fa-check"></i> Concluir
                </button>
                <button onclick="excluirMensagem(${msg.id})" class="btn-acao delete" style="background:#e53e3e; color:#fff; border:none; padding: 6px 12px; border-radius:4px; cursor:pointer;">
                    <i class="fa-solid fa-trash"></i> Apagar
                </button>
            </div>
        `;

        div.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong style="color: var(--primary-color);">${msg.nome} (${msg.email})</strong>
                <span style="font-size: 12px; color: var(--text-muted);">${new Date(msg.created_at).toLocaleString('pt-BR')}</span>
            </div>
            <p style="margin-bottom: 10px; font-size: 14px; color: var(--text-main);">${msg.mensagem}</p>
            <p style="font-size: 12px; color: var(--text-muted);"><i class="fa-solid fa-phone"></i> ${msg.telefone || 'Não informado'}</p>
            
            ${acoesHTML}
        `;
        listaMensagens.appendChild(div);
    });
}

// RECEBE O EVENT COMO PARÂMETRO
window.marcarLida = async function(id, event) {
    if (event) {
        const btn = event.target.closest('.btn-acao');
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Processando...';
            btn.style.opacity = '0.7';
        }
    }

    const { error } = await _supabase
        .from('mensagens')
        .update({ lida: true })
        .eq('id', id);

    if (error) {
        alert('Erro no banco de dados: ' + error.message);
        console.error(error);
    } else {
        carregarMensagens();
    }
};

window.excluirMensagem = async function(id) {
    if (!confirm('Apagar esta mensagem?')) return;
    const { error } = await _supabase.from('mensagens').delete().eq('id', id);
    if (!error) carregarMensagens();
};