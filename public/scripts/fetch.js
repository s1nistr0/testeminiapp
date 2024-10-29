document.addEventListener('DOMContentLoaded', function () {
    fetch('listModelos.php')
        .then(response => response.json())
        .then(data => {
            loadModelos(data, 'mais-procuradas-container');
            loadModelos(data, 'modelos-premium-container');
            loadModelos(data, 'top-10-brasil-container');
            loadModelos(data, 'top-10-gringas-container');
            loadModelos(data, 'top-10-loiras-container');
            loadModelos(data, 'top-10-gamers-container');
            loadModelos(data, 'todas-as-modelos-container');
        })
        .catch(error => console.error('Erro ao carregar modelos:', error));

    function loadModelos(data, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Limpa o container antes de adicionar novos itens

        data.slice(0, 10).forEach(modelo => { // Limitar a 10 modelos
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <a href="#" class="catalog-item" data-id="${modelo.id}">
                    <img src="${modelo.image}" alt="${modelo.name}" style="width: 133.99px; height: 204.32px;">
                </a>`;
            container.appendChild(card);
        });
    }
});