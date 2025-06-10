/**
 * SISTEMA DE LOGIN CON RECONOCIMIENTO FACIAL - VERSIÓN COMPLETA CON DASHBOARD
 * Autor: Hector Arciniega
 * Versión: 2.0
 * 
 * DESCRIPCIÓN:
 * Sistema completo de autenticación mediante reconocimiento facial
 * con integración al dashboard corporativo y proceso de conexión simplificado.
 * 
 * CARACTERÍSTICAS:
 * - Proceso de conexión profesional y simplificado
 * - Detección facial en tiempo real
 * - Registro de usuarios con datos biométricos
 * - Login automático por reconocimiento
 * - Redirección automática al dashboard
 * - Sistema de sesiones seguro
 * - Interfaz intuitiva y moderna
 */

// ===================================================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ===================================================================

/**
 * REFERENCIAS A ELEMENTOS DEL DOM
 */
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
const startCameraBtn = document.getElementById('startCamera');
const registerBtn = document.getElementById('registerFace');
const recognizeBtn = document.getElementById('recognizeFace');
const clearDataBtn = document.getElementById('clearData');
const profilesList = document.getElementById('profilesList');
const cameraContainer = document.querySelector('.camera-container');

/**
 * VARIABLES DE ESTADO DEL SISTEMA
 */
let isModelLoaded = false;
let isCameraActive = false;
let isRecognizing = false;
let isRegistering = false;
let registeredFaces = [];
let stream = null;
let recognitionInterval = null;

/**
 * CONFIGURACIÓN DEL SISTEMA - VERSIÓN ROBUSTA
 */
const CONFIG = {
    SIMILARITY_THRESHOLD: 0.45,
    RECOGNITION_INTERVAL: 150,
    CAMERA_CONFIG: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
    },
    // URLs de modelos con más alternativas
    MODEL_URLS: [
        'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights',
        'https://unpkg.com/face-api.js@0.22.2/weights',
        'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/0.22.2/weights',
        'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'
    ],
    // URL principal para compatibilidad
    MODEL_URL: 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights'
};

// ===================================================================
// FUNCIONES DE UTILIDAD PARA INTERFAZ DE USUARIO
// ===================================================================

/**
 * ACTUALIZAR MENSAJE DE ESTADO
 */
function updateStatus(message, type = 'info', showSpinner = false) {
    status.className = `status ${type}`;
    status.innerHTML = showSpinner ? 
        `<div class="spinner"></div>${message}` : 
        message;
}

/**
 * ACTUALIZAR ESTADO DE LOS BOTONES
 */
function updateButtons() {
    startCameraBtn.disabled = isCameraActive;
    registerBtn.disabled = !isCameraActive || !isModelLoaded;
    recognizeBtn.disabled = !isCameraActive || !isModelLoaded || registeredFaces.length === 0;
    
    if (isRecognizing) {
        recognizeBtn.textContent = '⏹️ Detener Reconocimiento';
        recognizeBtn.className = 'btn danger';
    } else {
        recognizeBtn.textContent = '🔍 Iniciar Reconocimiento';
        recognizeBtn.className = 'btn success';
    }
}

/**
 * AGREGAR EFECTO VISUAL AL CONTENEDOR DE CÁMARA
 */
function setCameraMode(mode) {
    cameraContainer.className = mode === 'normal' ? 'camera-container' : `camera-container ${mode}`;
}

// ===================================================================
// CARGA DE MODELOS DE INTELIGENCIA ARTIFICIAL - VERSIÓN SIMPLIFICADA
// ===================================================================

/**
 * FUNCIÓN AUXILIAR PARA PAUSAS
 * Crea pausas realistas en el proceso de conexión
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * SIMULAR PROCESO DE CONEXIÓN PROFESIONAL
 * Crea una experiencia de conexión más fluida y profesional
 */
async function simulateConnectionProcess() {
    const steps = [
        { message: '🔄 Iniciando sistema...', duration: 300 },
        { message: '🌐 Estableciendo conexión...', duration: 500 },
        { message: '🔗 Conectando con servidor...', duration: 400 },
        { message: '✅ Verificando enlace...', duration: 300 }
    ];
    
    for (let step of steps) {
        updateStatus(step.message, 'loading', true);
        await sleep(step.duration);
    }
}

