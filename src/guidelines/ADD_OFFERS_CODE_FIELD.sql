-- Add code field to offers table if it doesn't exist
-- Run this in Supabase SQL Editor

-- Add code column (for discount codes)
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS code TEXT;

-- Add discount_value column (numeric discount amount)
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS discount_value DECIMAL(10,2);

-- Add min_purchase column (minimum purchase requirement)
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS min_purchase DECIMAL(10,2);

-- Optional: Add some sample offers with codes
-- Uncomment and modify as needed

/*
-- Sample offer with code
INSERT INTO offers (
  title,
  description,
  code,
  discount_percent,
  discount_value,
  active,
  start_date,
  end_date
) VALUES (
  'Welcome 20% Off',
  'Get 20% off your first purchase!',
  'WELCOME20',
  20,
  NULL,
  true,
  NOW(),
  NOW() + INTERVAL '30 days'
);

-- Sample offer with fixed discount
INSERT INTO offers (
  title,
  description,
  code,
  discount_percent,
  discount_value,
  min_purchase,
  active,
  start_date,
  end_date
) VALUES (
  'Get $10 Off Orders Over $50',
  'Use code SAVE10 for $10 off when you spend $50 or more',
  'SAVE10',
  NULL,
  10.00,
  50.00,
  true,
  NOW(),
  NOW() + INTERVAL '60 days'
);

-- Sample flash sale offer
INSERT INTO offers (
  title,
  description,
  code,
  discount_percent,
  active,
  start_date,
  end_date
) VALUES (
  'Flash Sale - 40% Off All Coffee',
  'Limited time! Get 40% off all coffee beans',
  'FLASH40',
  40,
  true,
  NOW(),
  NOW() + INTERVAL '7 days'
);
*/

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'offers' 
AND column_name IN ('code', 'discount_value', 'min_purchase');
