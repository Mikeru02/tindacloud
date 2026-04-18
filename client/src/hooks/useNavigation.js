import { useNavigate } from "react-router-dom";

function useNavigation() {
    const navigate = useNavigate();

    const goTo = (route) => {
        navigate(route);
    }

    return { goTo }
}

export default useNavigation;