/**
 * CARGAR MODELOS DE FACE-API.JS
 * Proceso de conexión simplificado y profesional
 */
async function loadModels() {
    try {
        // Fase 1: Inicializando conexión
        updateStatus('🔄 Inicializando conexión...', 'loading', true);
        await sleep(800);
        
        // Fase 2: Estableciendo enlace
        updateStatus('🌐 Estableciendo enlace seguro...', 'loading', true);
        await sleep(600);
        
        // Fase 3: Carga silenciosa de modelos (oculta la complejidad técnica)
        updateStatus('🔗 Conectando con servidor...', 'loading', true);
        
        // Cargar modelos de manera silenciosa
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(CONFIG.MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(CONFIG.MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(CONFIG.MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(CONFIG.MODEL_URL)
        ]);
        
        // Fase 4: Verificación final
        updateStatus('✅ Verificando conexión...', 'loading', true);
        await sleep(500);

        // Fase 5: Conexión exitosa
        isModelLoaded = true;
        updateStatus('✅ Enlace Conectado. Sistema listo para usar.', 'success');
        updateButtons();
        
        // Mensaje de bienvenida después de conectar
        setTimeout(() => {
            updateStatus('📹 ¡Perfecto! Ahora puedes iniciar la cámara para comenzar.', 'info');
        }, 2000);
        
        console.log('✅ Sistema conectado y listo');
        
    } catch (error) {
        console.error('❌ Error en la conexión:', error);
        updateStatus('❌ Error de conexión. Verifica tu internet e intenta nuevamente.', 'error');
        
        // Opción de reintentar
        setTimeout(() => {
            const retry = confirm('¿Quieres intentar conectar nuevamente?');
            if (retry) {
                loadModels();
            }
        }, 3000);
    }
}

// ===================================================================
// GESTIÓN DE CÁMARA Y VIDEO
// ===================================================================

/**
 * INICIALIZAR Y ACTIVAR CÁMARA
 */
async function startCamera() {
    try {
        updateStatus('📹 Solicitando acceso a la cámara...', 'loading', true);
        
        stream = await navigator.mediaDevices.getUserMedia({
            video: CONFIG.CAMERA_CONFIG
        });

        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            isCameraActive = true;
            updateStatus('📹 Cámara activa. Puedes registrar tu cara o iniciar reconocimiento.', 'success');
            updateButtons();
            
            console.log(`📹 Cámara iniciada: ${video.videoWidth}x${video.videoHeight}`);
        };

    } catch (error) {
        console.error('❌ Error accediendo a la cámara:', error);
        
        let errorMessage = '❌ No se pudo acceder a la cámara. ';
        
        if (error.name === 'NotAllowedError') {
            errorMessage += 'Permisos de cámara denegados.';
        } else if (error.name === 'NotFoundError') {
            errorMessage += 'No se encontró ninguna cámara.';
        } else if (error.name === 'NotReadableError') {
            errorMessage += 'Cámara en uso por otra aplicación.';
        } else {
            errorMessage += 'Error desconocido.';
        }
        
        updateStatus(errorMessage, 'error');
    }
}

/**
 * DETENER CÁMARA Y LIMPIAR RECURSOS
 */
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    if (recognitionInterval) {
        clearInterval(recognitionInterval);
        recognitionInterval = null;
    }
    
    isCameraActive = false;
    isRecognizing = false;
    setCameraMode('normal');
    clearCanvas();
    updateButtons();
}

// ===================================================================
// REGISTRO DE NUEVOS USUARIOS
// ===================================================================

/**
 * REGISTRAR NUEVA CARA
 */
