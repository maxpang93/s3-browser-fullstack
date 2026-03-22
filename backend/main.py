import os

import boto3
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from models import FileItem, FolderItem

load_dotenv()

app = FastAPI()

allowed_origins: list[str] = [
    # "http://localhost:5173",
    os.getenv("FRONTEND_URL", "")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BUCKET = os.getenv("S3_BUCKET")
REGION = os.getenv("S3_REGION")

s3_client = boto3.client("s3", region_name=REGION)


@app.get("/")
def list_items(
    prefix: str = Query("", description="S3 Prefix")
) -> list[FileItem | FolderItem]:
    """
    return the list of files and pseudo-directories
    under this prefix
    """
    resp = s3_client.list_objects_v2(
        Bucket=BUCKET,
        Prefix=prefix,
        Delimiter="/",
        # MaxKeys=-1,
    )

    def _transform(item):
        if "Prefix" in item:
            foldername = item["Prefix"].removeprefix(prefix)
            return FolderItem(**{"Name": foldername, "Key": item["Prefix"]})
        filename = item["Key"].removeprefix(prefix)
        # manual pseudo-folder creation at AWS console appears in resp["Contents"]
        if not filename:
            return None
        return FileItem(**{"Name": filename, **item})

    items = [
        _transform(item)
        for item in resp.get("Contents", []) + resp.get("CommonPrefixes", [])
    ]
    return [x for x in items if x is not None]


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
    )
