import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./actions/userActions";
import Cookies from "js-cookie";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashBoard from "./pages/DashBoard";
import ProfilePage from "./pages/ProfilePage";
import Notifications from "./pages/Notifications";
import ChatPage from "./pages/ChatPage";
import SearchPage from "./pages/SearchPage";
import EditProfilePage from "./pages/EditProfilePage";
import { socket, socketContext } from "./context/socket";
import ConversationPage from "./pages/ConversationPage";

function App() {
    console.log(socket);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser(Cookies.get("token")));
    }, [dispatch]);
    return (
        <socketContext.Provider value={socket}>
            <Router>
                <Switch>
                    <Route path="/" component={DashBoard} exact />
                    <Route path="/register" component={RegisterPage} exact />
                    <Route path="/login" component={LoginPage} exact />
                    <Route
                        path="/notifications"
                        component={Notifications}
                        exact
                    />
                    <Route
                        path="/conversations"
                        component={ConversationPage}
                        exact
                    />
                    <Route
                        path="/profile/edit"
                        component={EditProfilePage}
                        exact
                    />
                    <Route path="/search" component={SearchPage} exact />
                    <Route path="/profile/:id" component={ProfilePage} exact />
                    <Route path="/message/:id" component={ChatPage} exact />
                </Switch>
            </Router>
        </socketContext.Provider>
    );
}

export default App;
