import {Route, Routes } from 'react-router-dom';
import AppToolbar from "./components/AppToolbar/AppToolbar.tsx";
import RegisterForm from './features/User/RegisterForm.tsx';
import Login from './features/User/LoginForm.tsx';

const App = () => (
    <>
        <header>
            <AppToolbar />
        </header>
        <div>
            тут что-то будет
        </div>
        <Routes>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </>
);

export default App
