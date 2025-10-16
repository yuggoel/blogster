from bson import ObjectId
from fastapi import HTTPException


def obj_id_to_str(obj: dict) -> dict:
    obj["id"] = str(obj["_id"]) if isinstance(obj.get("_id"), ObjectId) else obj.get("id")
    if "_id" in obj:
        del obj["_id"]
    return obj


def is_valid_object_id(value: str) -> bool:
    try:
        ObjectId(value)
        return True
    except Exception:
        return False


