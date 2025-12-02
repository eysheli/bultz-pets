/**
 * Arquivo: contato.js
 * Descrição: Script de validação e simulação de envio do formulário de contato.
 */

// 1. Espera o DOM (Document Object Model) estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    
    // 2. Obtém a referência ao formulário
    const formContato = document.getElementById('formContato');
    
    // Verifica se o formulário existe na página
    if (formContato) {
        
        // 3. Adiciona um 'listener' para o evento de submissão do formulário
        formContato.addEventListener('submit', function(event) {
            
            // Impede o envio padrão do formulário (o que faria a página recarregar)
            event.preventDefault();

            // 4. Obtém os valores dos campos
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            
            // Referência para exibir mensagens (feedback ao usuário)
            const feedbackDiv = document.getElementById('feedbackMensagem');
            
            // Limpa mensagens anteriores
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = 'mt-3 p-3 rounded';

            // 5. Validação dos Campos
            if (nome === '' || email === '' || mensagem === '') {
                // Se algum campo estiver vazio, exibe erro
                feedbackDiv.classList.add('bg-danger', 'text-white');
                feedbackDiv.textContent = '❌ Por favor, preencha todos os campos obrigatórios.';
                return; // Interrompe o processo de envio
            }

            // 6. Simulação de Envio Bem-Sucedido
            
            // Desabilita o botão para evitar cliques múltiplos
            const btnEnviar = document.getElementById('btnEnviar');
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'Aguarde... Enviando!';

            // Simula um tempo de processamento de rede (2 segundos)
            setTimeout(() => {
                
                // Exibe a mensagem de sucesso
                feedbackDiv.classList.add('bg-success', 'text-white');
                feedbackDiv.textContent = '✅ Mensagem enviada com sucesso! Em breve, entraremos em contato.';

                // Limpa o formulário após o "envio"
                formContato.reset();

                // Reabilita o botão
                btnEnviar.disabled = false;
                btnEnviar.textContent = 'Enviar Mensagem';

                // Rola a página para que o usuário veja a mensagem de feedback
                feedbackDiv.scrollIntoView({ behavior: 'smooth' });
                
            }, 2000); // 2000 milissegundos = 2 segundos
        });
    }
});