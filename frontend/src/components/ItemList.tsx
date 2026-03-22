import type { Item } from "../types/s3";

type ItemListProps = {
  items: Item[];
  onFolderClick: (folderName: string) => void;
};

function renderFolder(
  item: Extract<Item, { type: "folder" }>,
  onFolderClick: (prefix: string) => void,
) {
  return (
    <li key={item.prefix}>
      <span
        style={{ cursor: "pointer", fontWeight: "bold" }}
        onClick={() => onFolderClick(item.prefix)}
      >
        📁 {item.name}
      </span>
    </li>
  );
}

function renderFile(item: Extract<Item, { type: "file" }>) {
  return (
    <li key={item.key}>
      <span>📄 {item.name}</span>
      <span style={{ marginLeft: 8, color: "#888" }}>({item.size} bytes)</span>
    </li>
  );
}

function ItemList({ items, onFolderClick }: ItemListProps) {
  return (
    <ul>
      {items.map((item) =>
        item.type === "folder"
          ? renderFolder(item, onFolderClick)
          : renderFile(item),
      )}
    </ul>
  );
}

export default ItemList;
