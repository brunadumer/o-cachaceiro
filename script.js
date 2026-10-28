/**
 * =====================================================
 * O CACHACEIRO - BAR & RESTAURANTE
 * Script Principal
 * =====================================================
 *
 * ÍNDICE:
 * 1. Menu Mobile
 * 2. Menu do Delivery
 * 3. Topbar Transparente (aparece ao rolar)
 * 4. Scroll Suave
 * 5. Reserva pelo WhatsApp
 * 6. Carrossel do Instagram
 * 7. Animações de Entrada
 * 8. Link WhatsApp
 *
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', function() {

    // EDITÁVEL: Número do WhatsApp (com DDI e DDD, só números)
    const WHATSAPP = '5541997903969';

    /* =====================================================
       1. MENU MOBILE (HAMBÚRGUER)
       ===================================================== */

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* =====================================================
       2. MENU DO DELIVERY
       =====================================================
       O botão "Delivery" abre as opções iFood e Pede Aqui.
    */

    const deliveryToggle = document.getElementById('deliveryToggle');
    const deliveryMenu = document.getElementById('deliveryMenu');

    if (deliveryToggle && deliveryMenu) {
        deliveryToggle.addEventListener('click', function() {
            const aberto = deliveryMenu.classList.toggle('active');
            deliveryToggle.setAttribute('aria-expanded', aberto);
        });
    }

    // Fecha os menus ao clicar fora deles ou apertar Esc
    function fecharMenus() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        deliveryMenu.classList.remove('active');
        deliveryToggle.setAttribute('aria-expanded', 'false');
    }

    document.addEventListener('click', function(e) {
        if (!e.target.closest('#navToggle, #navMenu, #deliveryDropdown')) {
            fecharMenus();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') fecharMenus();
    });

    /* =====================================================
       3. TOPBAR TRANSPARENTE
       =====================================================
       No topo da página a topbar fica transparente sobre a foto.
       Ao descer, ela ganha fundo verde para continuar legível.
    */

    const header = document.getElementById('header');

    function atualizarHeader() {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', atualizarHeader, { passive: true });
    atualizarHeader();

    /* =====================================================
       4. SCROLL SUAVE
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =====================================================
       5. RESERVA PELO WHATSAPP
       =====================================================
       Monta uma mensagem com os dados do formulário e abre
       a conversa no WhatsApp da casa.
    */

    const reservaForm = document.getElementById('reservaForm');
    const reservaData = document.getElementById('reservaData');

    if (reservaData) {
        // Não deixa escolher datas passadas
        const hoje = new Date();
        hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
        reservaData.min = hoje.toISOString().split('T')[0];
    }

    if (reservaForm) {
        reservaForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const dados = new FormData(reservaForm);
            const [ano, mes, dia] = dados.get('data').split('-');

            let mensagem = `Olá! Gostaria de fazer uma reserva no O Cachaceiro.\n\n` +
                `Nome: ${dados.get('nome')}\n` +
                `Data: ${dia}/${mes}/${ano}\n` +
                `Horário: ${dados.get('hora')}\n` +
                `Pessoas: ${dados.get('pessoas')}`;

            const obs = dados.get('obs').trim();
            if (obs) mensagem += `\nObservações: ${obs}`;

            window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`, '_blank');
        });
    }

    /* =====================================================
       6. CARROSSEL DO INSTAGRAM
       =====================================================
       Duplica os posts para a animação CSS rodar sem "pulo".
       Para trocar as fotos, edite os itens no HTML.
    */

    const trilho = document.getElementById('instagramTrilho');

    if (trilho) {
        Array.from(trilho.children).forEach(post => {
            const copia = post.cloneNode(true);
            copia.setAttribute('aria-hidden', 'true');
            copia.setAttribute('tabindex', '-1');
            trilho.appendChild(copia);
        });
    }

    /* =====================================================
       7. ANIMAÇÕES DE ENTRADA (SCROLL)
       =====================================================
       EDITÁVEL: Adicione ou remova seletores conforme necessário
    */

    const animateElements = document.querySelectorAll(
        '.cardapio-card, .galeria-item, .sobre-info, .reservas-info, .reserva-form, .info-item'
    );

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    /* =====================================================
       8. LINK WHATSAPP COM MENSAGEM PADRÃO
       =====================================================
       EDITÁVEL: Altere a mensagem inicial abaixo.
    */

    const defaultMessage = encodeURIComponent('Olá! Vim pelo site do O Cachaceiro e gostaria de mais informações.');

    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        const currentHref = link.getAttribute('href');
        if (!currentHref.includes('text=')) {
            link.setAttribute('href', `${currentHref}?text=${defaultMessage}`);
        }
    });

});
