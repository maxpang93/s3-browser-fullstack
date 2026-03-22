from datetime import datetime
from pydantic import BaseModel


class FileItem(BaseModel):
    Name: str
    Key: str
    Size: int  # bytes
    LastModified: datetime


class FolderItem(BaseModel):
    Name: str
    Key: str
