import { useState, useEffect } from "react";
import ItemList from "./ItemList";
import { listItems } from "../services/api";
import type { Item } from "../types/s3";

function FileBrowser() {
  const [items, setItems] = useState<Item[]>([]);
  const [prefix, setPrefix] = useState<string>("");

  useEffect(() => {
    listItems(prefix).then(setItems).catch(console.error);
  }, [prefix]);

  function handleFolderClick(newPrefix: string) {
    setPrefix(newPrefix);
  }

  return (
    <div>
      <h1>S3 Browser</h1>
      <ItemList items={items} onFolderClick={handleFolderClick} />
    </div>
  );
}

export default FileBrowser;