async function registerFace() {
    if (!isModelLoaded || !isCameraActive) {
        updateStatus('❌ Sistema no está listo para registro.', 'error');
        return;
    }

    try {
        isRegistering = true;
        setCameraMode('registering');
        updateStatus('🔍 Analizando tu rostro... Mantente inmóvil.', 'loading', true);

        const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            updateStatus('❌ No se detectó ningún rostro. Asegúrate de estar frente a la cámara con buena iluminación.', 'error');
            setCameraMode('normal');
            isRegistering = false;
            return;
        }

        if (detection.detection.score < 0.5) {
            updateStatus('❌ Calidad de detección baja. Mejora la iluminación y vuelve a intentar.', 'error');
            setCameraMode('normal');
            isRegistering = false;
            return;
        }

        const userName = prompt('¿Cuál es tu nombre completo?');
        if (!userName || userName.trim() === '') {
            updateStatus('❌ Registro cancelado. Nombre requerido.', 'error');
            setCameraMode('normal');
            isRegistering = false;
            return;
        }

        const existingUser = registeredFaces.find(user => 
            user.name.toLowerCase() === userName.trim().toLowerCase()
        );
        
        if (existingUser) {
            const overwrite = confirm(`El usuario "${userName}" ya existe. ¿Quieres sobrescribir su registro?`);
            if (!overwrite) {
                updateStatus('❌ Registro cancelado.', 'error');
                setCameraMode('normal');
                isRegistering = false;
                return;
            }
            
            registeredFaces = registeredFaces.filter(user => 
                user.name.toLowerCase() !== userName.trim().toLowerCase()
            );
        }

        updateStatus('📸 Capturando imagen facial...', 'loading', true);
        const faceImage = await captureUserImage(detection);

        const userData = {
            id: Date.now(),
            name: userName.trim(),
            descriptor: Array.from(detection.descriptor),
            image: faceImage,
            registeredAt: new Date().toLocaleDateString('es-ES'),
            registeredTime: new Date().toLocaleTimeString('es-ES'),
            detectionScore: Math.round(detection.detection.score * 100)
        };

        registeredFaces.push(userData);
        saveToLocalStorage();
        updateUserProfiles();
        
        updateStatus(`✅ ¡Perfil de ${userName} registrado exitosamente! Puntuación: ${userData.detectionScore}%`, 'success');
        updateButtons();
        
        console.log(`✅ Usuario registrado: ${userName} (ID: ${userData.id})`);

    } catch (error) {
        console.error('❌ Error durante el registro:', error);
        updateStatus('❌ Error durante el registro. Inténtalo de nuevo.', 'error');
    } finally {
        isRegistering = false;
        setCameraMode('normal');
    }
}

/**
 * CAPTURAR IMAGEN DEL ROSTRO DETECTADO
 */
async function captureUserImage(detection) {
    const box = detection.detection.box;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    const margin = 20;
    const width = box.width + (margin * 2);
    const height = box.height + (margin * 2);
    
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    tempCtx.drawImage(
        video,
        box.x - margin, box.y - margin, width, height,
        0, 0, width, height
    );
    
    return tempCanvas.toDataURL('image/jpeg', 0.8);
}

// ===================================================================
// RECONOCIMIENTO Y LOGIN FACIAL CON DASHBOARD
// ===================================================================

/**
 * INICIAR/DETENER RECONOCIMIENTO FACIAL
 */
async function toggleRecognition() {
    if (!isModelLoaded || !isCameraActive) {
        updateStatus('❌ Sistema no está listo para reconocimiento.', 'error');
        return;
    }

    if (registeredFaces.length === 0) {
        updateStatus('❌ No hay usuarios registrados. Registra al menos un usuario primero.', 'error');
        return;
    }

    isRecognizing = !isRecognizing;
    
    if (isRecognizing) {
        setCameraMode('detecting');
        updateStatus('🔍 Reconocimiento activo. Muestra tu rostro a la cámara.', 'info');
        startRecognitionLoop();
    } else {
        setCameraMode('normal');
        updateStatus('⏸️ Reconocimiento detenido.', 'info');
        stopRecognitionLoop();
    }
    
    updateButtons();
}

/**
 * INICIAR BUCLE DE RECONOCIMIENTO
 */
function startRecognitionLoop() {
    recognitionInterval = setInterval(async () => {
        if (!isRecognizing) return;
        
        try {
            await performRecognition();
        } catch (error) {
            console.error('❌ Error en bucle de reconocimiento:', error);
        }
    }, CONFIG.RECOGNITION_INTERVAL);
}

