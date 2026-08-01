
document.addEventListener('DOMContentLoaded', function() {

    // Seleccionamos el formulario y los elementos
    const form = document.getElementById('contactForm');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const mensajeInput = document.getElementById('mensaje');
    const submitBtn = document.getElementById('submitBtn');
    const respuestaDiv = document.getElementById('respuestaConfirmacion');
    const datosEnviadosDiv = document.getElementById('datosEnviados');

    // Referencias a los mensajes de error
    const nombreError = document.getElementById('nombreError');
    const emailError = document.getElementById('emailError');
    const mensajeError = document.getElementById('mensajeError');

    // FUNCIÓN PARA VALIDAR EL EMAIL
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // FUNCIONES PARA MOSTRAR/OCULTAR ERRORES
    function mostrarError(elementoError, mensaje) {
        elementoError.textContent = mensaje;
        elementoError.style.display = 'block';
        // Agregar clase de error al input
        const input = elementoError.parentElement.querySelector('input, textarea');
        if (input) {
            input.classList.add('error');
            input.classList.remove('success');
        }
    }

    function limpiarError(elementoError) {
        elementoError.textContent = '';
        elementoError.style.display = 'none';
        // Quitar clase de error y agregar éxito si tiene valor
        const input = elementoError.parentElement.querySelector('input, textarea');
        if (input) {
            input.classList.remove('error');
            if (input.value.trim() !== '') {
                input.classList.add('success');
            } else {
                input.classList.remove('success');
            }
        }
    }


    // VALIDACIÓN EN TIEMPO REAL

    // Valida nombre
    nombreInput.addEventListener('input', function() {
        const valor = this.value.trim();
        if (valor === '') {
            mostrarError(nombreError, '⚠️ El nombre es obligatorio');
        } else if (valor.length < 3) {
            mostrarError(nombreError, '⚠️ El nombre debe tener al menos 3 caracteres');
        } else if (valor.length > 50) {
            mostrarError(nombreError, '⚠️ El nombre no puede tener más de 50 caracteres');
        } else {
            limpiarError(nombreError);
        }
    });

    // Valida email
    emailInput.addEventListener('input', function() {
        const valor = this.value.trim();
        if (valor === '') {
            mostrarError(emailError, '⚠️ El correo electrónico es obligatorio');
        } else if (!validarEmail(valor)) {
            mostrarError(emailError, '⚠️ Ingresa un correo válido (ejemplo@dominio.com)');
        } else {
            limpiarError(emailError);
        }
    });

    // Validar mensaje
    mensajeInput.addEventListener('input', function() {
        const valor = this.value.trim();
        if (valor === '') {
            mostrarError(mensajeError, '⚠️ El mensaje no puede estar vacío');
        } else if (valor.length < 10) {
            mostrarError(mensajeError, '⚠️ El mensaje debe tener al menos 10 caracteres');
        } else if (valor.length > 500) {
            mostrarError(mensajeError, '⚠️ El mensaje no puede tener más de 500 caracteres');
        } else {
            limpiarError(mensajeError);
        }
    });

    // EVENTO DE ENVÍO DEL FORMULARIO
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que se recargue la página

        // Limpiamos errores previos
        limpiarError(nombreError);
        limpiarError(emailError);
        limpiarError(mensajeError);

        // Obtenemos los valores
        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const mensaje = mensajeInput.value.trim();

        // VALIDACIÓN FINAL
        let esValido = true;

        // Validar nombre
        if (nombre === '') {
            mostrarError(nombreError, 'El nombre es obligatorio');
            esValido = false;
        } else if (nombre.length < 3) {
            mostrarError(nombreError, 'El nombre debe tener al menos 3 caracteres');
            esValido = false;
        } else if (nombre.length > 50) {
            mostrarError(nombreError, 'El nombre no puede tener más de 50 caracteres');
            esValido = false;
        }

        // Validar email
        if (email === '') {
            mostrarError(emailError, 'El correo electrónico es obligatorio');
            esValido = false;
        } else if (!validarEmail(email)) {
            mostrarError(emailError, 'Ingresa un correo válido (ejemplo@dominio.com)');
            esValido = false;
        }

        // Validar mensaje
        if (mensaje === '') {
            mostrarError(mensajeError, 'El mensaje no puede estar vacío');
            esValido = false;
        } else if (mensaje.length < 10) {
            mostrarError(mensajeError, 'El mensaje debe tener al menos 10 caracteres');
            esValido = false;
        } else if (mensaje.length > 500) {
            mostrarError(mensajeError, 'El mensaje no puede tener más de 500 caracteres');
            esValido = false;
        }


        // SI ES VÁLIDO, ENVIAMOS
        if (esValido) {

            // Deshabilitamos el botón para evitar doble envío
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            // Preparamos los datos para enviar
            const datos = {
                nombre: nombre,
                email: email,
                mensaje: mensaje
            };

            // CONFIGURACIÓN DE ENVÍO

            const urlDestino = 'https://formspree.io/f/xwvjdjey';


            // SOLICITUD HTTP POST usando Fetch
            fetch(urlDestino, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error en el envío. Código: ' + response.status);
                }
            })
            .then(data => {

                // Si está correcto mostramos confirmación
                // Y ocultamos el formulario

                form.style.display = 'none';
                
                // Mostramos la respuesta de confirmación
                respuestaDiv.style.display = 'block';
                
                // Mostramos los datos enviados
                datosEnviadosDiv.innerHTML = `
                    <p><strong>Nombre:</strong> ${nombre}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Mensaje:</strong> ${mensaje}</p>
                `;
                
                // Scrolleamos hacia la respuesta para que sea visible
                respuestaDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            })
            .catch(error => {

                // ERROR: Mostramos mensaje de error
                console.error('Error detallado:', error);
                alert('Hubo un problema al enviar el mensaje. Por favor, intenta de nuevo más tarde.');
                
                // Reactivamos el botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
            });

        } else {

            // SI HAY ERRORES: scroll al primer error
            const primerError = document.querySelector('.error-message[style*="display: block"]');
            if (primerError) {
                primerError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const input = primerError.parentElement.querySelector('input, textarea');
                if (input) {
                    input.focus();
                }
            }
        }
    });
});
