"""
Shared path resolution for Jupyter notebooks under ml-pipelines/.
Import from a code cell (Phase 2+) after adjusting sys.path once — see donor_growth template.

Or copy the find_dataset_root() logic; it searches upward from cwd for Dataset/lighthouse_csv_v7.
"""

from __future__ import annotations

from pathlib import Path


def find_dataset_root() -> Path:
    """
    Return the directory that contains `Dataset/lighthouse_csv_v7`
    (typically the `keeper` repo root), walking up from cwd.
    """
    here = Path.cwd().resolve()
    for p in [here, *here.parents]:
        if (p / "Dataset" / "lighthouse_csv_v7").is_dir():
            return p
    raise FileNotFoundError(
        "Could not find Dataset/lighthouse_csv_v7/ starting from cwd="
        f"{here}\n"
        "Put the Lighthouse CSV bundle under <repo>/Dataset/lighthouse_csv_v7/, "
        "or open the workspace folder that contains Dataset/, "
        "or run Jupyter with that folder as the working directory."
    )
