document.addEventListener('DOMContentLoaded', function() {
    const currentDateElement = document.getElementById('current-date');
    currentDateElement.textContent = new Date().toLocaleDateString('pt-BR');

    function initQuagga(targetInput) {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#interactive'),
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                },
            },
            locator: {
                halfSample: false,
                patchSize: "medium",
                debug: {
                    showCanvas: true,
                    showPatches: true,
                    showFoundPatches: true,
                    showSkeleton: false,
                    showLabels: false,
                    showPatchLabels: false,
                    showRemainingPatchLabels: false,
                    boxFromPatches: {
                        showTransformed: true,
                        showTransformedBox: true,
                        showBB: true
                    }
                }
            },
            decoder: {
                readers: ["ean_reader"]
            },
            locate: true
        }, function(err) {
            if (err) {
                console.error(err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(function(result) {
            if (result.codeResult.code) {
                document.querySelector(`[name="${targetInput}"]`).value = result.codeResult.code;
                playBeepSound();
                Quagga.stop();
                document.getElementById('scanner-container').style.display = 'none';
            }
        });
    }

    function playBeepSound() {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const o = context.createOscillator();
        const g = context.createGain();
        o.type = 'sine';
        o.connect(g);
        g.connect(context.destination);
        o.start(0);
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
    }

    const scanButtons = document.querySelectorAll('.scan-btn');
    scanButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetInput = button.getAttribute('data-target');
            document.getElementById('scanner-container').style.display = 'block';
            initQuagga(targetInput);
        });
    });

    const inventoryForm = document.getElementById('inventory-form');
    inventoryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(inventoryForm);
        const inventoryData = {};
        formData.forEach((value, key) => {
            inventoryData[key] = value;
        });
        localStorage.setItem('inventory1', JSON.stringify(inventoryData));

        // Exibir mensagem personalizada
        showMessage('Inventário 1: Dados salvos com sucesso! 🎉');
    });

    const exportButton = document.getElementById('export-button');
    exportButton.addEventListener('click', function(event) {
        event.preventDefault();
        const formData = new FormData(inventoryForm);
        const inventoryArray = [];
        formData.forEach((value, key) => {
            inventoryArray.push({ [key]: value });
        });
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(inventoryArray);
        XLSX.utils.book_append_sheet(wb, ws, 'Inventário 1');
        XLSX.writeFile(wb, 'inventario1.xlsx');
    });

    // Função para mostrar a mensagem
    function showMessage(message) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';

        setTimeout(function() {
            messageContainer.style.display = 'none';
        }, 3000); // Esconder a mensagem após 3 segundos
    }
});
