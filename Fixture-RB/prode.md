Aquí tenés el documento completo y estructurado, ideal para copiar y mandar por WhatsApp, Discord o email al resto del equipo de la Lista 110.

---

## 🏆 Propuesta de Proyecto: Prode Mundialista Estudiantil - Lista 110 (U.N.Lu.)

**Objetivo:** Desarrollar una plataforma web interactiva (Prode) para que los estudiantes de la U.N.Lu. participen durante el Mundial. La idea es generar comunidad, fidelizar a los estudiantes con la agrupación y ofrecer una herramienta tecnológica moderna, rápida y divertida.

### ⚙️ ¿Cómo funciona el Sistema de Puntos?

El motor del juego es simple y premia la precisión:

* **+6 Puntos (Pleno):** Si el estudiante acierta el resultado exacto del partido (ej: predice 2-1 y termina 2-1).
* **+3 Puntos (Tendencia):** Si acierta el ganador o el empate, pero no los goles exactos (ej: predice 2-0 y termina 1-0).
* **0 Puntos:** Si no acierta ni el resultado ni la tendencia.

### 🎨 Identidad Visual y Experiencia de Usuario (UX/UI)

El diseño está pensado para sentirse como una app nativa en el celular (PWA), sin necesidad de descargar nada de la Play Store.

* **Estética "Tech" y Modo Oscuro:** Interfaz con fondo gris oscuro profundo para que el **naranja característico de la Lista 110** resalte de forma vibrante en botones y alertas.
* **Branding Institucional:** El logo de la lista, la tipografía "U.N.Lu." y las flechas de navegación integradas directamente en la cabecera de la app.
* **Mascota Oficial:** Podemos integrar a la ardilla de e-sports U.N.Lu. como parte de la interfaz (por ejemplo, celebrando cuando un usuario mete un pleno de +6 puntos o como avatar predeterminado).

### 🚀 Stack Tecnológico y Arquitectura

El sistema no va a requerir carga manual de resultados, todo será automático para que el equipo no tenga que trabajar durante los partidos.

* **Frontend:** React con Next.js y Tailwind CSS. Rápido, responsive y optimizado para celulares.
* **Base de Datos y Login:** Supabase / PostgreSQL. Permite registro rápido con la cuenta de Google (sin contraseñas nuevas, cero fricción).
* **Automatización (El diferencial):** Un Cron Job en el servidor va a consultar una API deportiva gratuita (como API-Football) cada 15 minutos durante los partidos. Apenas termina un encuentro, el sistema actualiza los resultados oficiales y un *trigger* en la base de datos recalcula el ranking de todos los estudiantes al instante.
* **Hosting:** Vercel (gratuito y de alto rendimiento).

### 🕹️ Gamificación y Retención (Para que no abandonen a la segunda fecha)

* **Leaderboard (Ranking):** Pantalla principal hiperactiva mostrando el Top de Estudiantes y la posición actual del usuario.
* **Ligas Privadas:** Opción de crear códigos para que grupos de amigos o cursadas compitan internamente en sus propios mini-rankings, además de la tabla general de la 110.
* **Insignias de Perfil:** Logros automáticos (ej. "Racha ganadora", "El Rey del Empate").
* **Bloqueo Anti-Trampa:** El sistema congela la edición de predicciones exactamente hasta el minuto antes de que arranque cada partido.

**Próximos pasos para arrancar:**

1. Definir si va a haber algún premio simbólico (merchandising de la 110, apuntes, etc.) para el Top 3.
2. Levantar el repositorio y estructurar la base de datos base de usuarios y fixture.