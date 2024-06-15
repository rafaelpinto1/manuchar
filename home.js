function getUserName() {
    if (localStorage.getItem('userEmail')) {
        let userEmail = localStorage.getItem('userEmail');
        // Verifica se o email contém '@' antes de tentar dividir
        if (userEmail.includes('@')) {
            let userName = userEmail.split('@')[0];
            return userName;
        }
    }
    return 'Usuário';
}

document.addEventListener('DOMContentLoaded', function() {
    let welcomeMessage = document.getElementById('welcome-message');
    let userName = getUserName();
    welcomeMessage.textContent = `Bem-vindo, ${userName}`;

    // Modal
    let modal = document.getElementById('myModal');
    let inventarioLink = document.getElementById('inventario-link');

    // Quando o link "Inventário" é clicado, mostra o modal
    inventarioLink.addEventListener('click', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do link
        modal.style.display = 'block';
    });

    // Quando um botão de contagem é clicado, redireciona para a página de inventário com o parâmetro contagem
    document.getElementById('contagem1').addEventListener('click', function() {
        window.location.href = 'inventario1.html';
    });

    document.getElementById('contagem2').addEventListener('click', function() {
        window.location.href = 'inventario2.html';
    });

    // Fecha o modal se o usuário clicar fora da área do modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
