# Prode Mundialista Estudiantil - Lista 110

Este documento detalla el plan para construir la plataforma web interactiva del Prode para los estudiantes de la U.N.Lu. basándonos en tu idea inicial. Por ahora, nos enfocaremos en construir la interfaz (Frontend) mockeando (simulando) los datos de partidos y usuarios.

## ❓ Open Questions

Para poder arrancar con el pie derecho, necesito que me confirmes un par de cosas:

1. **Ubicación del Proyecto:** ¿Te parece bien que inicialice el proyecto de Next.js directamente dentro de la carpeta actual `C:\Users\rizzo\Desktop\Fixture-110`? Si
2. **Mascota (Ardilla e-sports):** Mencionaste integrar a la ardilla de e-sports de la U.N.Lu. ¿Tenés la imagen de la mascota para usarla, o por ahora armo la interfaz con un *placeholder* (imagen de relleno) hasta que la consigas? No vamos a usar la ardilla ni mencionar a esports ya que es algo externo que pertene a la lista 110
3. **Color Institucional:** El color naranja del logo es clave. Voy a extraer un código hexadecimal cercano (ej. `#F38220`), pero si tenés el código de color exacto del manual de marca de la Lista 110, pasámelo. (No lo tengo, por ahora usa el mas similar)
4. **Formato de Partidos (Fixture):** Para los datos mockeados, ¿querés que simule una fase de grupos (ej. 3 partidos por grupo) o simplemente una lista de "Próximos Partidos"? La lista completa de todos los partidos de la primera ronda desde el grupo A hasta el grupo J

## 🛠️ Proposed Changes

### 1. Inicialización del Proyecto
- Crear un nuevo proyecto con **Next.js** y **Tailwind CSS**.
- Configurar la estructura base usando el *App Router* (la última versión de Next.js).
- Configurar las fuentes: Usar tipografías modernas (ej. *Inter* o *Outfit*) para una sensación "Tech".

### 2. Sistema de Diseño (Estética "Tech" y Modo Oscuro)
- **Colores:**
  - Fondo: Gris oscuro profundo (`#121212` o similar).
  - Acento: Naranja Lista 110 (extraído del logo).
  - Texto: Blanco/Gris claro para máximo contraste.
- **Header (Cabecera):**
  - Integrar el logo proporcionado (`Logo.jpg`).
  - Incluir tipografía institucional "U.N.Lu." y flechas de navegación `>>>` como parte de la identidad de la lista.

### 3. Componentes UI (Mockeados)
- **Dashboard Principal (Mis Predicciones):**
  - Lista de partidos próximos (mockeados con equipos, banderas e inputs para cargar los resultados).
  - Tarjeta de partido que muestre: Equipo Local vs Equipo Visitante, fecha, y un selector numérico para el resultado.
  - Lógica visual en el frontend que congele (deshabilite) los inputs simulando partidos que "ya empezaron".
- **Leaderboard (Ranking):**
  - Pantalla con el Top 10 de estudiantes (datos falsos por ahora, ej: "Juan Pérez - 45 pts").
  - Resaltar la posición del usuario actual.
- **Navegación:**
  - Menú inferior (estilo app nativa / PWA) para cambiar entre "Partidos", "Ranking" y "Perfil".

### 4. PWA (Progressive Web App)
- Configurar el manifiesto y meta tags básicos para que, al añadir la página al inicio del celular, se sienta como una aplicación nativa, ocultando la barra del navegador.

