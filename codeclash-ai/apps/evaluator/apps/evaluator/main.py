from fastapi import FastAPI
from pydantic import BaseModel
import ast
import time
from typing import Any

app = FastAPI(title="CodeClash Evaluator")


class TestCase(BaseModel):
    input: list[Any]
    expected: Any


class EvaluateRequest(BaseModel):
    code: str
    function_signature: str
    test_cases: list[TestCase]


@app.post("/evaluate")
def evaluate(payload: EvaluateRequest):
    start = time.perf_counter()

    try:
        parsed = ast.parse(payload.code)
        for node in ast.walk(parsed):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                return {"score": 0, "execution_time": 0.0, "error": "Imports are not allowed"}

        fn_name = payload.function_signature.split("(")[0].replace("def", "").strip()

        restricted_builtins = {
            "abs": abs,
            "all": all,
            "any": any,
            "bool": bool,
            "dict": dict,
            "enumerate": enumerate,
            "float": float,
            "int": int,
            "len": len,
            "list": list,
            "max": max,
            "min": min,
            "range": range,
            "reversed": reversed,
            "set": set,
            "sorted": sorted,
            "str": str,
            "sum": sum,
            "tuple": tuple,
            "zip": zip
        }

        score = 0
        last_error = None

        for case in payload.test_cases[:5]:
            local_env = {}
            exec(payload.code, {"__builtins__": restricted_builtins}, local_env)
            target = local_env.get(fn_name)
            if target is None:
                return {"score": 0, "execution_time": 0.0, "error": f"Function {fn_name} not found"}

            t0 = time.perf_counter()
            try:
                result = target(*case.input)
            except Exception as ex:
                last_error = str(ex)
                continue

            if time.perf_counter() - t0 > 2:
                last_error = "Timeout exceeded"
                continue

            if result == case.expected:
                score += 20

        return {
            "score": score,
            "execution_time": time.perf_counter() - start,
            "error": last_error
        }
    except Exception as ex:
        return {"score": 0, "execution_time": time.perf_counter() - start, "error": str(ex)}


@app.get("/health")
def health():
    return {"status": "ok"}
