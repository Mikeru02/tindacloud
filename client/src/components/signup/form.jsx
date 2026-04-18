import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/form.module.css";
import Logo from "../../assets/logo1.png";
import useFormState from "../../hooks/useFormState";

function Form() {
    const {
        showPassword, setShowPassword,
        acceptedTerms, setAcceptedTerms
    } = useFormState();

    const handleSignup = (e) => {
        e.preventDefault();

    };

    return (
        <div className={styles["container"]}>
            {/* Wrap in a form tag to handle submission properly */}
            <form className={styles["formCard"]} onSubmit={handleSignup}>
                <div className={styles["header"]}>
                    <img src={Logo} alt="TindaCloud Logo" className={styles["logo"]} />
                    <h1>Create Account</h1>
                    <p>Start managing your store with TindaCloud.</p>
                </div>

                <div className={styles["inputRow"]}>
                    <div className={styles["inputGroup"]}>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" placeholder="Juan" required />
                    </div>
                    <div className={styles["inputGroup"]}>
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" placeholder="Dela Cruz" required />
                    </div>
                </div>

                <div className={styles["inputGroup"]}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="number" id="phoneNumber" placeholder="0912345678" required />
                </div>

                <div className={styles["inputGroup"]}>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" placeholder="name@company.com" required />
                </div>

                {/* Password Fields */}
                <div className={styles["inputGroup"]}>
                    <label htmlFor="password">Password</label>
                    <div className={styles["passwordWrapper"]}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            placeholder="Create a strong password" 
                            required
                        />
                        <button 
                            type="button"
                            className={styles["toggleBtn"]}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <div className={styles["inputGroup"]}>
                    <label htmlFor="retypePassword">Retype Password</label>
                    <div className={styles["passwordWrapper"]}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="retypePassword" 
                            placeholder="Confirm your password" 
                            required
                        />
                        <button 
                            type="button"
                            className={styles["toggleBtn"]}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <div className={styles["checboxGroup"]}>
                    <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <label htmlFor="terms">
                        I agree to the{" "}
                        <Link to="/terms" className={styles["span-tc"]}>
                            Terms and Conditions
                        </Link>
                    </label>
                </div>
                
                <button type="submit" className={styles["signupBtn"]}>
                    Create My Account
                </button>
                
                <p className={styles["footerText"]}>
                    Already have an account? <Link to="/login" className={styles["span"]}>Log In</Link>
                </p>
            </form>
        </div>
    );
}

export default Form;