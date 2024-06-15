document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar os dados do localStorage e preencher a tabela
    function loadInventoryData(inventoryKey, tableId) {
        const inventoryData = JSON.parse(localStorage.getItem(inventoryKey));

        // Verifica se há dados salvos para esse inventário
        if (inventoryData) {
            const tableBody = document.getElementById(tableId);

            // Limpa qualquer conteúdo anterior da tabela
            tableBody.innerHTML = '';

            // Itera sobre os itens do inventário e adiciona linhas na tabela
            Object.keys(inventoryData).forEach(key => {
                // Verifica se a chave corresponde a um item válido (ignora outras chaves como 'localizacao-item-a')
                if (key.startsWith('codigo-barras')) {
                    const itemKey = key.split('-').pop(); // Extraindo o identificador do item (a, b, c, etc.)
                    const item = {
                        codigo: inventoryData[`codigo-barras-item-${itemKey}`],
                        quantidade: inventoryData[`quantidade-item-${itemKey}`],
                        tipo: inventoryData[`tipo-unidade-item-${itemKey}`],
                        localizacao: inventoryData[`localizacao-item-${itemKey}`]
                    };

                    // Cria a linha da tabela para o item
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${itemKey.toUpperCase()}</td>
                        <td>${item.quantidade}</td>
                        <td>${item.tipo}</td>
                        <td>${item.localizacao}</td>
                        <td>${item.codigo}</td>
                    `;
                    tableBody.appendChild(row);
                }
            });
        } else {
            console.log(`Nenhum dado encontrado para ${inventoryKey}`);
        }
    }

    // Função para comparar os inventários e gerar o relatório de comparação
    function compareInventories() {
        const inventory1 = JSON.parse(localStorage.getItem('inventory1'));
        const inventory2 = JSON.parse(localStorage.getItem('inventory2'));

        // Verifica se ambos os inventários têm dados salvos
        if (inventory1 && inventory2) {
            const comparisonResult = document.getElementById('comparison-result');
            comparisonResult.innerHTML = ''; // Limpa o conteúdo anterior

            // Array para armazenar as diferenças encontradas
            const differences = [];

            // Itera sobre as chaves do inventário 1 para comparar com o inventário 2
            Object.keys(inventory1).forEach(key => {
                // Verifica se a chave corresponde a um item válido (ignora outras chaves como 'localizacao-item-a')
                if (key.startsWith('codigo-barras')) {
                    const itemKey = key.split('-').pop(); // Extraindo o identificador do item (a, b, c, etc.)
                    const item1 = {
                        codigo: inventory1[`codigo-barras-item-${itemKey}`],
                        quantidade: parseInt(inventory1[`quantidade-item-${itemKey}`])
                    };
                    const item2 = {
                        codigo: inventory2[`codigo-barras-item-${itemKey}`],
                        quantidade: parseInt(inventory2[`quantidade-item-${itemKey}`])
                    };

                    // Verifica se há diferença no código do produto
                    if (item1.codigo !== item2.codigo) {
                        differences.push(`Diferença no código do produto do item ${itemKey.toUpperCase()}: ${item1.codigo} (Inventário 1) vs ${item2.codigo} (Inventário 2)`);
                    }

                    // Verifica se há diferença na quantidade
                    if (item1.quantidade !== item2.quantidade) {
                        const diff = item2.quantidade - item1.quantidade;
                        const message = diff > 0 ? `Falta ${diff} unidades` : `Sobra ${-diff} unidades`;
                        differences.push(`Diferença na quantidade do item ${itemKey.toUpperCase()}: ${item1.quantidade} (Inventário 1) vs ${item2.quantidade} (Inventário 2). ${message}`);
                    }
                }
            });

            // Se não houver diferenças, exibe mensagem de que os inventários são iguais
            if (differences.length === 0) {
                comparisonResult.textContent = 'Os inventários são idênticos.';
            } else {
                // Caso contrário, exibe as diferenças encontradas
                differences.forEach(diff => {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = diff;
                    comparisonResult.appendChild(paragraph);
                });
            }
        } else {
            console.log('Não foi possível comparar os inventários pois um deles está vazio.');
        }
    }

    // Chama a função para carregar os dados ao carregar a página
    loadInventoryData('inventory1', 'inventory1-data');
    loadInventoryData('inventory2', 'inventory2-data');

    // Evento para gerar o relatório de comparação ao clicar no botão
    const generateReportBtn = document.getElementById('generate-report-btn');
    generateReportBtn.addEventListener('click', compareInventories);
});
