import React from "react";
import Button from "./Button";

function PasswordField({
    id, label, value, variant, onChange, showPassword, toggleShowPassword,
    placeholder, required = false
}) {
    return (
        <div className="mb-5 w-full">
            <label htmlFor={id}
                className="block mb-2 text-sm font-semibold text-[#475569]"
            >
                {label}
            </label>

            <div className="relative flex items-center">
                <input
                    className="w-full px-3 py-4 border border-2 border-[#e2e8f0] rounded-lg text-sm"
                    name={id}
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required
                />
                <Button
                    variant={variant}
                    onClick={toggleShowPassword}
                    customStyles="absolute right-3 border-none text-[#64748b] text-sm font-bold uppercase"
                >
                    {showPassword ? "Hide" : "Show"} 
                </Button>
            </div>
        </div>
    );
}

export default PasswordField;