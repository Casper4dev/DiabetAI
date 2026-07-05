## Goal
Turn the "Read More →" buttons in the "Learn More About Managing Your Health" section on `/next-steps` into clickable links that open authoritative external resources in a new tab.

## Changes
In `src/pages/NextSteps.tsx`:

1. Add a `url` field to each item in the `resources` array:
   - **Understanding Diabetes** → `https://books.google.com/books?hl=en&lr=&id=jryKBkyZjl8C&oi=fnd&pg=PR1&dq=Understanding+Diabetes&ots=_9dFDJ0ekb&sig=7uG9gs1uv1SAga_SX6v_dn18rfA`
   - **Nutrition & Blood Sugar** → `https://nutritionsource.hsph.harvard.edu/carbohydrates/carbohydrates-and-blood-sugar/`
   - **Exercise & Insulin Sensitivity** → reputable default: `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/` (PMC review on exercise and insulin sensitivity)
   - **Medication Basics** → reputable default: `https://www.diabetes.org/healthy-living/medication-treatments` (American Diabetes Association)

2. Render the "Read More →" button as an anchor (`<a href={r.url} target="_blank" rel="noopener noreferrer">`) wrapped by the existing shadcn `Button` using `asChild`, preserving current styling (`variant="link"`, `text-teal`).

No other files or business logic affected.