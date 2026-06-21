CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mood VARCHAR(80),
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS life_moments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(160),
  content TEXT NOT NULL,
  occurred_at DATE,
  emotional_tone VARCHAR(80),
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reflection_emotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reflection_id UUID NOT NULL REFERENCES reflections(id) ON DELETE CASCADE,
  emotion_id UUID NOT NULL REFERENCES emotions(id) ON DELETE CASCADE,
  confidence NUMERIC(4, 3),
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(reflection_id, emotion_id)
);

CREATE TABLE IF NOT EXISTS reflection_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reflection_id UUID NOT NULL REFERENCES reflections(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  confidence NUMERIC(4, 3),
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(reflection_id, theme_id)
);

CREATE TABLE IF NOT EXISTS reflection_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reflection_id UUID NOT NULL REFERENCES reflections(id) ON DELETE CASCADE,
  value_id UUID NOT NULL REFERENCES values(id) ON DELETE CASCADE,
  confidence NUMERIC(4, 3),
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(reflection_id, value_id)
);

CREATE TABLE IF NOT EXISTS life_moment_emotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  life_moment_id UUID NOT NULL REFERENCES life_moments(id) ON DELETE CASCADE,
  emotion_id UUID NOT NULL REFERENCES emotions(id) ON DELETE CASCADE,
  confidence NUMERIC(4, 3),
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(life_moment_id, emotion_id)
);

CREATE TABLE IF NOT EXISTS life_moment_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  life_moment_id UUID NOT NULL REFERENCES life_moments(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  confidence NUMERIC(4, 3),
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(life_moment_id, theme_id)
);

CREATE TABLE IF NOT EXISTS life_moment_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  life_moment_id UUID NOT NULL REFERENCES life_moments(id) ON DELETE CASCADE,
  value_id UUID NOT NULL REFERENCES values(id) ON DELETE CASCADE,
  confidence NUMERIC(4, 3),
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(life_moment_id, value_id)
);

CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL,
  text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reflections_user_id ON reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_reflections_created_at ON reflections(created_at);

CREATE INDEX IF NOT EXISTS idx_life_moments_user_id ON life_moments(user_id);
CREATE INDEX IF NOT EXISTS idx_life_moments_created_at ON life_moments(created_at);
CREATE INDEX IF NOT EXISTS idx_life_moments_occurred_at ON life_moments(occurred_at);

CREATE INDEX IF NOT EXISTS idx_reflection_emotions_reflection_id ON reflection_emotions(reflection_id);
CREATE INDEX IF NOT EXISTS idx_reflection_themes_reflection_id ON reflection_themes(reflection_id);
CREATE INDEX IF NOT EXISTS idx_reflection_values_reflection_id ON reflection_values(reflection_id);

CREATE INDEX IF NOT EXISTS idx_life_moment_emotions_life_moment_id ON life_moment_emotions(life_moment_id);
CREATE INDEX IF NOT EXISTS idx_life_moment_themes_life_moment_id ON life_moment_themes(life_moment_id);
CREATE INDEX IF NOT EXISTS idx_life_moment_values_life_moment_id ON life_moment_values(life_moment_id);