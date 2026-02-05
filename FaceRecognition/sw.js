/**
 * SERVICE WORKER FINAL CORREGIDO
 * =============================
 * CORECCIÓN: No cachear el propio sw.js
 */

const CACHE_NAME = 'facial-login-v2.0.2';
const STATIC_CACHE = 'facial-login-static-v2.0.2';

/**
 * ARCHIVOS A CACHEAR - SIN EL PROPIO SW.JS
 */
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js', 
  '/manifest.json'
  // ❌ NO incluir '/sw.js' aquí - causa errores
];

/**
 * ARCHIVOS OPCIONALES
 */
const OPTIONAL_ASSETS = [
  '/offline.html',
  '/browserconfig.xml',
  '/favicon.ico'
];

// =================================================================
// INSTALACIÓN CORREGIDA
// =================================================================

self.addEventListener('install', (event) => {
  console.log('🔧 SW: Instalando versión', CACHE_NAME);
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE);
        console.log('📦 SW: Cache abierto');
        
        // Cachear archivos críticos UNO POR UNO
        for (const asset of STATIC_ASSETS) {
          try {
            console.log(`⏳ Cacheando: ${asset}`);
            const response = await fetch(asset, { 
              cache: 'no-cache',
              credentials: 'same-origin'
            });
            
            if (response.ok) {
              await cache.put(asset, response.clone());
              console.log(`✅ Cacheado: ${asset}`);
            } else {
              console.warn(`❌ Error ${response.status} para: ${asset}`);
            }
          } catch (error) {
            console.error(`❌ Error cacheando ${asset}:`, error.message);
            
            // Para archivos críticos, intentar fallback
            if (asset === '/' || asset === '/index.html') {
              try {
                const fallbackResponse = await fetch(asset, { cache: 'reload' });
                if (fallbackResponse.ok) {
                  await cache.put(asset, fallbackResponse);
                  console.log(`✅ Fallback exitoso para: ${asset}`);
                }
              } catch (fallbackError) {
                console.error(`❌ Fallback falló para ${asset}:`, fallbackError.message);
              }
            }
          }
        }
        
        // Intentar archivos opcionales
        for (const asset of OPTIONAL_ASSETS) {
          try {
            const response = await fetch(asset, { cache: 'no-cache' });
            if (response.ok) {
              await cache.put(asset, response);
              console.log(`✅ Opcional cacheado: ${asset}`);
            }
          } catch (error) {
            console.log(`ℹ️ Opcional no disponible: ${asset}`);
          }
        }
        
        console.log('✅ SW: Instalación completada exitosamente');
        await self.skipWaiting();
        
      } catch (error) {
        console.error('❌ Error crítico en instalación:', error);
        await self.skipWaiting();
      }
    })()
  );
});

// =================================================================
// ACTIVACIÓN
// =================================================================

self.addEventListener('activate', (event) => {
  console.log('🚀 SW: Activando...');
  
  event.waitUntil(
    (async () => {
      try {
        // Limpiar caches antiguos
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                (cacheName.startsWith('facial-login-') || cacheName.includes('facial'))) {
              console.log('🗑️ Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
        
        await self.clients.claim();
        console.log('✅ SW: Activado y controlando páginas');
        
        // Notificar clientes
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            cacheName: STATIC_CACHE,
            version: CACHE_NAME,
            timestamp: Date.now()
          });
        });
        
      } catch (error) {
        console.error('❌ Error en activación:', error);
      }
    })()
  );
});

// =================================================================
// INTERCEPCIÓN DE REQUESTS
// =================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Solo GET requests del mismo origen
  if (request.method !== 'GET' || 
      !request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Ignorar DevTools y extensiones
  if (request.url.includes('chrome-extension') || 
      request.url.includes('moz-extension') ||
      request.url.includes('webkit-devtools')) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Para navegación
    if (request.mode === 'navigate') {
      console.log('🔄 Navegación a:', url.pathname);
      
      try {
        const networkResponse = await Promise.race([
          fetch(request),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network timeout')), 5000)
          )
        ]);
        
        if (networkResponse.ok) {
          console.log('✅ Respuesta de red');
          return networkResponse;
        }
      } catch (error) {
        console.log('🔄 Red no disponible, usando cache');
      }
      
      // Fallback a cache
      const cachedResponse = await caches.match('/index.html');
      if (cachedResponse) {
        console.log('✅ Sirviendo desde cache');
        return cachedResponse;
      }
      
      return createOfflinePage();
    }
    
    // Para otros recursos: cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Red como fallback
    const networkResponse = await fetch(request);
    
    // Cachear si es exitoso (EXCEPTO sw.js)
    if (networkResponse.ok && 
        networkResponse.status === 200 && 
        !url.pathname.endsWith('sw.js')) {  // ← No cachear sw.js
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone()).catch(error => {
        console.warn('⚠️ Error cacheando:', error.message);
      });
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('❌ Error en request:', error);
    
    if (request.mode === 'navigate') {
      return createOfflinePage();
    }
    
    return new Response('Recurso no disponible', {
      status: 503,
      statusText: 'Service Worker Error'
    });
  }
}

function createOfflinePage() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Facial - Offline</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          backdrop-filter: blur(10px);
          max-width: 400px;
        }
        h1 { margin-bottom: 20px; }
        button {
          background: white;
          color: #667eea;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Login Facial</h1>
        <p>Sin conexión a internet</p>
        <button onclick="window.location.reload()">🔄 Reintentar</button>
      </div>
    </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// =================================================================
// MENSAJES
// =================================================================

self.addEventListener('message', (event) => {
  const { type } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_STATUS':
      event.ports[0].postMessage({
        version: CACHE_NAME,
        active: true
      });
      break;
  }
});

// =================================================================
// ERRORES
// =================================================================

self.addEventListener('error', (event) => {
  console.error('❌ SW Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ SW Promise rejected:', event.reason);
  event.preventDefault();
});

console.log('🚀 Service Worker iniciado -', CACHE_NAME);