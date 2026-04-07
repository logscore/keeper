from fastapi import APIRouter, HTTPException, Request

from app.schemas.girls_trajectory import GirlsTrajectoryFeatures, GirlsTrajectoryPrediction
from app.services.girls_trajectory import TRAJ_FEATURE_COLUMNS, predict_girls_trajectory

router = APIRouter(prefix="/girls-trajectory", tags=["girls-trajectory"])


@router.get("/features")
def girls_trajectory_feature_schema():
    return {"feature_columns": TRAJ_FEATURE_COLUMNS, "order": TRAJ_FEATURE_COLUMNS}


@router.post("/predict", response_model=GirlsTrajectoryPrediction)
def girls_trajectory_predict(request: Request, body: GirlsTrajectoryFeatures):
    bundle = getattr(request.app.state, "girls_trajectory_artifact", None)
    if bundle is None or bundle.get("pipeline") is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Girls education trajectory artifact not loaded. Run "
                "girls_education_trajectory.ipynb Phase 6 or set "
                "GIRLS_EDUCATION_TRAJECTORY_PIPELINE_PATH."
            ),
        )

    row = body.model_dump()
    try:
        pred, label, thr = predict_girls_trajectory(bundle, row)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    return GirlsTrajectoryPrediction(
        predicted_next_progress=pred,
        risk_label=label,
        at_risk_threshold=thr,
        features_used=TRAJ_FEATURE_COLUMNS,
    )
