
import { createContext } from "react";

interface AuthContextProps {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  projectId: string | null;
  isLogin: (uid: string | null, token: string | null) => void;
  isLogout: () => void;
  isProject: (pid: string | null) => void;
  columnIndex: number | null;
  isColumnIndex: (cid: number | null) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  userId: null,
  token: null,
  projectId: null,
  isLogin: (uid: string | null, token: string | null) => {},
  isLogout: () => {},
  columnIndex: null,
  isColumnIndex: (cid: number | null) => {},
  isProject: () => {},
});
