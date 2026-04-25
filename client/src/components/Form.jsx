import React from "react";

function Form({ children, submitEvent }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        submitEvent?.(e);
    }

    return (
        <form 
            className="w-full p-8" 
            onSubmit={handleSubmit}>
            {children}
        </form>
    );
}

export default Form;