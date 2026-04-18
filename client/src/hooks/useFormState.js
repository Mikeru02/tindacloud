import { useState } from "react";

function useFormState() {
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    return {
        showPassword,
        setShowPassword,
        acceptedTerms,
        setAcceptedTerms
    };
}

export default useFormState;