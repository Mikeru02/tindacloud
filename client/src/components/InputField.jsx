import React from "react";

function InputField({
    id, label, type = "text", placeholder, value, onChange, required = false,
    customStyles = ""
}) {
    return (
        <div className="mb-5 w-full">
            <label htmlFor={id}
                className="block mb-2 text-sm font-semibold text-[#475569]"
            >
                {label}
            </label>
            <input
                className="w-full px-3 py-4 border border-2 border-[#e2e8f0] rounded-lg text-sm"
                name={id}
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
}

export default InputField;