-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    user_id UUID REFERENCES auth.users(id),
    consignment_id TEXT REFERENCES consignments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ticket_messages table for conversations
CREATE TABLE IF NOT EXISTS ticket_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender_type TEXT NOT NULL, -- 'user' or 'agent'
    sender_id TEXT NOT NULL, -- user_id or agent_id
    sender_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    agent_id TEXT,
    agent_name TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'ended'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender_type TEXT NOT NULL, -- 'user' or 'agent'
    sender_id TEXT NOT NULL, -- user_id or agent_id
    sender_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_base_articles table
CREATE TABLE IF NOT EXISTS knowledge_base_articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for support_tickets
CREATE POLICY "Users can view their own tickets" 
ON support_tickets FOR SELECT 
USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can insert their own tickets" 
ON support_tickets FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own tickets" 
ON support_tickets FOR UPDATE 
USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Create policies for ticket_messages
CREATE POLICY "Users can view messages for their tickets" 
ON ticket_messages FOR SELECT 
USING (
    ticket_id IN (
        SELECT id FROM support_tickets WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
);

CREATE POLICY "Users can insert messages for their tickets" 
ON ticket_messages FOR INSERT 
WITH CHECK (
    ticket_id IN (
        SELECT id FROM support_tickets WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
);

-- Create policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" 
ON chat_sessions FOR SELECT 
USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can insert their own chat sessions" 
ON chat_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own chat sessions" 
ON chat_sessions FOR UPDATE 
USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Create policies for chat_messages
CREATE POLICY "Users can view messages for their chat sessions" 
ON chat_messages FOR SELECT 
USING (
    session_id IN (
        SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
);

CREATE POLICY "Users can insert messages for their chat sessions" 
ON chat_messages FOR INSERT 
WITH CHECK (
    session_id IN (
        SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
);

-- Create policies for knowledge_base_articles
CREATE POLICY "Anyone can view knowledge base articles" 
ON knowledge_base_articles FOR SELECT 
USING (true);

CREATE POLICY "Only service role can manage knowledge base articles" 
ON knowledge_base_articles FOR ALL 
USING (auth.role() = 'service_role');

-- Insert some sample knowledge base articles
INSERT INTO knowledge_base_articles (id, title, content, category, tags)
VALUES 
('KB-001', 'How to Track Your Package', 'You can track your package by entering your tracking ID in the tracking section of our website or mobile app. You can also receive updates via SMS or email.', 'Tracking', ARRAY['tracking', 'package', 'delivery']),
('KB-002', 'Delivery Delays Explained', 'Delivery delays can occur due to various reasons including weather conditions, high volume periods, or customs clearance for international shipments.', 'Delivery', ARRAY['delay', 'delivery', 'shipping']),
('KB-003', 'How to Schedule a Pickup', 'You can schedule a pickup through our website or mobile app. Simply log in to your account, select "Schedule Pickup," and follow the instructions to set a date and time.', 'Services', ARRAY['pickup', 'scheduling', 'service']),
('KB-004', 'Packaging Guidelines', 'Proper packaging is essential to ensure your items arrive safely. Use appropriate box sizes, cushioning materials, and secure sealing methods.', 'Shipping', ARRAY['packaging', 'shipping', 'guidelines']),
('KB-005', 'International Shipping Requirements', 'International shipments require proper documentation including customs forms, commercial invoices, and may be subject to duties and taxes.', 'International', ARRAY['international', 'customs', 'shipping']);
