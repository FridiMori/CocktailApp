import {Route, Routes } from 'react-router-dom';
import AppToolbar from "./components/AppToolbar/AppToolbar.tsx";
import RegisterForm from './features/User/RegisterForm.tsx';
import Login from './features/User/LoginForm.tsx';
import CocktailForm from "./features/Cocktail/components/CocktailForm.tsx";
import MyCocktails from "./features/Cocktail/components/MyCocktails.tsx";
import AdminModeration from "./components/Admin/AdminModeration.tsx";
import CocktailsList from "./features/Cocktail/components/CocktailsList.tsx";
import StickyButtons from "./components/Buttons/StickyButtons.tsx";
import CocktailDetails from "./features/Cocktail/components/CocktailDetails.tsx";
import {Container} from "@mui/material";

const App = () => (
    <>
        <header>
            <AppToolbar />
        </header>
        <Container>
            <Routes>
                <Route path="/" element={<CocktailsList />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/my-cocktails" element={<MyCocktails />} />
                <Route path="/admin/moderation" element={<AdminModeration />} />
                <Route path="/cocktails/new" element={<CocktailForm />} />
                <Route path="/cocktails/:id/edit" element={<CocktailForm />} />
                <Route path="/cocktails/:id" element={<CocktailDetails />} />
            </Routes>
        </Container>

        <StickyButtons />
    </>
);

export default App
