import React from "react";
import { Link } from "react-router-dom";
import MainOnly from "../layouts/mainOnly";
import Form from "../components/Form";
import MainLogo from "../components/MainLogo";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordFields";
import Button from "../components/Button";
import useFormState from "../hooks/useFormState";

function Signup() {
    const {
        showPassword, setShowPassword,
        acceptedTerms, setAcceptedTerms
    } = useFormState();

    return (
        <MainOnly>
            <Form>
                <div className="flex flex-col items-center mb-8">
                    <MainLogo />
                    <h1 className="text-[#1e293b] font-bold text-2xl">Create Account</h1>
                    <p className="text-[#64748b] text-sm">Start managing your store with TindaCloud.</p>
                </div>
                <div className="flex gap-4">
                    <InputField
                        id="firstName"
                        label="First Name"
                        placeholder="Juan"
                        required
                    />
                    <InputField 
                        id="lastName"
                        label="Last Name"
                        placeholder="Dela Cruz"
                        required
                    />
                </div>
                <InputField 
                    id="phoneNumber"
                    label="Phone Number"
                    type="number"
                    placeholder="0912345678"
                    required
                />
                <InputField 
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    required
                />
                <PasswordField 
                    id="password"
                    variant="toggle"
                    label="Password"
                    placeholder="Create a strong password"
                    showPassword={showPassword}
                    toggleShowPassword={() => setShowPassword(!showPassword)}
                    required
                />
                <PasswordField 
                    id="retypePassword"
                    variant="toggle"
                    label="Retype Password"
                    placeholder="Confirm your password"
                    showPassword={showPassword}
                    toggleShowPassword={() => setShowPassword(!showPassword)}
                    required
                />
                <div className="flex justify-center gap-2">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <label htmlFor="terms">
                        I agree to the{" "}
                        <Link to="/terms" className="underline text-blue-600">
                            Terms and Conditions
                        </Link>
                    </label>
                </div>

                <Button
                    customStyles="w-full my-4"
                >Create my Account</Button>
                <p className="text-center">
                    Already have an account? <Link to="/login" className="text-blue-600">Log In</Link>
                </p>
            </Form>
        </MainOnly>
    )
}

export default Signup;