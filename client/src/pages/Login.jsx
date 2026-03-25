import React from "react";
import MainOnly from "../layouts/mainOnly";

function Login() {
	return (
		<MainOnly>
			<div className="bg-white p-8 rounded shadow-md w-96">
				<h1 className="text-2xl font-bold mb-6 text-center">TindaCloud Login</h1>
				<input
				type="text"
				placeholder="Username"
				className="w-full mb-4 p-2 border rounded"
				/>
				<input
				type="password"
				placeholder="Password"
				className="w-full mb-6 p-2 border rounded"
				/>
				<button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
				Login
				</button>
			</div>
		</MainOnly>
	);
}

export default Login;