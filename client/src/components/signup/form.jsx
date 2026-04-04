import React, { useState, useRef } from "react"; // Added useRef
import ReCAPTCHA from "react-google-recaptcha"; // 1. Import the library
import styles from "./styles/form.module.css";
import Logo from "../../assets/logo1.png";

function Form() {
    const [showPassword, setShowPassword] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null); // 2. State to store the token
    const recaptchaRef = useRef(null);

    // 3. Handle captcha change
    const onCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    const handleSignup = (e) => {
        e.preventDefault();
        
        if (!captchaToken) {
            alert("Please complete the 'I am not a robot' check.");
            return;
        }

        // Proceed with your API call here
        console.log("Form submitted with captcha:", captchaToken);
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
                
                {/* 4. The reCAPTCHA Widget */}
                <div className={styles["captchaWrapper"]}>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // Replace with your real Site Key
                        onChange={onCaptchaChange}
                    />
                </div>
                
                <button type="submit" className={styles["signupBtn"]}>
                    Create My Account
                </button>
                
                <p className={styles["footerText"]}>
                    Already have an account? <span>Log in</span>
                </p>
            </form>
        </div>
    );
}

export default Form;