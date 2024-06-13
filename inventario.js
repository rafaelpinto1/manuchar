document.addEventListener('DOMContentLoaded', function () {
    const scanButtons = document.querySelectorAll('.scan-btn');

    scanButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetInputName = this.getAttribute('data-target');
            const targetInput = document.querySelector(`input[name="${targetInputName}"]`);
            startScanner(targetInput);
        });
    });

    function startScanner(inputElement) {
        const scannerContainer = document.getElementById('scanner-container');
        scannerContainer.style.display = 'flex';

        Quagga.init({
            inputStream: {
                type: "LiveStream",
                target: document.querySelector('#interactive'),
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                },
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"]
            },
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });

        Quagga.onDetected(function (data) {
            inputElement.value = data.codeResult.code;
            stopScanner();
        });
    }

    function stopScanner() {
        Quagga.stop();
        const scannerContainer = document.getElementById('scanner-container');
        scannerContainer.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const currentDateElement = document.getElementById('current-date');
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = today.toLocaleDateString('pt-BR', options);
  });
