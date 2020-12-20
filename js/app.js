const monedaSelect = document.querySelector('#moneda');
const cryptoSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const objCrypto = {
    moneda: '',
    criptomoneda: ''
};
//crear promise
const obtenerCrypto = cryptomoneda => new Promise(resolve => {
    resolve(cryptomoneda);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCrypto();
    formulario.addEventListener('submit', validacion);
    cryptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCrypto() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => obtenerCrypto(resultado.Data))
        .then(cryptomoneda => cryptosFilter(cryptomoneda))
        .catch( err => console.error(err))
};

function cryptosFilter(cryptos) {
    
    cryptos.forEach(element => {
        
        const {FullName, Name} = element.CoinInfo;
        const selector = document.createElement('option');
        selector.value = Name;
        selector.textContent = FullName;
        cryptoSelect.appendChild(selector);
    });
    
};


function validacion(e) {
    e.preventDefault();
    const {moneda, criptomoneda} = objCrypto;
    if(moneda === '' || criptomoneda === '') {
        mensajeAlerta('Por favor, todos los campos son obligatorios.')
        return;
    } 
    cotizar();
    
}

function mensajeAlerta(mensaje) {
    const alertaExiste = document.querySelector('.error')
    if(!alertaExiste) {
        const alerta = document.createElement('div');
        alerta.classList.add('error');
        alerta.textContent = mensaje;
        resultado.appendChild(alerta);
        setTimeout(() => {
            alerta.remove()
        }, 1800);
    }
    
}
function leerValor(e) {
    objCrypto[e.target.name] = e.target.value;
}
function cotizar() {
    const {moneda, criptomoneda} = objCrypto;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    mostrarSpinner();
    
    fetch(url)
        .then( result => result.json())
        .then( data => cotizacion(data.DISPLAY[criptomoneda][moneda]))
        .catch( err => console.error(err))
    
};
function cotizacion(cotizacion) {
    limpiarHtml();
    console.log(cotizacion)
    const titulo =  document.createElement('p');
    titulo.classList.add('precio');
    titulo.innerHTML = `Cotizacion de criptomoneda ${cryptoSelect.value} con ${monedaSelect.value}`;
    resultado.appendChild(titulo);

    const {PRICE, HIGHDAY, LOWDAY, CHANGE24HOUR, LASTUPDATE } = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.textContent = `Precio: ${PRICE}`;
    resultado.appendChild(precio);

    const max = document.createElement('p');
    max.classList.add('resultado');
    max.textContent = `Maximo: ${HIGHDAY}`;
    resultado.appendChild(max);

    const min = document.createElement('p');
    min.classList.add('resultado');
    min.textContent = `Minimo: ${LOWDAY}`;
    resultado.appendChild(min);

    const dif = document.createElement('p');
    dif.classList.add('resultado');
    dif.innerHTML = `<p>Diferencia diaria: <spam>${CHANGE24HOUR}</spam></p>`;
    resultado.appendChild(dif);

    const update = document.createElement('p');
    update.classList.add('resultado');
    update.innerHTML = `<p>Ultima cotizacion: <spam>${LASTUPDATE}</spam></p>`;
    resultado.appendChild(update);
    
}
function limpiarHtml() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
};
function mostrarSpinner() {
    limpiarHtml();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>`;
    resultado.appendChild(spinner);
    console.log('hola')
    
};

