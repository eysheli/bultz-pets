/**
 * racas.js - Script para Gerenciamento de Raças (CRUD com Local Storage e Animação ao Scroll)
 */

// ----------------------------------------------------
// I. DADOS INICIAIS E FUNÇÕES GERAIS
// ----------------------------------------------------

// Dados de exemplo (simulação de um "banco de dados")
let racas = JSON.parse(localStorage.getItem('racas')) || [
    { id: 1, foto: "https://images.dog.ceo/breeds/retriever-golden/n02099600_892.jpg", nome: "Golden Retriever", especie: "Cão", temperamento: "Amigável, Inteligente", detalhes: "Cão de família, adora nadar e brincar." },
    { id: 2, foto: "https://cdn2.thecatapi.com/images/MTgyNzM4OQ.jpg", nome: "Siamês", especie: "Gato", temperamento: "Vocal, Afetuoso", detalhes: "Gato ativo e muito comunicativo." },
    { id: 3, foto: "https://images.dog.ceo/breeds/poodle-standard/n02113799_125.jpg", nome: "Poodle (Standard)", especie: "Cão", temperamento: "Inteligente, Elegante", detalhes: "Conhecido por sua inteligência e temperamento tranquilo." },
    { id: 4, foto: "https://cdn2.thecatapi.com/images/dpc.jpg", nome: "Maine Coon", especie: "Gato", temperamento: "Gentil, Dócil", detalhes: "O 'gigante gentil' entre os gatos." },
    { id: 5, foto: "https://images.dog.ceo/breeds/labrador/n02099712_177.jpg", nome: "Labrador Retriever", especie: "Cão", temperamento: "Leal, Ativo, Sociável", detalhes: "Excelente cão de companhia e de serviço." }
];

let nextId = racas.length > 0 ? Math.max(...racas.map(r => r.id)) + 1 : 1;

const racasTableBody = document.getElementById('racas-table-body');
const racasModal = new bootstrap.Modal(document.getElementById('racasModal'));
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
const formRaca = document.getElementById('form-raca');
const buscaRacaInput = document.getElementById('buscaRaca');
const noResultsMessage = document.getElementById('no-results-message');

/** Salva o array de raças no Local Storage. */
function saveRacas() {
    localStorage.setItem('racas', JSON.stringify(racas));
}

