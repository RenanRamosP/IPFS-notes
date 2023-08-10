import { getNotes } from "../providers/handleIPFS";

const initialState = [];

export type TableData = {
  cid: string;
  path?: string;
  type?: string;
  name?: string;
};

export type tableDataActions = {
  type: "update" | "clear" | "showNamed";
  payload?: TableData[];
};

function tableDataReducer(state: TableData[], action: tableDataActions) {
  switch (action.type) {
    case "update":
      return action?.payload ?? [];
    case "clear":
      return [];
    case "showNamed":
      return state.filter((note) => note.name);
    default:
      throw new Error();
  }
}

export { tableDataReducer };
