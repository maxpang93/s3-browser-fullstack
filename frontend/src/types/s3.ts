export interface S3ObjectMetadata {
  Name: string;
  Key: string;
  LastModified: string;
  ETag: string;
  ChecksumAlgorithm: string[];
  ChecksumType: string;
  Size: number;
  StorageClass: string;
}

export type FileItem = {
  type: "file";
  name: string;
  key: string;
  size: number;
  lastModified: string;
};

export type FolderItem = {
  type: "folder";
  name: string;
  prefix: string;
};

export type Item = FileItem | FolderItem;
