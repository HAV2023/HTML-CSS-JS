document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioRegistro');
    const btnEnviar = document.getElementById('btn-enviar');
    const mensajeExito = document.getElementById('mensaje-exito');

    // Inputs Personales
    const inputNombre = document.getElementById('nombre');
    const inputEdad = document.getElementById('edad');
    
    // Inputs Contacto
    const inputEmail = document.getElementById('email');
    const inputConfirmarEmail = document.getElementById('confirmar-email');
    const selectPais = document.getElementById('pais');
    const inputTelefono = document.getElementById('telefono');
    const spanPrefijo = document.getElementById('prefijo-telefono');

    // Inputs Domicilio
    const inputCalle = document.getElementById('calle');
    const inputNumero = document.getElementById('numero');
    const inputCP = document.getElementById('cp');
    const inputColonia = document.getElementById('colonia');
    const inputCiudad = document.getElementById('ciudad');
    const inputEstado = document.getElementById('estado');

    // Inputs Seguridad
    const inputPassword = document.getElementById('password');
    const inputConfirmarPassword = document.getElementById('confirmar-password');

    // Configuración de Países (Código, Prefijo, Máscara, Longitud)
    const configPaises = {
        'MX': { prefijo: '+52', mascara: '(XXX) XXX XXXX', longitud: 10, flag: '🇲🇽' },
        'US': { prefijo: '+1', mascara: 'XXX XXX XXXX', longitud: 10, flag: '🇺🇸' },
        'CO': { prefijo: '+57', mascara: 'XXX XXX XXXX', longitud: 10, flag: '🇨🇴' },
        'ES': { prefijo: '+34', mascara: 'XXX XXX XXX', longitud: 9, flag: '🇪🇸' },
        'AR': { prefijo: '+54', mascara: 'XX XXXX XXXX', longitud: 10, flag: '🇦🇷' }
    };

    // Correos simulados ya registrados
    const correosRegistrados = ['admin@empresa.com', 'usuario@prueba.com', 'hector@ejemplo.com'];

    // --- EVENTOS DE INPUT (TIEMPO REAL) ---

    // Nombre: Solo letras y mayúsculas
    inputNombre.addEventListener('input', (e) => {
        const regex = /[^A-ZÁÉÍÓÚÑ\s]/gi;
        e.target.value = e.target.value.replace(regex, '').toUpperCase();
        limpiarError('error-nombre', inputNombre);
    });

    // Edad y Campos Numéricos Domicilio: Solo números
    [inputEdad, inputNumero, inputCP].forEach(input => {
        input.addEventListener('input', (e) => {
            const regex = /[^0-9]/g;
            e.target.value = e.target.value.replace(regex, '');
            limpiarError(`error-${input.id}`, input);
        });
    });

    // Campos de Texto Domicilio: Solo letras y números básicos
    [inputCalle, inputColonia, inputCiudad, inputEstado].forEach(input => {
        input.addEventListener('input', (e) => {
            const regex = /[^A-Z0-9\sÁÉÍÓÚÑ]/gi;
            e.target.value = e.target.value.replace(regex, '').toUpperCase();
            limpiarError(`error-${input.id}`, input);
        });
    });

    // Emails: SIEMPRE EN MINÚSCULAS
    inputEmail.addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase();
        limpiarError('error-email', inputEmail);
    });

    inputConfirmarEmail.addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase();
        limpiarError('error-confirmar-email', inputConfirmarEmail);
    });

    // Passwords
    inputPassword.addEventListener('input', () => limpiarError('error-password', inputPassword));
    inputConfirmarPassword.addEventListener('input', () => limpiarError('error-confirmar-password', inputConfirmarPassword));

    // --- LÓGICA DE TELÉFONO Y PAÍS ---

    selectPais.addEventListener('change', (e) => {
        const paisCodigo = e.target.value;
        const config = configPaises[paisCodigo];

        if (config) {
            inputTelefono.disabled = false;
            inputTelefono.placeholder = config.mascara.replace(/X/g, '0');
            spanPrefijo.textContent = config.prefijo;
            inputTelefono.value = '';
            limpiarError('error-telefono', inputTelefono);
            inputTelefono.focus();
        } else {
            inputTelefono.disabled = true;
            inputTelefono.placeholder = 'Seleccione un país';
            spanPrefijo.textContent = '+__';
            inputTelefono.value = '';
        }
    });

    inputTelefono.addEventListener('input', (e) => {
        const paisCodigo = selectPais.value;
        if (!paisCodigo || !configPaises[paisCodigo]) return;

        const config = configPaises[paisCodigo];
        
        let valor = e.target.value.replace(/[^0-9]/g, '');
        
        if (valor.length > config.longitud) {
            valor = valor.substring(0, config.longitud);
        }

        let valorEnmascarado = '';
        let indiceValor = 0;
        
        for (let i = 0; i < config.mascara.length; i++) {
            if (config.mascara[i] === 'X' && indiceValor < valor.length) {
                valorEnmascarado += valor[indiceValor];
                indiceValor++;
            } else if (config.mascara[i] !== 'X') {
                valorEnmascarado += config.mascara[i];
            }
        }
        
        e.target.value = valorEnmascarado;
        limpiarError('error-telefono', inputTelefono);
    });

    // --- SIMULACIÓN DE SERVIDOR ---
    function simularVerificacionServidor(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const existe = correosRegistrados.includes(email.toLowerCase());
                resolve(existe);
            }, 1000);
        });
    }

    // --- VALIDACIÓN AL ENVIAR ---
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        let esValido = true;

        // 1. Validar Nombre
        if (inputNombre.value.length < 3) {
            mostrarError('error-nombre', inputNombre, 'El nombre debe tener al menos 3 letras.');
            esValido = false;
        }

        // 2. Validar Edad
        if (inputEdad.value === '' || parseInt(inputEdad.value) < 18 || parseInt(inputEdad.value) > 100) {
            mostrarError('error-edad', inputEdad, 'La edad debe ser entre 18 y 100 años.');
            esValido = false;
        }

        // 3. Validar Emails
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputEmail.value)) {
            mostrarError('error-email', inputEmail, 'Correo electrónico inválido.');
            esValido = false;
        }
        if (inputEmail.value !== inputConfirmarEmail.value || inputConfirmarEmail.value === '') {
            mostrarError('error-confirmar-email', inputConfirmarEmail, 'Los correos no coinciden.');
            esValido = false;
        }

        // 4. Validar País y Teléfono
        const paisCodigo = selectPais.value;
        if (!paisCodigo) {
            mostrarError('error-pais', selectPais, 'Debe seleccionar un país.');
            esValido = false;
        } else {
            const config = configPaises[paisCodigo];
            const telefonoLimpio = inputTelefono.value.replace(/[^0-9]/g, '');
            if (telefonoLimpio.length !== config.longitud) {
                mostrarError('error-telefono', inputTelefono, `El teléfono debe tener ${config.longitud} dígitos.`);
                esValido = false;
            }
        }

        // 5. Validar Domicilio
        if (inputCalle.value.length < 3) {
            mostrarError('error-calle', inputCalle, 'Calle inválida.');
            esValido = false;
        }
        if (inputNumero.value === '') {
            mostrarError('error-numero', inputNumero, 'Número requerido.');
            esValido = false;
        }
        if (inputCP.value.length < 4 || inputCP.value.length > 5) {
            mostrarError('error-cp', inputCP, 'Código Postal inválido.');
            esValido = false;
        }
        if (inputColonia.value.length < 3) {
            mostrarError('error-colonia', inputColonia, 'Colonia requerida.');
            esValido = false;
        }
        if (inputCiudad.value.length < 3) {
            mostrarError('error-ciudad', inputCiudad, 'Ciudad requerida.');
            esValido = false;
        }
        if (inputEstado.value.length < 3) {
            mostrarError('error-estado', inputEstado, 'Estado requerido.');
            esValido = false;
        }

        // 6. Validar Contraseñas
        if (inputPassword.value.length < 8) {
            mostrarError('error-password', inputPassword, 'Mínimo 8 caracteres.');
            esValido = false;
        }
        if (inputConfirmarPassword.value !== inputPassword.value) {
            mostrarError('error-confirmar-password', inputConfirmarPassword, 'Las contraseñas no coinciden.');
            esValido = false;
        }

        if (!esValido) {
            mensajeExito.style.display = 'none';
            return;
        }

        // 7. Verificación de correo existente
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Verificando datos...';
        limpiarError('error-email', inputEmail);

        const existeCorreo = await simularVerificacionServidor(inputEmail.value);

        if (existeCorreo) {
            mostrarError('error-email', inputEmail, 'Este correo ya está registrado.');
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Registrar Datos';
            return;
        }

        // 8. Éxito
        mensajeExito.textContent = 'Registro completado con éxito.';
        mensajeExito.style.display = 'block';
        btnEnviar.textContent = 'Registrado';
        
        setTimeout(() => {
            formulario.reset();
            mensajeExito.style.display = 'none';
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Registrar Datos';
            inputTelefono.disabled = true;
            spanPrefijo.textContent = '+__';
            selectPais.value = '';
        }, 3000);
    });

    // Funciones Auxiliares
    function mostrarError(idError, elemento, mensaje) {
        const spanError = document.getElementById(idError);
        spanError.textContent = mensaje;
        elemento.classList.add('error');
        if(elemento.id === 'telefono') {
            elemento.parentElement.classList.add('error');
        }
    }

    function limpiarError(idError, elemento) {
        const spanError = document.getElementById(idError);
        spanError.textContent = '';
        elemento.classList.remove('error');
        if(elemento.id === 'telefono') {
            elemento.parentElement.classList.remove('error');
        }
    }
});
