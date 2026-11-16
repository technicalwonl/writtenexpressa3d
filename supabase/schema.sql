-- =====================================================================
-- WRITTEN EXPRESSA — COMPLETE DATABASE SCHEMA
-- Normalized schema for Services, Pricing, Orders, Enquiries, CMS, 3D
-- =====================================================================

-- 1. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Published', -- 'Draft', 'Published', 'Unpublished', 'Coming Soon'
    featured BOOLEAN DEFAULT FALSE,
    description TEXT NOT NULL,
    cta_text TEXT NOT NULL DEFAULT 'GET STARTED',
    cta_action_id TEXT,
    three_d_object TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,
    pricing_model TEXT NOT NULL,
    packages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pricing Table
CREATE TABLE IF NOT EXISTS public.pricing (
    id TEXT PRIMARY KEY,
    service_id TEXT REFERENCES public.services(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    type TEXT NOT NULL,
    details TEXT NOT NULL,
    min_price NUMERIC DEFAULT 0,
    max_price NUMERIC DEFAULT 0,
    is_custom BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pricing History (Audit Trail)
CREATE TABLE IF NOT EXISTS public.pricing_history (
    id BIGSERIAL PRIMARY KEY,
    pricing_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    previous_value TEXT,
    new_value TEXT NOT NULL,
    changed_by TEXT NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Customer Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    service TEXT NOT NULL,
    description TEXT NOT NULL,
    budget TEXT NOT NULL,
    attachment_note TEXT,
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Quotation Sent', 'Converted', 'Completed', 'Lost'
    assigned_to TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Orders & Projects
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    service_name TEXT NOT NULL,
    project_title TEXT NOT NULL,
    agreed_amount NUMERIC NOT NULL DEFAULT 0,
    advance_received NUMERIC NOT NULL DEFAULT 0,
    remaining_balance NUMERIC NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Payment Partially Received', 'Paid'
    order_status TEXT NOT NULL DEFAULT 'Awaiting Confirmation', -- 'Confirmed', 'In Progress', 'Completed', 'Delivered'
    assigned_to TEXT,
    delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Testimonials & Reviews
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    service_purchased TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    featured BOOLEAN DEFAULT FALSE,
    consent_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Referrals Management
CREATE TABLE IF NOT EXISTS public.referrals (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    referrer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    visits INTEGER DEFAULT 0,
    enquiries INTEGER DEFAULT 0,
    converted INTEGER DEFAULT 0,
    reward_earned NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Subscribed',
    source TEXT DEFAULT 'Website Footer',
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    display_order INTEGER DEFAULT 1,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Activity Audit Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    details TEXT NOT NULL
);

-- 11. Website CMS Content
CREATE TABLE IF NOT EXISTS public.website_content (
    section_key TEXT PRIMARY KEY,
    content_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. 3D Experience Config
CREATE TABLE IF NOT EXISTS public.three_d_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
