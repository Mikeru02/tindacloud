import React from "react";
import { Link } from "react-router-dom";
import MainOnly from "../layouts/mainOnly";
import Form from "../components/Form";
import MainLogo from "../components/MainLogo";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordFields";
import Button from "../components/Button";
import useFormState from "../hooks/useFormState";

function Login() {
	const {
		showPassword, setShowPassword
	} = useFormState();

	return (
		<MainOnly>
			<Form>
				<div className="flex flex-col items-center mb-8">
                    <MainLogo />
                    <h1 className="text-[#1e293b] font-bold text-2xl">TindaCloud</h1>
                    <p className="text-[#64748b] text-sm">Track. Sell. Grow.</p>
                </div>
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
					placeholder="••••••••"
					showPassword={showPassword}
					toggleShowPassword={() => setShowPassword(!showPassword)}
					required
				/>
				<Button
					type="submit"
                    customStyles="w-full my-4"
                >Login my Account</Button>

				<p className="text-center">
                    Don't have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link>
                </p>
			</Form>
		</MainOnly>
	);
}

export default Login;