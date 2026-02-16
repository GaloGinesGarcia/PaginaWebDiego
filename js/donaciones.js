// donaciones.js

// Cargar SDK de PayPal
const paypalScript = document.createElement('script');
paypalScript.src = "https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&currency=USD";
paypalScript.onload = () => {

    function renderPaypalButton(amount) {
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color:  'blue',
                shape:  'rect',
                label:  'donate'
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('¡Gracias ' + details.payer.name.given_name + ' por tu donación de $' + amount + '!');
                });
            }
        }).render('#paypal-button-container');
    }

    const donationInput = document.getElementById('donationAmount');

    donationInput.addEventListener('change', () => {
        const value = donationInput.value;
        if(value >= 1){
            document.getElementById('paypal-button-container').innerHTML = ''; // Limpiar botón anterior
            renderPaypalButton(value);
        }
    });

    // Render inicial con valor predeterminado de 10 USD
    renderPaypalButton('10.00');
};

document.body.appendChild(paypalScript);