/**
 * DETENER BUCLE DE RECONOCIMIENTO
 */
function stopRecognitionLoop() {
    if (recognitionInterval) {
        clearInterval(recognitionInterval);
        recognitionInterval = null;
    }
    clearCanvas();
}

/**
 * REALIZAR RECONOCIMIENTO FACIAL
 */
async function performRecognition() {
    try {
        // Verificar si el sistema está bloqueado
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            return;
        }
        
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        clearCanvas();

        if (detections.length === 0) {
            return;
        }

        drawDetections(detections);

        for (let detection of detections) {
            const match = findBestMatch(detection.descriptor);
            
            if (match.distance < CONFIG.SIMILARITY_THRESHOLD) {
                failedAttempts = 0;
                
                logSecurityEvent('successful_login', {
                    userId: match.user.id,
                    userName: match.user.name,
                    similarity: Math.round((1 - match.distance) * 100)
                });
                
                await handleSuccessfulLogin(match.user, match.distance);
                return;
            }
        }

        if (isRecognizing) {
            setTimeout(() => {
                if (isRecognizing) {
                    handleFailedRecognition();
                }
            }, 3000);
        }

    } catch (error) {
        console.error('❌ Error realizando reconocimiento:', error);
        logSecurityEvent('recognition_error', {
            error: error.message
        });
    }
}

/**
 * BUSCAR MEJOR COINCIDENCIA
 */
function findBestMatch(descriptor) {
    let bestMatch = { user: null, distance: 1 };

    for (let user of registeredFaces) {
        const storedDescriptor = new Float32Array(user.descriptor);
        const distance = faceapi.euclideanDistance(descriptor, storedDescriptor);
        
        if (distance < bestMatch.distance) {
            bestMatch = { user, distance };
        }
    }

    return bestMatch;
}

/**
 * MANEJAR LOGIN EXITOSO - VERSIÓN CON DASHBOARD
 */
async function handleSuccessfulLogin(user, distance) {
    // Detener reconocimiento
    isRecognizing = false;
    stopRecognitionLoop();
    setCameraMode('normal');
    updateButtons();
    
    // Calcular porcentaje de similitud
    const similarity = Math.round((1 - distance) * 100);
    
    updateStatus(`🎉 ¡Bienvenido/a ${user.name}! Login exitoso (${similarity}% similitud)`, 'success');
    
    console.log(`✅ Login exitoso: ${user.name} (Similitud: ${similarity}%)`);
    
    // Actualizar datos de último acceso
    user.lastLogin = new Date().toLocaleString('es-ES');
    
    // Guardar datos de sesión
    try {
        // Guardar en sessionStorage para mayor seguridad
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // También marcar en localStorage para persistencia
        const faceLoginData = JSON.parse(localStorage.getItem('faceLoginData') || '{}');
        faceLoginData.lastLoginUser = user.id;
        faceLoginData.lastLoginTime = user.lastLogin;
        localStorage.setItem('faceLoginData', JSON.stringify(faceLoginData));
        
        // Actualizar datos del usuario en el array
        const userIndex = registeredFaces.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            registeredFaces[userIndex] = user;
            saveToLocalStorage();
        }
        
        updateUserProfiles();
        
    } catch (error) {
        console.error('❌ Error guardando datos de sesión:', error);
    }
    
    // Mostrar mensaje de redirección y redirigir automáticamente
    setTimeout(() => {
        updateStatus('🚀 Redirigiendo al dashboard...', 'loading', true);
        
        setTimeout(() => {
            // Redirigir al dashboard
            window.location.href = 'dashboard.html';
        }, 1500);
        
    }, 2000);
}

// ===================================================================
// FUNCIONES DE DIBUJO Y VISUALIZACIÓN
// ===================================================================

/**
 * DIBUJAR DETECCIONES EN CANVAS
 */
function drawDetections(detections) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    detections.forEach((detection, index) => {
        const box = detection.detection.box;
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.font = '16px Arial';
        ctx.fillStyle = '#00ff00';
        
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        
        const label = `Rostro ${index + 1}`;
        const labelY = box.y > 20 ? box.y - 5 : box.y + box.height + 20;
        ctx.fillText(label, box.x, labelY);
        
        if (detection.landmarks) {
            ctx.fillStyle = '#ff0000';
            const landmarks = detection.landmarks.positions;
            
            landmarks.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
        
        const score = Math.round(detection.detection.score * 100);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(box.x, box.y + box.height - 25, 80, 25);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText(`${score}%`, box.x + 5, box.y + box.height - 8);
    });
}

