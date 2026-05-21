-- Create News Table
CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    source_url TEXT NOT NULL,
    source_name TEXT NOT NULL,
    category TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on timestamp for faster sorting
CREATE INDEX IF NOT EXISTS news_timestamp_idx ON news(timestamp DESC);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS news_category_idx ON news(category);

-- Enable Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policy: allow public read access
CREATE POLICY "Allow public read access" ON news
    FOR SELECT
    USING (true);

-- Create policy: allow service role full access (for our backend)
CREATE POLICY "Allow service role full access" ON news
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON news TO authenticated;
GRANT ALL ON news TO service_role;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
