/* ============================================================
   Portfólio - Lucas de Oliveira Coelho
   JavaScript puro (sem frameworks/bibliotecas como jQuery/React)

   Funcionalidades implementadas:
     1. Atualização automática do ano no rodapé
     2. Menu mobile (hamburger) - mostrar/esconder
     3. Tema claro/escuro com persistência em memória
     4. Destaque do link ativo durante o scroll
     5. Fechamento do menu ao clicar em um link (mobile)
     6. Filtros do portfólio (mostrar/esconder projetos)
     7. Validação completa do formulário de contato (nome, e-mail, mensagem)
     8. Simulação do envio do formulário (limpa campos, mostra modal de sucesso)
     9. Modal de confirmação (abrir, fechar, fechar com ESC)
   ============================================================ */

// Garante que o DOM esteja totalmente carregado antes de manipular elementos
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. ATUALIZA O ANO NO RODAPÉ ---------- */
  // Pega o ano atual dinamicamente para nunca ficar desatualizado
  const anoAtual = document.getElementById('ano-atual');
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }

  /* ---------- 2. MENU MOBILE (HAMBURGER) ---------- */
  const botaoMenu = document.getElementById('botao-menu');
  const menu = document.getElementById('menu');

  // Alterna a classe que mostra/esconde o menu em telas pequenas
  botaoMenu.addEventListener('click', function () {
    const aberto = menu.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });

  // Ao clicar em qualquer link do menu, fecha o menu mobile (UX em telas pequenas)
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. TEMA CLARO/ESCURO ---------- */
  // Aplica/remover classe .tema-escuro no body. Variáveis CSS cuidam do resto.
  const botaoTema = document.getElementById('botao-tema');
  const iconeTema = botaoTema.querySelector('.icone-tema');

  // Variável em memória (sem localStorage) para guardar a preferência durante a sessão
  let temaEscuroAtivo = false;

  function aplicarTema(escuro) {
    temaEscuroAtivo = escuro;
    document.body.classList.toggle('tema-escuro', escuro);
    iconeTema.textContent = escuro ? '☀️' : '🌙';
    botaoTema.setAttribute('aria-label',
      escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro');
  }

  // Detecta preferência inicial do sistema operacional do usuário
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    aplicarTema(true);
  }

  botaoTema.addEventListener('click', function () {
    aplicarTema(!temaEscuroAtivo);
  });

  /* ---------- 4. DESTAQUE DO LINK ATIVO DURANTE O SCROLL ---------- */
  // Observa as seções e marca o link correspondente como .ativo
  const secoes = document.querySelectorAll('main .secao');
  const linksMenu = menu.querySelectorAll('a');

  // IntersectionObserver é mais performático que listener de scroll
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        const id = entrada.target.id;
        linksMenu.forEach(function (link) {
          link.classList.toggle('ativo', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',  // ativa quando seção está aproximadamente no centro
    threshold: 0
  });

  secoes.forEach(function (secao) { observador.observe(secao); });

  /* ---------- 5. FILTROS DO PORTFÓLIO ---------- */
  const botoesFiltro = document.querySelectorAll('.filtro');
  const projetos = document.querySelectorAll('.projeto');

  botoesFiltro.forEach(function (botao) {
    botao.addEventListener('click', function () {
      // Atualiza estado visual dos botões
      botoesFiltro.forEach(function (b) {
        b.classList.remove('ativo');
        b.setAttribute('aria-selected', 'false');
      });
      botao.classList.add('ativo');
      botao.setAttribute('aria-selected', 'true');

      const filtro = botao.getAttribute('data-filtro');

      // Mostra/esconde projetos conforme a categoria
      projetos.forEach(function (projeto) {
        const categorias = projeto.getAttribute('data-categoria') || '';
        if (filtro === 'todos' || categorias.includes(filtro)) {
          projeto.classList.remove('escondido');
        } else {
          projeto.classList.add('escondido');
        }
      });
    });
  });

  /* ---------- 6. VALIDAÇÃO DO FORMULÁRIO DE CONTATO ---------- */
  /* Requisitos da atividade:
     - Verificar se nome, e-mail e mensagem estão preenchidos
     - Validar formato do e-mail (regex)
     - Após validação: limpar campos e exibir mensagem de confirmação
  */
  const formulario = document.getElementById('formulario-contato');
  const campoNome = document.getElementById('nome');
  const campoEmail = document.getElementById('email');
  const campoMensagem = document.getElementById('mensagem');
  const erroNome = document.getElementById('erro-nome');
  const erroEmail = document.getElementById('erro-email');
  const erroMensagem = document.getElementById('erro-mensagem');
  const statusFormulario = document.getElementById('status-formulario');

  // Regex para validar formato de e-mail (usuario@dominio.com)
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Funções utilitárias para mostrar/limpar mensagens de erro
  function mostrarErro(campo, elementoErro, mensagem) {
    campo.parentElement.classList.add('com-erro');
    elementoErro.textContent = mensagem;
  }
  function limparErro(campo, elementoErro) {
    campo.parentElement.classList.remove('com-erro');
    elementoErro.textContent = '';
  }

  // Validação individual de cada campo
  function validarNome() {
    const valor = campoNome.value.trim();
    if (valor === '') {
      mostrarErro(campoNome, erroNome, 'Por favor, informe seu nome.');
      return false;
    }
    if (valor.length < 2) {
      mostrarErro(campoNome, erroNome, 'O nome deve ter pelo menos 2 caracteres.');
      return false;
    }
    limparErro(campoNome, erroNome);
    return true;
  }

  function validarEmail() {
    const valor = campoEmail.value.trim();
    if (valor === '') {
      mostrarErro(campoEmail, erroEmail, 'Por favor, informe seu e-mail.');
      return false;
    }
    if (!regexEmail.test(valor)) {
      mostrarErro(campoEmail, erroEmail, 'E-mail inválido. Use o formato usuario@dominio.com.');
      return false;
    }
    limparErro(campoEmail, erroEmail);
    return true;
  }

  function validarMensagem() {
    const valor = campoMensagem.value.trim();
    if (valor === '') {
      mostrarErro(campoMensagem, erroMensagem, 'Por favor, escreva uma mensagem.');
      return false;
    }
    if (valor.length < 10) {
      mostrarErro(campoMensagem, erroMensagem, 'A mensagem deve ter pelo menos 10 caracteres.');
      return false;
    }
    limparErro(campoMensagem, erroMensagem);
    return true;
  }

  // Validação em tempo real ao sair de cada campo (evento blur)
  campoNome.addEventListener('blur', validarNome);
  campoEmail.addEventListener('blur', validarEmail);
  campoMensagem.addEventListener('blur', validarMensagem);

  // Limpa o erro do campo assim que o usuário começa a digitar novamente
  [campoNome, campoEmail, campoMensagem].forEach(function (campo) {
    campo.addEventListener('input', function () {
      campo.parentElement.classList.remove('com-erro');
      const erro = document.getElementById('erro-' + campo.id);
      if (erro) erro.textContent = '';
    });
  });

  // Submissão do formulário
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();   // impede o envio real (estamos simulando)

    // Executa todas as validações (não usa &&  curto-circuito para mostrar todos os erros)
    const nomeOk = validarNome();
    const emailOk = validarEmail();
    const mensagemOk = validarMensagem();

    if (nomeOk && emailOk && mensagemOk) {
      // ----- Simulação do envio bem-sucedido -----
      // Em uma aplicação real, aqui seria feita uma chamada fetch() para o servidor.
      formulario.reset();                                // limpa todos os campos
      statusFormulario.textContent = 'Mensagem enviada com sucesso! Em breve retornarei o contato.';
      abrirModal();                                      // exibe modal de confirmação

      // Remove a mensagem de status após 6 segundos
      setTimeout(function () {
        statusFormulario.textContent = '';
      }, 6000);
    } else {
      statusFormulario.textContent = '';
      // Foca no primeiro campo com erro para acessibilidade
      const primeiroErro = formulario.querySelector('.com-erro input, .com-erro textarea');
      if (primeiroErro) primeiroErro.focus();
    }
  });

  /* ---------- 7. MODAL DE CONFIRMAÇÃO ---------- */
  const modal = document.getElementById('modal');
  const fecharModalBotao = document.getElementById('fechar-modal');
  const okModalBotao = document.getElementById('ok-modal');

  function abrirModal() {
    modal.hidden = false;
    // Foca no botão OK para acessibilidade via teclado
    setTimeout(function () { okModalBotao.focus(); }, 50);
  }
  function fecharModal() {
    modal.hidden = true;
  }

  fecharModalBotao.addEventListener('click', fecharModal);
  okModalBotao.addEventListener('click', fecharModal);

  // Fecha o modal ao clicar fora do conteúdo
  modal.addEventListener('click', function (evento) {
    if (evento.target === modal) fecharModal();
  });

  // Fecha o modal ao pressionar ESC
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && !modal.hidden) fecharModal();
  });

});
