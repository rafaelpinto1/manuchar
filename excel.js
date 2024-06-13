document.addEventListener("DOMContentLoaded", function() {
  const saveButton = document.querySelector('button[type="submit"]');

  saveButton.addEventListener('click', function(event) {
    event.preventDefault();

    try {
      const formData = getFormData();
      const inventoryData = {
        'Tipo de Contagem': document.getElementById('contagem-tipo').value,
        'Data': document.getElementById('current-date').textContent.trim(),
        'Itens': formData
      };

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(inventoryData.Itens);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventário');
      XLSX.writeFile(workbook, 'inventario.xlsx');
    } catch (error) {
      console.error("Error generating Excel file:", error);
      // Handle the error gracefully, like displaying an error message
    }
  });

  function getFormData() {
    const data = [];
    const inventoryRows = document.querySelectorAll('.inventory-table tbody tr');

    inventoryRows.forEach(row => {
      const item = {
        'Item': row.querySelector('td:nth-child(1)').textContent.trim(),
        'Quantidade': parseInt(row.querySelector('input[type="number"]').value),
        'Localização': row.querySelector('select').value,
        'Código do Produto': row.querySelector('input[type="text"]').value
      };
      data.push(item);
    });

    return data;
  }

  // Atualiza a data atual no título h1
  const currentDateElement = document.getElementById('current-date');
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  currentDateElement.textContent = today.toLocaleDateString('pt-BR', options);
});