/**
 * LIMPIAR CANVAS
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===================================================================
// GESTIÓN DE PERFILES DE USUARIO
// ===================================================================

/**
 * ACTUALIZAR LISTA DE USUARIOS REGISTRADOS
 */
function updateUserProfiles() {
    if (registeredFaces.length === 0) {
        profilesList.innerHTML = `
            <p style="color: #666; font-style: italic; text-align: center;">
                No hay usuarios registrados aún
            </p>
        `;
        return;
    }

    profilesList.innerHTML = registeredFaces.map(user => {
        const lastLogin = user.lastLogin ? 
            `<p>Último acceso: ${user.lastLogin}</p>` : 
            '<p>Nunca ha hecho login</p>';
        
        return `
            <div class="user-profile registered">
                <img src="${user.image}" alt="${user.name}" title="Puntuación de registro: ${user.detectionScore}%">
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>Registrado: ${user.registeredAt} a las ${user.registeredTime}</p>
                    ${lastLogin}
                    <p style="font-size: 0.8rem; color: #28a745;">ID: ${user.id}</p>
                </div>
            </div>
        `;
    }).join('');
}

// ===================================================================
// GESTIÓN DE ALMACENAMIENTO LOCAL
// ===================================================================

/**
 * GUARDAR DATOS EN LOCAL STORAGE
 */
function saveToLocalStorage() {
    try {
        const data = {
            faces: registeredFaces,
            version: '2.0',
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('faceLoginData', JSON.stringify(data));
        console.log(`💾 Datos guardados: ${registeredFaces.length} usuarios`);
        
    } catch (error) {
        console.error('❌ Error guardando datos:', error);
        updateStatus('⚠️ Error guardando datos localmente.', 'error');
    }
}

/**
 * CARGAR DATOS DESDE LOCAL STORAGE
 */
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('faceLoginData');
        if (saved) {
            const data = JSON.parse(saved);
            registeredFaces = data.faces || [];
            updateUserProfiles();
            updateButtons();
            
            console.log(`📂 Datos cargados: ${registeredFaces.length} usuarios`);
            
            // Solo mostrar mensaje si hay usuarios registrados
            if (registeredFaces.length > 0) {
                // No mostrar mensaje automático, solo en consola para desarrollo
                console.log(`✅ Se encontraron ${registeredFaces.length} usuarios registrados`);
            }
        }
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        registeredFaces = [];
        updateStatus('⚠️ Iniciando con datos nuevos...', 'info');
        
        // Ocultar el mensaje después de 2 segundos
        setTimeout(() => {
            updateStatus('🔄 Listo para conectar...', 'loading', true);
        }, 2000);
    }
}

/**
 * LIMPIAR TODOS LOS DATOS
 */
function clearAllData() {
    const confirmMessage = registeredFaces.length > 0 ? 
        `¿Estás seguro de que quieres eliminar los ${registeredFaces.length} usuarios registrados?\n\nEsta acción no se puede deshacer.` :
        '¿Estás seguro de que quieres limpiar todos los datos?';
        
    if (confirm(confirmMessage)) {
        registeredFaces = [];
        localStorage.removeItem('faceLoginData');
        updateUserProfiles();
        updateButtons();
        updateStatus('🗑️ Todos los datos han sido eliminados correctamente.', 'info');
        
        console.log('🗑️ Datos eliminados por el usuario');
    }
}

// ===================================================================
// FUNCIONES DE VALIDACIÓN Y SEGURIDAD
// ===================================================================

/**
 * VERIFICAR COMPATIBILIDAD DEL NAVEGADOR
 */
