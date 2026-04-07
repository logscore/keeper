# ML Pipelines API

The ML pipelines are served via a FastAPI app located in `ml-pipelines/`. Each pipeline is a scikit-learn model saved as a `.sav` file (via joblib) and loaded into memory at server startup. You interact with the models by sending HTTP requests — no direct file access required.

---

## Setup

From within the `ml-pipelines/` directory with the `.venv` activated:

```bash
cd ml-pipelines
source .venv/bin/activate
uvicorn app.main:app --reload
```

The server runs at `http://127.0.0.1:8000`.

### Verify all pipelines loaded

```
GET /health
```

All six values should be `true`. If any are `false`, the corresponding `.sav` file was not found — check that the file exists in `ml-pipelines/pipelines/` and that `app/config.py` references the correct filename.

### Interactive docs

```
http://127.0.0.1:8000/docs
```

FastAPI auto-generates a Swagger UI where you can test any endpoint directly in the browser without writing code.

---

## How it works

Each pipeline exposes two endpoints:

- `GET /<pipeline>/features` — returns the list of input fields the model expects
- `POST /<pipeline>/predict` — accepts a JSON body and returns the model's prediction

The `.sav` files are loaded once at startup via joblib. You never call joblib or touch the `.sav` files directly — the API handles that.

---

## Pipelines

### 1. Retention — `/retention`

Predicts whether a donor will be **retained or lapse** (binary classification).

**File:** `pipelines/retention_pipeline_v2.sav`

**Input fields:**

| Field | Type | Notes |
|---|---|---|
| `recency_days` | float \| null | Days since last gift; null triggers fallback |
| `frequency` | float | Number of gifts; default 0 |
| `total_monetary_value` | float | Total giving to date |
| `avg_monetary_value` | float \| null | Average gift size |
| `social_referral_count` | float | Default 0 |
| `is_recurring_donor` | int (0 or 1) | |
| `top_program_interest` | string \| null | e.g. `"Education"`, `"Health"` |

**Example request:**

```bash
curl -X POST http://127.0.0.1:8000/retention/predict \
  -H "Content-Type: application/json" \
  -d '{
    "recency_days": 90,
    "frequency": 5,
    "total_monetary_value": 500.0,
    "avg_monetary_value": 100.0,
    "social_referral_count": 2,
    "is_recurring_donor": 1,
    "top_program_interest": "Education"
  }'
```

**Response:**

```json
{
  "predicted_class": 1,
  "label": "retained",
  "probability_lapsed": 0.18,
  "probability_retained": 0.82,
  "features_used": ["recency_days", "frequency", ...]
}
```

`predicted_class`: `0` = lapsed, `1` = retained

---

### 2. Growth — `/growth`

Predicts a donor's **total giving scale** (regression). `total_monetary_value` is the target — do not include it in the request.

**File:** `pipelines/growth_pipeline_v3.sav`

**Input fields:**

| Field | Type | Notes |
|---|---|---|
| `recency_days` | float \| null | |
| `frequency` | float | Default 0 |
| `avg_monetary_value` | float \| null | |
| `social_referral_count` | float | Default 0 |
| `is_recurring_donor` | int (0 or 1) | |
| `top_program_interest` | string \| null | |

**Example request:**

```bash
curl -X POST http://127.0.0.1:8000/growth/predict \
  -H "Content-Type: application/json" \
  -d '{
    "recency_days": 45,
    "frequency": 8,
    "avg_monetary_value": 200.0,
    "social_referral_count": 1,
    "is_recurring_donor": 1,
    "top_program_interest": "Health"
  }'
```

**Response:**

```json
{
  "predicted_total_monetary_value": 1842.50,
  "features_used": ["recency_days", "frequency", ...]
}
```

---

### 3. Social Engagement — `/social`

Predicts the **engagement rate** for a social media post (regression).

**File:** `pipelines/social_engagement_pipeline_v2.sav`

**Input fields:**

