# Guía de Identidad de Marca & Sistema de Diseño: Remises Bruno

Esta guía resume la dirección estética, el sistema de diseño, la paleta cromática, la tipografía y las pautas de interfaz de usuario utilizadas para la identidad **Premium & Executive** de **Remises Bruno**. Está diseñada para servir como referencia y asegurar consistencia visual en futuros desarrollos o subproyectos de la marca.

---

## 1. Concepto Estético: *Executive Dark Luxury*

La estética se basa en un enfoque minimalista y de lujo, buscando transmitir los valores centrales del servicio: **seguridad, confianza, puntualidad y exclusividad**. 

### Pilares de Diseño:
*   **Contraste Premium:** Fondos ultra oscuros (casi obsidianos) combinados con acentos de oro cepillado y cromo plateado.
*   **Profundidad con Glassmorphic:** Uso de tarjetas y contenedores con transparencias y desenfoque de fondo (`backdrop-filter: blur`) que generan un efecto de vidrio flotante moderno y tridimensional.
*   **Brillo y Micro-interacciones:** Bordes dorados muy sutiles que brillan dinámicamente con las interacciones del cursor (`hover`), acompañados de gradientes radiales suaves en el fondo para dar calidez y evitar que el fondo se sienta plano.

---

## 2. Paleta de Colores (CSS Tokens)

La paleta utiliza valores precisos en formato HEX y RGBA para crear contraste armónico sin saturar la vista.

### Colores de Fondo (Base)
| Color | Código HEX | Propósito | Variable CSS |
| :--- | :--- | :--- | :--- |
| **Negro Absoluto/Base** | `#050508` | Fondo principal de la aplicación | `--bg-primary` |
| **Obsidiana Profundo** | `#0c0d14` | Contenedores secundarios, modales u offsets | `--bg-secondary` |
| **Vidrio Translúcido** | `rgba(18, 20, 32, 0.6)` | Tarjetas y bloques (Glassmorphism) | `--bg-card` |
| **Vidrio Activo** | `rgba(26, 29, 46, 0.85)` | Estado hover de las tarjetas | `--bg-card-hover` |

### Colores de Acento (Detalles & Metales)
| Color | Código HEX | Propósito | Variable CSS |
| :--- | :--- | :--- | :--- |
| **Oro Clásico** | `#d4af37` | Acento principal, botones, enlaces destacados | `--accent-gold` |
| **Champagne (Oro Claro)** | `#f3e5ab` | Brillos superiores y partes claras de gradientes | `--accent-gold-light` |
| **Plata/Cromo** | `#a0a5b5` | Subtítulos secundarios, acentos de plata | `--accent-silver` |

### Tipografía y Bordes
| Color / Opacidad | Código HEX / RGBA | Propósito | Variable CSS |
| :--- | :--- | :--- | :--- |
| **Texto Principal** | `#ffffff` | Títulos principales y cuerpo legible | `--text-primary` |
| **Texto Secundario** | `#9aa2b1` | Descripciones secundarias y párrafos | `--text-secondary` |
| **Texto Muted** | `#646c7c` | Etiquetas de datos, derechos reservados, tags | `--text-muted` |
| **Borde Oro Pasivo** | `rgba(212, 175, 55, 0.15)` | Bordes sutiles de tarjetas | `--border-color` |
| **Borde Oro Activo** | `rgba(212, 175, 55, 0.4)` | Bordes iluminados al pasar el mouse | `--border-color-hover` |

---

## 3. Tipografía Oficial

Buscando una estética equilibrada, legible y moderna, toda la interfaz se basa en una sola familia tipográfica de altísima calidad: **Outfit (Google Fonts)**.

> [!NOTE]
> Anteriormente se utilizaba la fuente *Syne*, pero se reemplazó globalmente por *Outfit* para evitar que los textos se percibieran aplastados o distorsionados, logrando una geometría pura muy similar a marcas de alta gama (Tesla, Apple).

*   **Tipografía de Encabezados (Titles):** `Outfit`, Sans-Serif.
*   **Tipografía de Cuerpo (Body):** `Outfit`, Sans-Serif.
*   **Enlace de Importación:**
    ```html
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
    ```

### Estilos Clave para Títulos:
*   **Títulos de Portada (Hero):**
    ```css
    font-size: clamp(40px, 5vw, 68px);
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.5px;
    ```
*   **Títulos de Sección (Headers):**
    ```css
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    line-height: 1.3;
    letter-spacing: normal;
    ```

---

## 4. Gradientes y Efectos de Firma

Para darle a los proyectos ese aspecto "wow" premium sin recargar la interfaz con imágenes pesadas, se utilizan los siguientes recursos de CSS puro:

### A. Oro Gradiente (Gold Text Gradient)
Se aplica para dar realce metalizado a palabras o títulos específicos:
```css
.gold-text-gradient {
  background: linear-gradient(135deg, #f3e5ab 0%, #d4af37 50%, #aa7c11 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### B. Plata/Cromo Gradiente (Silver Text Gradient)
Se usa en textos secundarios para dar un contraste metálico sutil y equilibrado:
```css
.silver-text-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #cfd2d6 50%, #8a909d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### C. Efecto Vidrio Translúcido (Glassmorphism)
La firma visual de las tarjetas interactivas:
```css
.glass {
  background: rgba(18, 20, 32, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(212, 175, 55, 0.15);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.7);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass:hover {
  background: rgba(26, 29, 46, 0.85);
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 0 25px rgba(212, 175, 55, 0.2), 0 10px 40px -10px rgba(0, 0, 0, 0.7);
}
```

### D. Luces de Fondo (Radial Glows)
Glows ambientales animados en las esquinas inferiores/superiores de la pantalla que crean dinamismo visual suave:
```css
/* Glow Dorado en esquina */
.bg-glow-radial-1 {
  background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
  filter: blur(80px);
}

/* Glow Plateado en esquina opuesta */
.bg-glow-radial-2 {
  background: radial-gradient(circle, rgba(160, 165, 181, 0.06) 0%, transparent 70%);
  filter: blur(100px);
}
```

---

## 5. Botones y Elementos de Llamada a la Acción (CTA)

Los botones premium deben sentirse orgánicos al interactuar con ellos:

### Botón Dorado (Primario)
Con bordes completamente redondeados (`50px`), sombras de iluminación suave y un desplazamiento de `3px` hacia arriba en `hover` para dar la sensación física de que flota al apuntarlo.
```css
.btn-gold {
  background: linear-gradient(135deg, #d4af37 0%, #b28d28 100%);
  color: #050508;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 50px;
  border: none;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-gold:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5), 0 0 25px rgba(212, 175, 55, 0.2);
}
```

---

*Esta guía sienta las bases técnicas para que cualquier nuevo sistema de administración, intranet corporativa, portal de clientes o app móvil que desarrolle **rzcore** para **Remises Bruno** comparta la misma sofisticación y calidad estética.*