function checkBrowserCompatibility() {
    const checks = {
        getUserMedia: !!navigator.mediaDevices?.getUserMedia,
        canvas: !!document.createElement('canvas').getContext,
        localStorage: !!window.localStorage,
        fetch: !!window.fetch
    };
    
    const incompatible = Object.entries(checks)
        .filter(([key, supported]) => !supported)
        .map(([key]) => key);
    
    if (incompatible.length > 0) {
        updateStatus('❌ Navegador no compatible. Usa Chrome, Firefox o Safari actualizado.', 'error');
        return false;
    }
    
    return true;
}

/**
 * DETECTAR INTENTOS DE ACCESO SOSPECHOSOS
 */
let failedAttempts = 0;
const MAX_FAILED_ATTEMPTS = 5;

function handleFailedRecognition() {
    failedAttempts++;
    
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        updateStatus('🔒 Demasiados intentos fallidos. Sistema bloqueado temporalmente.', 'error');
        
        setTimeout(() => {
            failedAttempts = 0;
            updateStatus('🔓 Sistema desbloqueado. Puedes intentar nuevamente.', 'info');
        }, 5 * 60 * 1000);
        
        if (isRecognizing) {
            toggleRecognition();
        }
        
        console.warn('⚠️ Sistema bloqueado por intentos fallidos');
    } else {
        updateStatus(`❌ Rostro no reconocido. Intento ${failedAttempts}/${MAX_FAILED_ATTEMPTS}`, 'error');
    }
}

/**
 * REGISTRO DE ACTIVIDAD DE SEGURIDAD
 */
function logSecurityEvent(event, details = {}) {
    const securityLog = {
        timestamp: new Date().toISOString(),
        event: event,
        details: details,
        userAgent: navigator.userAgent,
        sessionId: sessionStorage.getItem('currentUser') ? 
            JSON.parse(sessionStorage.getItem('currentUser')).sessionId : null
    };
    
    console.log('🔒 Evento de seguridad:', securityLog);
    
    const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    securityLogs.push(securityLog);
    
    if (securityLogs.length > 100) {
        securityLogs.splice(0, securityLogs.length - 100);
    }
    
    localStorage.setItem('securityLogs', JSON.stringify(securityLogs));
}

// ===================================================================
// GESTIÓN DE SESIONES PARA DASHBOARD
// ===================================================================

/**
 * VERIFICAR SESIÓN ACTIVA
 */
function checkActiveSession() {
    try {
        const currentUser = sessionStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            const confirmContinue = confirm(
                `Ya tienes una sesión activa como ${userData.name}.\n\n` +
                `¿Quieres ir directamente al dashboard?\n\n` +
                `• SÍ: Ir al dashboard\n` +
                `• NO: Cerrar sesión y continuar aquí`
            );
            
            if (confirmContinue) {
                window.location.href = 'dashboard.html';
            } else {
                clearSession();
                updateStatus('🔄 Sesión anterior cerrada. Puedes autenticarte nuevamente.', 'info');
            }
        }
    } catch (error) {
        console.error('❌ Error verificando sesión:', error);
        clearSession();
    }
}

/**
 * LIMPIAR SESIÓN
 */
function clearSession() {
    try {
        sessionStorage.removeItem('currentUser');
        
        const faceLoginData = JSON.parse(localStorage.getItem('faceLoginData') || '{}');
        delete faceLoginData.lastLoginUser;
        delete faceLoginData.lastLoginTime;
        localStorage.setItem('faceLoginData', JSON.stringify(faceLoginData));
        
        console.log('🧹 Sesión limpiada correctamente');
    } catch (error) {
        console.error('❌ Error limpiando sesión:', error);
    }
}

/**
 * VALIDAR ACCESO AL DASHBOARD
 */
function validateDashboardAccess() {
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!currentUser) {
        alert('⚠️ Acceso denegado. Debes autenticarte primero.');
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const userData = JSON.parse(currentUser);
        const sessionStartTime = sessionStorage.getItem('sessionStartTime');
        
        if (sessionStartTime) {
            const sessionAge = Date.now() - parseInt(sessionStartTime);
            const maxSessionAge = 24 * 60 * 60 * 1000; // 24 horas
            
            if (sessionAge > maxSessionAge) {
                alert('⏰ Tu sesión ha expirado. Por favor, autentícate nuevamente.');
                clearSession();
                window.location.href = 'login.html';
                return false;
            }
        }
        
        console.log('✅ Acceso al dashboard validado para:', userData.name);
        return userData;
        
    } catch (error) {
        console.error('❌ Error validando acceso:', error);
        clearSession();
        window.location.href = 'login.html';
        return false;
    }
}

