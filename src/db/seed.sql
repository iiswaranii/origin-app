INSERT INTO emotions (name, description) VALUES
('anxiety', 'Feeling worry, nervousness, or unease'),
('sadness', 'Feeling sorrow, heaviness, or emotional pain'),
('joy', 'Feeling happiness, delight, or lightness'),
('anger', 'Feeling irritation, frustration, or rage'),
('fear', 'Feeling threatened, unsafe, or uncertain'),
('shame', 'Feeling exposed, flawed, or not enough'),
('guilt', 'Feeling responsible for something wrong'),
('loneliness', 'Feeling isolated or disconnected'),
('hope', 'Feeling possibility or optimism'),
('excitement', 'Feeling energy, anticipation, or enthusiasm')
ON CONFLICT (name) DO NOTHING;

INSERT INTO themes (name, description) VALUES
('work', 'Reflections related to career, ambition, or workplace life'),
('relationships', 'Reflections related to connection with others'),
('identity', 'Reflections related to self-image and who the user is becoming'),
('confidence', 'Reflections related to self-belief or self-doubt'),
('belonging', 'Reflections related to feeling included or excluded'),
('change', 'Reflections related to transition or transformation'),
('family', 'Reflections related to family dynamics or history'),
('creativity', 'Reflections related to expression, imagination, or creation'),
('freedom', 'Reflections related to independence and autonomy'),
('judgment', 'Reflections related to being seen, evaluated, or criticized')
ON CONFLICT (name) DO NOTHING;

INSERT INTO values (name, description) VALUES
('freedom', 'Desire for independence, choice, and autonomy'),
('security', 'Desire for safety, stability, and predictability'),
('connection', 'Desire for closeness, belonging, and emotional bond'),
('growth', 'Desire to learn, evolve, and expand'),
('creativity', 'Desire to express and create'),
('truth', 'Desire for honesty, clarity, and authenticity'),
('achievement', 'Desire to accomplish meaningful goals'),
('peace', 'Desire for calm, balance, and inner stillness'),
('recognition', 'Desire to be seen, valued, or appreciated'),
('purpose', 'Desire for meaning and direction')
ON CONFLICT (name) DO NOTHING;