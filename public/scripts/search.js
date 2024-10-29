document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    const catId = urlParams.get('catid');
    const categoria = urlParams.get('categoria');

    const searchInput = document.querySelector(".search-input");
    const logo = document.querySelector(".logo a");

    if (catId) {
        fetchItemDetails(catId);
    }
    if (categoria) {
        filterByCategory(categoria);
        document.getElementById('category-container').classList.add('category-style');
        document.getElementById('category').classList.add('category-expanded');
    }
    if (userId) {
        loadCompras(userId);
    }

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            performSearch(query);
        } else {
            resetPage();
        }
    });

    logo.addEventListener("click", function (event) {
        event.preventDefault();
        resetPage();
    });

    function performSearch(query) {
        fetch(`search.php?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                displaySearchResults(data);
            });
    }

    function displaySearchResults(results) {
        const mainContent = document.getElementById('main-content');
        mainContent.style.display = 'none';

        let pesquisaSection = document.getElementById('pesquisa');
        pesquisaSection.style.display = 'block';

        const pesquisaContainer = document.getElementById("pesquisa-container");
        pesquisaContainer.innerHTML = '';

        if (results.length === 0) {
            pesquisaContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; max-width: 80%; text-align: center;"><p style="color: white;">Parece que nenhum conteúdo foi encontrado para a pesquisa que você fez, tente buscar novamente ou clique no botão abaixo para voltar a tela inicial</p>
                <button class="btn" id="resetButton">Voltar a tela inicial</button></div>
            `;
            document.getElementById('resetButton').addEventListener('click', resetPage);
            pesquisaContainer.style.justifyContent = 'center';

        } else {
            results.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `<a href="#" class="catalog-item" data-id="${item.id}"><img src="${item.imagem}" alt="${item.nome}"></a>`;
                pesquisaContainer.appendChild(card);
                pesquisaContainer.style.justifyContent = 'flex-start';
            });

            document.querySelectorAll('.catalog-item').forEach(item => {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    const itemId = this.dataset.id;
                    fetchItemDetails(itemId);
                });
            });
        }
    }

    function resetPage() {
        const pesquisaSection = document.getElementById('pesquisa');
        pesquisaSection.style.display = 'none';

        const categorySection = document.getElementById('category');
        categorySection.style.display = 'none';

        const mainContent = document.getElementById('main-content');
        mainContent.style.display = 'block';

        searchInput.value = '';
    }

    function formatNumber(num) {
        return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function fetchItemDetails(itemId, userId) {
        fetch(`main.php?catid=${itemId}&user_id=${userId}`)
            .then(response => response.json())
            .then(data => {
                const popup = document.getElementById('popup');
                document.getElementById('popup-image').src = data.imagem;
                document.getElementById('popup-title').textContent = data.nome;

                // Adicionar "⭐️SÉRIE COMPLETA⭐️" ao início da sinopse se a categoria for "reels"
                let synopsis = data.sinopse;
                if (data.categoria === 'Reels') {
                    synopsis = "⭐️SÉRIE COMPLETA⭐️<br>" + synopsis;
                }
                document.getElementById('popup-synopsis').innerHTML = synopsis;

                const oldPriceElement = document.getElementById('popup-old-price');
                const newPriceElement = document.getElementById('popup-new-price');
                const popupSpan = document.getElementById('popup-price-span');
                const oldPriceWrapper = document.querySelector('.old-price-wrapper');
                const brElement = oldPriceWrapper.nextElementSibling;

                let newPrice = data.preco_real;

                if (data.promo > 0) {
                    const discount = (data.preco_real * data.promo) / 100;
                    newPrice = data.preco_real - discount;

                    oldPriceElement.textContent = `De: R$${formatNumber(data.preco_real)}`;
                    oldPriceElement.style.display = 'block';
                    if (brElement.tagName === 'BR') {
                        brElement.style.display = 'block';
                    }
                    newPriceElement.textContent = `Por: R$${formatNumber(newPrice)}`;
                } else {
                    oldPriceElement.style.display = 'none';
                    if (brElement.tagName === 'BR') {
                        brElement.style.display = 'none';
                    }
                    newPriceElement.textContent = `Por: R$${formatNumber(newPrice)}`;
                }

                if (data.comprado) {
                    popupSpan.style.display = 'none';
                    document.querySelector('.popup-btn').textContent = 'Acessar';
                    document.querySelector('.popup-btn').setAttribute('onclick', `sendDataToBot("${data.id}", "${data.nome}", "True", "${data.canal_id}"); return false;`);
                } else {
                    popupSpan.style.display = 'block';
                    document.querySelector('.popup-btn').textContent = 'Comprar';
                    document.querySelector('.popup-btn').setAttribute('onclick', `sendDataToBot("${data.id}", "${data.nome}", "${newPrice.toFixed(2)}", "${data.canal_id}"); return false;`);
                }

                popup.classList.add('show');
                popup.classList.remove('hide');
                popup.style.display = 'flex';
            });
    }

    function filterByCategory(categoria) {
        fetch(`main.php?action=filterByCategory&categoria=${categoria}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const mainContent = document.getElementById('main-content');
                mainContent.style.display = 'none';

                const categorySection = document.getElementById('category');
                categorySection.style.display = 'block';

                const categoryContainer = document.getElementById('category-container');
                categoryContainer.innerHTML = ''; // Limpa o container

                // Altera o título do h2 com base na categoria
                const categoryTitle = document.getElementById('resultH2');
                if (categoria === 'Filme') {
                    categoryTitle.textContent = 'Filmes:';
                } else if (categoria === 'Série') {
                    categoryTitle.textContent = 'Séries:';
                } else if (categoria === 'Anime') {
                    categoryTitle.textContent = 'Animes:';
                } else if (categoria === 'Reels') {
                    categoryTitle.textContent = 'Reels:';
                } else {
                    categoryTitle.textContent = 'Resultados:';
                }

                data.forEach(item => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `<a href="#" class="catalog-item" data-id="${item.id}"><img src="${item.image}" alt="${item.title}"></a>`;
                    categoryContainer.appendChild(card);
                });
            })
    }

    function loadCompras(userId) {
        fetch(`main.php?action=loadCompras&user_id=${userId}`)
            .then(response => response.json())
            .then(data => {
                const comprasContainer = document.getElementById('compras-container');
                const comprasSection = document.getElementById('compras');
                comprasContainer.innerHTML = ''; // Limpa o container
                if (data.length > 0) {
                    comprasSection.style.display = 'block';
                } else {
                    comprasSection.style.display = 'none';
                }
                data.forEach(item => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `<a href="#" class="catalog-item" data-id="${item.id}"><img src="${item.image}" alt="${item.title}"></a>`;
                    comprasContainer.appendChild(card);
                });
            });
    }
});