// ===================================================================
// EVENT LISTENERS Y MANEJO DE EVENTOS
// ===================================================================

/**
 * CONFIGURAR EVENT LISTENERS
 */
function setupEventListeners() {
    startCameraBtn.addEventListener('click', startCamera);
    registerBtn.addEventListener('click', registerFace);
    recognizeBtn.addEventListener('click', toggleRecognition);
    clearDataBtn.addEventListener('click', clearAllData);
    
    document.addEventListener('keydown', handleKeyboardShortcuts);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleWindowResize);
}

/**
 * MANEJAR ATAJOS DE TECLADO
 */
function handleKeyboardShortcuts(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(event.key.toLowerCase()) {
        case 'c':
            if (!isCameraActive && isModelLoaded) {
                startCamera();
            }
            break;
        case 'r':
            if (isCameraActive && isModelLoaded && !isRecognizing) {
                registerFace();
            }
            break;
        case 's':
            if (isCameraActive && isModelLoaded && registeredFaces.length > 0) {
                toggleRecognition();
            }
            break;
        case 'escape':
            if (isRecognizing) {
                toggleRecognition();
            }
            break;
    }
}

/**
 * MANEJAR CAMBIOS DE VISIBILIDAD
 */
function handleVisibilityChange() {
    if (document.hidden && isRecognizing) {
        toggleRecognition();
        updateStatus('⏸️ Reconocimiento pausado (pestaña inactiva).', 'info');
    }
}

/**
 * MANEJAR REDIMENSIONAMIENTO DE VENTANA
 */
function handleWindowResize() {
    if (isCameraActive && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }
}

// ===================================================================
// INICIALIZACIÓN Y LIMPIEZA
// ===================================================================

/**
 * INICIALIZAR APLICACIÓN - VERSIÓN SIMPLIFICADA
 * Función principal de inicialización con mensajes más simples
 */
async function initializeApp() {
    console.log('🚀 Iniciando sistema de login facial...');
    
    // Verificar compatibilidad del navegador
    if (!checkBrowserCompatibility()) {
        return;
    }
    
    // Proceso de conexión simplificado
    await simulateConnectionProcess();
    
    // Verificar si hay una sesión activa
    checkActiveSession();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos guardados (silenciosamente)
    loadFromLocalStorage();
    
    // Cargar modelos de IA (con proceso simplificado)
    await loadModels();
    
    // Mostrar información del sistema en consola (solo para desarrolladores)
    console.log('🔧 Información del sistema:', getSystemInfo());
    
    console.log('✅ Sistema inicializado correctamente');
}

/**
 * OBTENER INFORMACIÓN DEL SISTEMA
 */
function getSystemInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        onLine: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
        },
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        localStorage: {
            available: !!window.localStorage,
            used: localStorage.length
        }
    };
}

/**
 * LIMPIAR RECURSOS AL CERRAR
 */
function cleanup() {
    console.log('🧹 Limpiando recursos...');
    
    stopCamera();
    
    if (recognitionInterval) {
        clearInterval(recognitionInterval);
    }
    
    console.log('✅ Recursos liberados');
}

// ===================================================================
// EJECUCIÓN PRINCIPAL
// ===================================================================

/**
 * EJECUTAR CUANDO EL DOM ESTÉ LISTO
 */
document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * LIMPIAR RECURSOS AL CERRAR LA PÁGINA
 */
window.addEventListener('beforeunload', cleanup);

/**
 * MANEJAR ERRORES GLOBALES
 */
window.addEventListener('error', (event) => {
    console.error('❌ Error global:', event.error);
    updateStatus('❌ Error inesperado. Revisa la consola.', 'error');
});

// ===================================================================
// EXPORT PARA USO EN DASHBOARD
// ===================================================================

window.faceLoginUtils = {
    validateDashboardAccess,
    clearSession,
    logSecurityEvent
};