| Field | Type | Notes |
|---|---|---|
| `caption_length` | float | Character count |
| `num_hashtags` | float | |
| `mentions_count` | float | |
| `boost_budget_php` | float | Ad spend in PHP |
| `follower_count_at_post` | float | |
| `post_hour` | int (0–23) | Hour of day posted |
| `has_call_to_action` | int (0 or 1) | |
| `is_boosted` | int (0 or 1) | |
| `platform` | string | e.g. `"Instagram"`, `"Facebook"` |
| `post_type` | string | e.g. `"Reel"`, `"Story"` |
| `media_type` | string | e.g. `"Video"`, `"Image"` |
| `content_topic` | string | e.g. `"Education"` |
| `sentiment_tone` | string | e.g. `"Positive"` |
| `post_dow` | string | Day name, e.g. `"Monday"` |
| `call_to_action_type` | string | e.g. `"Donate"` |
| `campaign_name` | string | |

**Example request:**

```bash
curl -X POST http://127.0.0.1:8000/social/predict \
  -H "Content-Type: application/json" \
  -d '{
    "caption_length": 120,
    "num_hashtags": 5,
    "mentions_count": 2,
    "boost_budget_php": 500,
    "follower_count_at_post": 10000,
    "post_hour": 14,
    "has_call_to_action": 1,
    "is_boosted": 1,
    "platform": "Instagram",
    "post_type": "Reel",
    "media_type": "Video",
    "content_topic": "Education",
    "sentiment_tone": "Positive",
    "post_dow": "Monday",
    "call_to_action_type": "Donate",
    "campaign_name": "Back to School"
  }'
```

**Response:**

```json
{
  "predicted_engagement_rate": 0.073,
  "features_used": ["caption_length", "num_hashtags", ...]
}
```

---

### 4. Girls Progress — `/girls-progress`

Predicts a resident's **mean education progress** across all records (regression, 0–100 scale). All fields are optional — send only what you have and the model handles missing values.

**File:** `pipelines/girls_progress_pipeline_v1.sav`

Key input fields include resident demographics (`present_age_years`, `sex`, `case_category`), background flags (`sub_cat_trafficked`, `sub_cat_orphaned`, etc.), health/wellness scores (`hw_mean_bmi`, `hw_mean_nutrition_score`, etc.), and education baseline (`edu_earliest_progress`, `edu_mean_attendance_rate`).

See `GET /girls-progress/features` for the full field list, or the Swagger UI at `/docs`.

**Response:**

```json
{
  "predicted_mean_progress": 74.3,
  "features_used": [...]
}
```

---

### 5. Girls Education Trajectory — `/girls-trajectory`

Predicts a resident's **progress at the next education check-in** and flags whether she is **At Risk or On Track** based on a threshold derived from training data (regression + threshold classification).

**File:** `pipelines/girls_education_trajectory_pipeline_v1.sav`

Key input fields include `current_progress`, `days_since_admission`, `days_to_next_record`, health scores, incident rates, home visitation counts, and case metadata.

See `GET /girls-trajectory/features` for the full field list, or the Swagger UI at `/docs`.

**Response:**

```json
{
  "predicted_next_progress": 68.1,
  "risk_label": "At Risk",
  "at_risk_threshold": 71.5,
  "features_used": [...]
}
```

`risk_label` is `"At Risk"` when `predicted_next_progress` falls below `at_risk_threshold`.

---

## Where the .sav files live

```
ml-pipelines/
└── pipelines/
    ├── retention_pipeline_v2.sav
    ├── growth_pipeline_v3.sav
    ├── social_engagement_pipeline_v2.sav
    ├── girls_progress_pipeline_v1.sav
    └── girls_education_trajectory_pipeline_v1.sav
```

These are joblib-serialized scikit-learn pipelines generated by the notebooks in `ml-pipelines/ipynb notebooks/`. To regenerate a model, run the corresponding notebook end-to-end and it will overwrite the `.sav` file. The API server must be restarted after replacing a `.sav` file for the new model to take effect.

To point the server at a different file without editing config, set the corresponding environment variable before starting uvicorn:

```bash
RETENTION_PIPELINE_PATH=/path/to/other.sav uvicorn app.main:app --reload
```

Available overrides: `RETENTION_PIPELINE_PATH`, `GROWTH_PIPELINE_PATH`, `SOCIAL_ENGAGEMENT_PIPELINE_PATH`, `GIRLS_PROGRESS_PIPELINE_PATH`, `GIRLS_STRUGGLING_PIPELINE_PATH`, `GIRLS_EDUCATION_TRAJECTORY_PIPELINE_PATH`.
