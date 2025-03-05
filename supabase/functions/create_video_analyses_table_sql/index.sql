
CREATE OR REPLACE FUNCTION public.create_video_analyses_table_sql()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'video_analyses'
  ) THEN
    -- Create the table
    CREATE TABLE public.video_analyses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users NOT NULL,
      video_id TEXT NOT NULL,
      video_url TEXT NOT NULL,
      video_data JSONB NOT NULL,
      analysis_results JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );

    -- Add RLS
    ALTER TABLE public.video_analyses ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Les utilisateurs peuvent voir leurs propres analyses vidéo"
      ON public.video_analyses FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Les utilisateurs peuvent ajouter leurs propres analyses vidéo"
      ON public.video_analyses FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres analyses vidéo"
      ON public.video_analyses FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres analyses vidéo"
      ON public.video_analyses FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END;
$$;
