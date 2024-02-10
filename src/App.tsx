import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

// Pages
import UpdateProject from "./project/pages/UpdateProject";
import NewProject from "./project/pages/NewProject";
import UserProject from "./project/pages/UserProject";
import Signup from "./user/pages/Signup";
import Login from "./user/pages/Login";
import Project from "./project/pages/Project";
import UpdateTicket from "./ticket/pages/UpdateTicket";

// Context
import { AuthContext } from "./context/AuthContext";

// Hook
import { useAuth } from "../src/hooks/Auth-hook";

const App = () => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isColumnIndex, setColumnIndex] = useState<number | null>(null);

  const { isToken, login, logout, userId } = useAuth();

  const project = (pid: string | null) => {
    setProjectId(pid);
  };

  const columnIndexHandler = (cid: number | null) => {
    setColumnIndex(cid);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!isToken,
        token: isToken,
        isLogin: login,
        isLogout: logout,
        userId,
        isProject: project,
        projectId,
        columnIndex: isColumnIndex,
        isColumnIndex: columnIndexHandler,
      }}
    >
      <Router>
        <Switch>
          {isToken && (
            <>
              <Route path="/projects/new" exact>
                <NewProject />
              </Route>

              <Route path="/projects/:projectId/tickets" exact>
                <Project />
              </Route>

              <Route path="/projects/:projectId" exact>
                <UpdateProject />
              </Route>

              <Route path="/:userId/projects" exact>
                <UserProject />
              </Route>

              <Route path="/tickets/:ticketId" exact>
                <UpdateTicket />
              </Route>

              <Redirect to="/projects/new" />
            </>
          )}

          {!isToken && (
            <>
              <Route path="/signup" exact>
                <Signup />
              </Route>
              <Route path="/login" exact>
                <Login />
              </Route>
              <Redirect to="/login" />
            </>
          )}
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
