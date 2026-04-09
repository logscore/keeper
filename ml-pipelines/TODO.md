# ML Integration — Remaining TODO

## Database (needs DB person)

These items are blocked until the backend exposes the necessary data endpoints.

### Donor endpoints needed
For `donors-contributions.tsx` — per-donor ML predictions (retention risk + predicted giving):
- Endpoint must return each donor's feature data:
  - `frequency`, `avg_monetary_value`, `social_referral_count`, `is_recurring_donor`, `top_program_interest` (for retention)
  - `recency_days`, `frequency`, `social_referral_count`, `is_recurring_donor`, `donor_tenure_days`, `supporter_type`, `relationship_type`, `region`, `acquisition_channel`, `status` (for growth)
- Once available, pass each donor's features to `POST /api/ml/retention/predict` and `POST /api/ml/growth/predict`
- Display retention risk badge (Low/Medium/High) and predicted lifetime value per donor row

### Resident endpoints needed
For `caseload.tsx` — per-resident ML predictions (education progress + risk trajectory):
- Endpoint must return each resident's feature data matching `GirlsProgressFeatures` and `GirlsTrajectoryFeatures` schemas
- See `ml-pipelines/app/schemas/girls_progress.py` and `ml-pipelines/app/schemas/girls_trajectory.py` for exact field names
- Once available, pass to `POST /api/ml/girls-progress/predict` and `POST /api/ml/girls-trajectory/predict`
- Display progress score and At Risk / On Track badge per resident row

### Reports page aggregates
Once donor + resident endpoints exist, replace the sample-input cards on `/reports` with real aggregates:
- Donor Retention → % of all donors predicted to lapse
- Predicted Giving → average predicted lifetime value across all donors
- Edu. Progress → average predicted progress across all active residents
- Risk Trajectory → count of residents flagged "At Risk"
- Social Engagement + Boost Impact → can stay as post-profile previews until a social media page is built

---

## GitHub / Deployment

### Add GitHub secret
- Go to the repo → **Settings → Secrets and variables → Actions → New repository secret**
- Name: `ML_SERVICE_URL`
- Value: the deployed Azure URL of `keeper-intex-pipeline` (e.g. `https://keeper-intex-pipeline.azurewebsites.net`)
- This is required for the nightly retraining workflow (`.github/workflows/nightly-retrain.yml`) to fire

### Confirm dataset is deployed to Azure
- The nightly retrain workflow calls `POST /admin/retrain/{model}` on the live ML service
- The ML service needs `Dataset/lighthouse_csv_v7/` present on the Azure App Service instance
- Currently the GitHub Actions deploy workflow (`main_keeper-intex-pipeline.yml`) only copies `app/`, `pipelines/`, and `requirements.txt`
- **Action needed:** add `Dataset/` to the deploy package, or confirm the dataset is already present on the server
- Without the dataset, nightly retraining will fail silently

### Test nightly retrain manually
- Once `ML_SERVICE_URL` is set and the dataset is confirmed on the server, trigger the workflow manually:
  - GitHub → Actions → "Nightly Model Retraining" → Run workflow
- Verify all 6 models retrain successfully and `GET /health` still shows all pipelines loaded
