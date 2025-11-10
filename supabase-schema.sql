-- Puffy Bites: improved schema

-- Use integer cents for money to avoid rounding issues.
CREATE TABLE IF NOT EXISTS desserts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pack_of INTEGER NOT NULL,                       -- renamed from packOf
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  image TEXT,
  ingredients TEXT,
  tags TEXT[] DEFAULT ARRAY[]::text[],
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  transaction_ref_id TEXT NOT NULL UNIQUE,
  customer_info JSONB NOT NULL,                   -- keep JSONB if flexible
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  delivery_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dessert_id BIGINT NOT NULL REFERENCES desserts(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0), -- store snapshot price
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sample data (prices are cents)
INSERT INTO desserts (name, description, pack_of, price_cents, image, ingredients, tags, is_featured, in_stock) VALUES
('Vanilla Flavoured', 'Vanilla flavoured fluffy cream and a little chocolate mixture', 10, 250000, 'https://example.com/img1.jpg', 'Vanilla, Chocolate', ARRAY['Vanilla','chocolate'], true, true),
('Mixed Glazed', 'Mixed glaze a mixture of creamy vanilla flavour and chocolate with a little Oreo at the top', 10, 300000, 'https://example.com/img2.jpg', 'Vanilla, Chocolate, Oreo', ARRAY['Vanilla','chocolate','Oreo'], true, true),
('Vanilla Glazed', 'Vanilla flavoured fluffy cream and a little chocolate mixture', 10, 250000, 'https://example.com/img3.jpg', 'Vanilla, Chocolate', ARRAY['Vanilla','chocolate'], true, true),
('Mixed Glazed Large', 'Mixed glaze ... larger pack', 15, 300000, 'https://example.com/img4.jpg', 'Vanilla, Chocolate, Oreo', ARRAY['Vanilla','chocolate','Oreo'], true, true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_desserts_featured ON desserts(is_featured);
CREATE INDEX IF NOT EXISTS idx_desserts_in_stock ON desserts(in_stock);
CREATE INDEX IF NOT EXISTS idx_desserts_pack_of ON desserts(pack_of);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_dessert_id ON order_items(dessert_id);

-- If you query JSONB customer_info fields (e.g., customer_info->>'email'), create an expression index:
-- Example: index for customer email lookup
--CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders ((customer_info->>'email'));

-- Trigger to update updated_at timestamps automatically
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER desserts_set_updated_at BEFORE UPDATE ON desserts
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER order_items_set_updated_at BEFORE UPDATE ON order_items
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Row Level Security: enable and create safer policies
ALTER TABLE desserts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read for desserts (read-only publicly)
CREATE POLICY desserts_public_select ON desserts
  FOR SELECT TO PUBLIC USING (true);

-- Inserts: restrict to authenticated users (use role 'authenticated' in Supabase)
CREATE POLICY orders_insert_authenticated ON orders
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY order_items_insert_authenticated ON order_items
  FOR INSERT TO authenticated WITH CHECK (true);

-- Admin policies: require admin claim in JWT; replace 'admin' check with your JWT claim key
-- Example checks a custom claim "role" for 'admin'. Adjust claim name to your setup.
CREATE POLICY desserts_admin_all ON desserts
  FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin') WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY orders_admin_all ON orders
  FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin') WITH CHECK ((auth.jwt() ->> 'role') = 'admin');