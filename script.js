// Elementos del DOM
const casillas = {
    A: document.getElementById('casillaA'),
    B: document.getElementById('casillaB')
};

const valoresCasillas = {
    A: document.getElementById('valorA'),
    B: document.getElementById('valorB')
};

const resultados = {
    AND: document.getElementById('resultadoAND'),
    OR: document.getElementById('resultadoOR'),
    XOR: document.getElementById('resultadoXOR')
};

// Configuración inicial del gráfico
const ctx = document.getElementById('resultadosChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['AND', 'OR', 'XOR'],
        datasets: [{
            label: 'Resultados',
            data: [0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 1
            }
        }
    }
});

// Función principal para actualizar valores y resultados
function actualizarValores() {
    // Actualizar valores numéricos (0/1)
    for (let casilla in casillas) {
        valoresCasillas[casilla].textContent = +casillas[casilla].checked;
    }

    // Obtener valores booleanos
    const a = casillas.A.checked;
    const b = casillas.B.checked;

    // Calcular operaciones
    const operaciones = {
        AND: a && b,
        OR: a || b,
        XOR: (a || b) && !(a && b)
    };

    // Mostrar resultados
    for (let op in operaciones) {
        const resultado = operaciones[op];
        resultados[op].innerHTML = `
            ${op}: <span class="${resultado ? 'verdadero' : 'falso'} fade-in">
                ${+resultado} (${resultado})
            </span>
        `;
        resultados[op].classList.add('pulse');
        setTimeout(() => resultados[op].classList.remove('pulse'), 500);
    }

    // Actualizar el gráfico
    chart.data.datasets[0].data = [+operaciones.AND, +operaciones.OR, +operaciones.XOR];
    chart.update();

    // Actualizar historial
    const listaHistorial = document.getElementById('listaHistorial');
    const nuevoItem = document.createElement('li');
    nuevoItem.textContent = `A: ${+a}, B: ${+b} → AND: ${+operaciones.AND}, OR: ${+operaciones.OR}, XOR: ${+operaciones.XOR}`;
    listaHistorial.prepend(nuevoItem);

    // Limitar a 5 elementos en el historial
    if (listaHistorial.children.length > 5) {
        listaHistorial.removeChild(listaHistorial.lastChild);
    }
}

// Event listeners
for (let casilla in casillas) {
    casillas[casilla].addEventListener('change', actualizarValores);
}

// Cambio de tema
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Cargar tema guardado
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// Inicializar
actualizarValores();