/** Exibe um alerta de feedback na tela. */
function showFeedback(message, type = 'success') {
    const container = document.getElementById('feedback-alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show mt-3 mx-auto`;
    alert.style.maxWidth = '600px';
    alert.style.zIndex = '1050'; // Acima dos modais se necessário
    alert.role = 'alert';
    alert.innerHTML = `
        <strong style="font-family: var(--fonte-titulo);">${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.appendChild(alert);

    // Remove após 4 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    }, 4000);
}


// ----------------------------------------------------
// II. ANIMAÇÃO AO SCROLL (INTERSECTION OBSERVER)
// ----------------------------------------------------

// Configurações do observador
const observerOptions = {
    root: null, // Observa a viewport
    rootMargin: '0px',
    threshold: 0.2 // 20% do elemento deve estar visível
};

/** * Callback para o Intersection Observer. 
 * Adiciona a classe 'active' quando o elemento entra na viewport.
 */
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Para de observar após a animação
        }
    });
}

const tableRowObserver = new IntersectionObserver(handleIntersection, observerOptions);

/** Aplica o observer a todas as linhas da tabela. */
function observeTableRows() {
    document.querySelectorAll('#racas-table-body tr').forEach((row, index) => {
        // Aplica um pequeno delay em cascata para um efeito visual mais agradável
        row.style.transitionDelay = `${index * 0.05}s`;
        tableRowObserver.observe(row);
    });
}


// ----------------------------------------------------
// III. FUNÇÕES DE RENDERIZAÇÃO E BUSCA
// ----------------------------------------------------

/** Renderiza a tabela de raças com base em um array filtrado. */
function renderRacas(racasArray) {
    racasTableBody.innerHTML = '';
    
    if (racasArray.length === 0) {
        noResultsMessage.style.display = 'block';
        return;
    } else {
        noResultsMessage.style.display = 'none';
    }

    racasArray.forEach(raca => {
        const row = document.createElement('tr');
        row.dataset.racaId = raca.id;
        row.innerHTML = `
            <td><img src="${raca.foto || 'https://via.placeholder.com/45/246168/ffffff?text=PET'}" alt="${raca.nome}" class="img-fluid rounded-circle shadow-sm"></td>
            <td><strong>#${raca.id}</strong></td>
            <td>${raca.nome}</td>
            <td>${raca.especie}</td>
            <td>${raca.temperamento || 'N/A'}</td>
            <td>
                <a href="#" class="btn-action btn-edit" title="Editar" data-raca-id="${raca.id}" data-bs-toggle="modal" data-bs-target="#racasModal">
                    <i class="fas fa-edit"></i>
                </a>
                <a href="#" class="btn-action btn-delete" title="Excluir" data-raca-id="${raca.id}" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">
                    <i class="fas fa-trash-alt"></i>
                </a>
            </td>
        `;
        racasTableBody.appendChild(row);
    });

    // Depois de renderizar as linhas, as observamos para a animação
    observeTableRows();
}

/** Filtra as raças com base no texto de busca. */
function filterRacas() {
    const searchTerm = buscaRacaInput.value.toLowerCase().trim();

    const filteredRacas = racas.filter(raca => {
        return raca.nome.toLowerCase().includes(searchTerm) ||
               raca.especie.toLowerCase().includes(searchTerm) ||
               String(raca.id).includes(searchTerm);
    });

    renderRacas(filteredRacas);
}

// ----------------------------------------------------
// IV. LÓGICA DE CRUD
// ----------------------------------------------------

/** Abre o modal para criar ou editar uma raça. */
function openRacasModal(racaId = null) {
    document.getElementById('raca-id').value = racaId || '';
    formRaca.reset();

    if (racaId) {
        // Modo Edição
        const raca = racas.find(r => r.id === racaId);
        if (raca) {
            document.getElementById('racasModalLabel').textContent = `Editar Raça: ${raca.nome}`;
            document.getElementById('btn-salvar-raca').innerHTML = '<i class="fas fa-save me-2"></i> Atualizar Raça';

            document.getElementById('nomeRaca').value = raca.nome;
            document.getElementById('urlFoto').value = raca.foto || '';
            document.getElementById('especie').value = raca.especie;
            document.getElementById('temperamento').value = raca.temperamento;
            document.getElementById('detalhes').value = raca.detalhes;
        }
    } else {
        // Modo Criação
        document.getElementById('racasModalLabel').textContent = 'Cadastrar Nova Raça';
        document.getElementById('btn-salvar-raca').innerHTML = '<i class="fas fa-save me-2"></i> Salvar Raça';
        document.getElementById('urlFoto').value = ''; // Garante que a foto esteja vazia ao criar
        document.getElementById('nomeRaca').focus();
    }
}

/** Salva (cria ou edita) uma raça. */
function saveRaca(event) {
    event.preventDefault();

    const id = document.getElementById('raca-id').value;
    const nomeRaca = document.getElementById('nomeRaca').value.trim();
    const urlFoto = document.getElementById('urlFoto').value.trim();
    const especie = document.getElementById('especie').value;
    const temperamento = document.getElementById('temperamento').value.trim();
    const detalhes = document.getElementById('detalhes').value.trim();

    if (!nomeRaca) {
        showFeedback("O nome da raça é obrigatório!", 'danger');
        return;
    }

    const novaRaca = {
        nome: nomeRaca,
        foto: urlFoto,
        especie: especie,
        temperamento: temperamento,
        detalhes: detalhes
    };

    if (id) {
        // Editar
        const racaIndex = racas.findIndex(r => r.id === parseInt(id));
        if (racaIndex !== -1) {
            racas[racaIndex] = { ...racas[racaIndex], ...novaRaca };
            showFeedback(`Raça ${nomeRaca} atualizada com sucesso!`);
        }
    } else {
        // Criar
        novaRaca.id = nextId++;
        racas.push(novaRaca);
        showFeedback(`Raça ${nomeRaca} adicionada com sucesso!`);
    }

    saveRacas();
    renderRacas(racas); // Re-renderiza a lista completa
    racasModal.hide();
}

/** Prepara o modal de confirmação de exclusão. */
function openDeleteModal(racaId) {
    document.getElementById('confirmarExclusaoBtn').dataset.racaId = racaId;
}

/** Executa a exclusão de uma raça. */
function deleteRaca(racaId) {
    const id = parseInt(racaId);
    const raca = racas.find(r => r.id === id);
    if (!raca) return;

    racas = racas.filter(r => r.id !== id);
    saveRacas();
    renderRacas(racas);
    confirmDeleteModal.hide();
    showFeedback(`Raça ${raca.nome} excluída com sucesso!`, 'warning');
}

// ----------------------------------------------------
// V. INTEGRAÇÃO COM API EXTERNA (Buscar Imagem)
// ----------------------------------------------------

/** Busca uma imagem aleatória de cachorro ou gato com base no nome da raça (simulação). */
async function buscarFoto() {
    const nomeRaca = document.getElementById('nomeRaca').value.trim().toLowerCase();
    const especie = document.getElementById('especie').value;
    const urlFotoInput = document.getElementById('urlFoto');

    if (!nomeRaca) {
        showFeedback("Digite o nome da raça para buscar uma foto.", 'info');
        return;
    }
    
    // Simplificação da lógica de busca para o exemplo
    let url = '';
    try {
        if (especie === 'Cão') {
            const apiName = nomeRaca.replace(/\s+/g, '/'); // Ex: 'Golden Retriever' -> 'golden/retriever'
            const response = await fetch(`https://dog.ceo/api/breed/${apiName}/images/random`);
            const data = await response.json();
            if (data.status === 'success') {
                url = data.message;
            }
        } else if (especie === 'Gato') {
            // A API de gatos exige um pouco mais de manipulação. Simulamos a busca ou usamos uma padrão.
            // Para simplificar, usaremos uma busca mais genérica ou estática se o nome não for exato
            const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=1&breed_ids=beng,siam,main`); // Exemplo com breeds populares
            const data = await response.json();
            if (data.length > 0) {
                url = data[0].url;
            }
        }

        if (url) {
            urlFotoInput.value = url;
            showFeedback(`Foto para ${nomeRaca} encontrada e preenchida!`);
        } else {
            urlFotoInput.value = '';
            showFeedback(`Nenhuma foto exata encontrada para "${nomeRaca}".`, 'warning');
        }

    } catch (error) {
        console.error('Erro ao buscar foto:', error);
        urlFotoInput.value = '';
        showFeedback('Erro de conexão ao buscar foto.', 'danger');
    }
}


// ----------------------------------------------------
// VI. EVENT LISTENERS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderiza a tabela inicial e aplica as animações
    renderRacas(racas);

    // 2. Evento de busca/filtro
    buscaRacaInput.addEventListener('input', filterRacas);

    // 3. Evento de salvar (Criar/Editar)
    formRaca.addEventListener('submit', saveRaca);

    // 4. Delegação de eventos para os botões da tabela (Editar/Excluir)
    racasTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.btn-edit')) {
            const racaId = parseInt(e.target.closest('.btn-edit').dataset.racaId);
            openRacasModal(racaId);
            racasModal.show();
            e.preventDefault();
        } else if (e.target.closest('.btn-delete')) {
            const racaId = parseInt(e.target.closest('.btn-delete').dataset.racaId);
            openDeleteModal(racaId);
            confirmDeleteModal.show();
            e.preventDefault();
        }
    });

    // 5. Resetar formulário ao abrir modal para criação
    const modalElement = document.getElementById('racasModal');
    modalElement.addEventListener('show.bs.modal', (e) => {
        // Se o botão de acionamento não tiver data-raca-id, é uma criação
        if (!e.relatedTarget || !e.relatedTarget.dataset.racaId) {
            openRacasModal(null);
        }
    });

    // 6. Confirmação de exclusão
    document.getElementById('confirmarExclusaoBtn').addEventListener('click', (e) => {
        const racaId = e.target.dataset.racaId;
        if (racaId) {
            deleteRaca(racaId);
        }
    });

    // 7. Botão Buscar Foto
    document.getElementById('btnBuscarFoto').addEventListener('click', buscarFoto);

    // 8. Correção de ID ao fechar modal de exclusão
    document.getElementById('confirmDeleteModal').addEventListener('hide.bs.modal', () => {
        document.getElementById('confirmarExclusaoBtn').dataset.racaId = '';
    });
});