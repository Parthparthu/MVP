import json
from pathlib import Path

problems = [
    {
        "title": "Two Sum Indices",
        "description": "Return indices of two numbers that add to target.",
        "function_signature": "def solve(nums, target)",
        "test_cases": [
            {"input": [[2, 7, 11, 15], 9], "expected": [0, 1]},
            {"input": [[3, 2, 4], 6], "expected": [1, 2]},
            {"input": [[3, 3], 6], "expected": [0, 1]},
            {"input": [[1, 5, 8, 10], 13], "expected": [1, 2]},
            {"input": [[0, 4, 3, 0], 0], "expected": [0, 3]}
        ]
    }
]

out = Path(__file__).resolve().parents[1] / "problems.seed.json"
out.write_text(json.dumps(problems, indent=2))
print(f"Generated {out}")
