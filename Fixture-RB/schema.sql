-- Esquema de Base de Datos para Supabase / PostgreSQL
-- Proyecto: Prode Executive - Remises Bruno
-- NOTA: Todas las tablas llevan el prefijo "fixture_" para facilitar su eliminación masiva post-mundial.

-- Habilitar extensión uuid-ossp si es necesario
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE USUARIOS (PASAJEROS / CLIENTES)
CREATE TABLE IF NOT EXISTS public.fixture_usuarios (
    dni VARCHAR(20) PRIMARY KEY, -- DNI es único y actúa como identificador principal
    nombre_apellido VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255),
    puntos INTEGER DEFAULT 0,
    plenos INTEGER DEFAULT 0,
    tendencias INTEGER DEFAULT 0,
    rol VARCHAR(50) DEFAULT 'USER', -- 'USER' o 'ADMIN'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar seguridad de nivel de fila (RLS)
ALTER TABLE public.fixture_usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Usuarios
CREATE POLICY "Permitir lectura pública de usuarios" 
ON public.fixture_usuarios FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserción pública para registro" 
ON public.fixture_usuarios FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir actualizaciones a los propios usuarios" 
ON public.fixture_usuarios FOR UPDATE 
USING (true);

-- 2. TABLA DE PREDICCIONES
CREATE TABLE IF NOT EXISTS public.fixture_predicciones (
    usuario_dni VARCHAR(20) REFERENCES public.fixture_usuarios(dni) ON DELETE CASCADE,
    match_id VARCHAR(100) NOT NULL,
    goles_local INTEGER,
    goles_visitante INTEGER,
    puntos_ganados INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (usuario_dni, match_id)
);

ALTER TABLE public.fixture_predicciones ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Predicciones
CREATE POLICY "Permitir lectura pública de predicciones" 
ON public.fixture_predicciones FOR SELECT 
USING (true);

CREATE POLICY "Permitir insertar/modificar predicciones" 
ON public.fixture_predicciones FOR ALL 
USING (true);

-- 3. TABLA DE RESULTADOS OFICIALES
CREATE TABLE IF NOT EXISTS public.fixture_resultados_oficiales (
    match_id VARCHAR(100) PRIMARY KEY,
    goles_local INTEGER NOT NULL,
    goles_visitante INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fixture_resultados_oficiales ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Resultados Oficiales
CREATE POLICY "Permitir lectura pública de resultados" 
ON public.fixture_resultados_oficiales FOR SELECT 
USING (true);

CREATE POLICY "Permitir todo a administradores" 
ON public.fixture_resultados_oficiales FOR ALL 
USING (true);

-- 4. TABLA DE LOGS DE ACTIVIDAD (AUDITORÍA)
CREATE TABLE IF NOT EXISTS public.fixture_logs_actividad (
    id SERIAL PRIMARY KEY,
    usuario_dni VARCHAR(20),
    usuario_nombre VARCHAR(255),
    accion VARCHAR(100) NOT NULL,
    detalles TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fixture_logs_actividad ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de logs" 
ON public.fixture_logs_actividad FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserción de logs" 
ON public.fixture_logs_actividad FOR INSERT 
WITH CHECK (true);

-- CREAR ADMINISTRADOR POR DEFECTO (EJEMPLO)
-- DNI: 99999999, Clave/DNI: 99999999, Rol: ADMIN
INSERT INTO public.fixture_usuarios (dni, nombre_apellido, telefono, email, rol)
VALUES ('99999999', 'Administrador Bruno Remises', '1122334455', 'admin@remisesbruno.com', 'ADMIN')
ON CONFLICT (dni) DO NOTHING;
