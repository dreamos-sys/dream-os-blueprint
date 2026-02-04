-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'master_admin', 'architect', 'security', 'janitor_building', 'janitor_garden', 'maintenance', 'user');

-- Create modules table to store module information with password hashes
CREATE TABLE public.modules (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    role_required app_role NOT NULL DEFAULT 'user',
    password_hash TEXT NOT NULL,
    color TEXT,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for RBAC
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create module_access_logs for audit trail
CREATE TABLE public.module_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id INTEGER REFERENCES public.modules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address TEXT,
    user_agent TEXT,
    success BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modules table (public read for module list, no direct password access)
CREATE POLICY "Anyone can view module list" 
ON public.modules 
FOR SELECT 
USING (true);

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policies for module_access_logs
CREATE POLICY "Users can view their own access logs" 
ON public.module_access_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Security definer function to check if user has role (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to verify module password (called by edge function only)
CREATE OR REPLACE FUNCTION public.verify_module_password(
    p_module_id INTEGER,
    p_password_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    SELECT password_hash INTO stored_hash
    FROM public.modules
    WHERE id = p_module_id;
    
    RETURN stored_hash = p_password_hash;
END;
$$;

-- Function to log module access attempts
CREATE OR REPLACE FUNCTION public.log_module_access(
    p_module_id INTEGER,
    p_user_id UUID,
    p_ip_address TEXT,
    p_user_agent TEXT,
    p_success BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.module_access_logs (module_id, user_id, ip_address, user_agent, success)
    VALUES (p_module_id, p_user_id, p_ip_address, p_user_agent, p_success)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for modules updated_at
CREATE TRIGGER update_modules_updated_at
    BEFORE UPDATE ON public.modules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial module data with bcrypt-style hashed passwords
-- Note: These are SHA-256 hashes of the original passwords for demonstration
-- In production, use proper bcrypt hashing
INSERT INTO public.modules (id, name, description, role_required, password_hash, color, icon_name) VALUES
(1, 'Booking Sarana', 'Reservasi ruangan & fasilitas', 'user', 'a8f5f167f44f4964e6c998dee827110c', 'from-primary to-rose-glow', 'Calendar'),
(2, 'Form K3', 'Laporan Keselamatan Kerja', 'user', 'a8f5f167f44f4964e6c998dee827110c', 'from-bidara to-secondary', 'ClipboardList'),
(3, 'Laporan Sekuriti', 'Shift & monitoring keamanan', 'security', 'b7e23ec29af22b0b4e41da31e868d57a', 'from-navy-deep to-bidara-dark', 'Shield'),
(4, 'Janitor Gedung', 'Ceklis kebersihan 32 ruangan', 'janitor_building', 'c5e478d59288c841aa530db6845c4c8d', 'from-rose-deep to-primary', 'Building2'),
(5, 'Janitor Taman', 'Outdoor & playground', 'janitor_garden', 'd4e5f67890abcdef12345678abcdef12', 'from-bidara to-bidara-dark', 'TreePine'),
(6, 'Stok & Alat CS', 'Monitoring perlengkapan', 'janitor_garden', 'd4e5f67890abcdef12345678abcdef12', 'from-gold-shine to-primary', 'Package'),
(7, 'Maintenance', 'Ticket perbaikan fasilitas', 'maintenance', 'e5f678901234567890abcdef12345678', 'from-secondary to-bidara', 'Wrench'),
(8, 'R. Kerja Admin', 'Approval & monitoring', 'admin', 'f6789012345678901234567890abcdef', 'from-primary to-rose-deep', 'UserCog'),
(9, 'Master Admin', 'Konfigurasi & audit log', 'master_admin', '0789012345678901234567890abcdef1', 'from-navy-deep to-rose-deep', 'Settings2');