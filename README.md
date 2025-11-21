# Sistema de Pantallas Display - Firestore

Sistema de 3 pantallas HTML para mostrar imágenes desde Firestore en modo rotatorio.

## 📁 Archivos creados

- `pantalla1.html` - Pantalla 1
- `pantalla2.html` - Pantalla 2
- `pantalla3.html` - Pantalla 3
- `pantalla-manager.js` - Lógica de rotación de imágenes
- `firebase-config.js` - Configuración de Firebase
- `styles.css` - Estilos para pantalla completa

## 🚀 Cómo funciona

### Lógica de Rotación

El sistema lee las imágenes de Firestore (`/datosPantallasBank`) ordenadas por `fecha_creacion` y las muestra en las 3 pantallas con un **delay escalonado**:

- **Pantalla 1**: Inicia inmediatamente (0 segundos)
- **Pantalla 2**: Inicia después de 5 segundos
- **Pantalla 3**: Inicia después de 10 segundos

Cada pantalla cambia de imagen cada **5 segundos**.

### Ejemplo de secuencia

Si tienes imagen1, imagen2, imagen3:

```
Tiempo  | Pantalla 1 | Pantalla 2 | Pantalla 3
--------|------------|------------|------------
0s      | imagen1    | -          | -
5s      | imagen2    | imagen1    | -
10s     | imagen3    | imagen2    | imagen1
15s     | imagen1    | imagen3    | imagen2
20s     | imagen2    | imagen1    | imagen3
25s     | imagen3    | imagen2    | imagen1
```

### Actualización en tiempo real

El sistema usa `onSnapshot` de Firestore, por lo que:

- ✅ Se actualizan automáticamente cuando agregas nuevas imágenes
- ✅ No necesitas modificar tu endpoint
- ✅ Las pantallas se reinician cuando detectan cambios en la DB

## 📝 Uso

### Abrir las pantallas

Abre cada archivo HTML en navegadores/ventanas separadas:

1. Abre `pantalla1.html` en la primera pantalla
2. Abre `pantalla2.html` en la segunda pantalla
3. Abre `pantalla3.html` en la tercera pantalla

### Servidor local (recomendado)

Debido a que usa módulos ES6, necesitas un servidor local:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: Node.js (npx)
npx http-server -p 8000

# Opción 3: Live Server (VS Code Extension)
# Click derecho > Open with Live Server
```

Luego abre:

- http://localhost:8000/pantalla1.html
- http://localhost:8000/pantalla2.html
- http://localhost:8000/pantalla3.html

## ⚙️ Configuración

### Cambiar tiempo de rotación

En `pantalla-manager.js`, busca esta línea y modifica el valor (en milisegundos):

```javascript
setInterval(() => {
  this.nextImage();
}, 5000); // <-- Cambiar aquí (5000 = 5 segundos)
```

### Mostrar información de la imagen

En `styles.css`, cambia esta línea:

```css
#image-info {
  display: none; /* Cambiar a 'block' para mostrar */
}
```

### Ocultar indicadores de pantalla

En `styles.css`, agrega:

```css
.pantalla-indicator {
  display: none;
}
```

## 🔧 Personalización

### Cambiar orden de imágenes

Por defecto se ordenan por `fecha_creacion` ascendente. Para cambiar:

```javascript
// En pantalla-manager.js, línea 17
const q = query(collection(db, "datosPantallasBank"),
  orderBy("fecha_creacion", "desc")); // desc = más recientes primero
```

### Filtrar por ciudad

```javascript
import { where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const q = query(collection(db, "datosPantallasBank"),
  where("ciudad", "==", "Alboris"),
  orderBy("fecha_creacion", "asc"));
```

## 📊 Estructura esperada en Firestore

```javascript
{
  ciudad: "Alboris",
  fecha: "Nov 20, 2025-11 19:20",
  fecha_creacion: Timestamp,
  frase: "test ultimo porfavor!",
  img_url: "https://...",
  nombre: "test661"
}
```

## ✅ No necesitas modificar tu endpoint

El sistema lee directamente de Firestore en tiempo real. Solo asegúrate de que tu endpoint siga guardando los datos en `/datosPantallasBank` con la estructura actual.

## 🐛 Solución de problemas

### Las imágenes no se cargan

- Verifica la consola del navegador (F12)
- Asegúrate de estar usando un servidor local
- Verifica que los datos en Firestore tengan el campo `img_url`

### CORS errors

- Usa un servidor local en lugar de abrir archivos directamente
- Verifica la configuración de Firebase Storage CORS

### Las pantallas no se sincronizan

- Es normal un pequeño desfase inicial
- Refresca las pantallas para resincronizar
