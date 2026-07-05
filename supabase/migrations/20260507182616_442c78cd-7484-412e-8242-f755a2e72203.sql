CREATE TABLE public.clinician_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinician_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  data JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clinician_assessments_clinician ON public.clinician_assessments(clinician_id, created_at DESC);

ALTER TABLE public.clinician_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view their own assessments"
  ON public.clinician_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can insert their own assessments"
  ON public.clinician_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can delete their own assessments"
  ON public.clinician_assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = clinician_id);