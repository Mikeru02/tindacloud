import React, { useState } from "react"; // Added useState
import styles from "./styles/form.module.css";
import Logo from "../../assets/logo1.png";

function Form() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles["container"]}>
            <div className={styles["formCard"]}>
                <div className={styles["header"]}>
                    <img src={Logo} alt="TindaCloud Logo" className={styles["logo"]} />
                    <h1>TindaCloud</h1>
                    <p>Track. Sell. Grow.</p>
                </div>

                <div className={styles["inputGroup"]}>
                    <div className={styles["labelRow"]}>
                        <label htmlFor="email">Email Address</label>
                    </div>
                    <input type="email" id="email" name="email" placeholder="e.g. name@company.com" />
                </div>

                <div className={styles["inputGroup"]}>
                    <div className={styles["labelRow"]}>
                        <label htmlFor="password">Password</label>
                        <span className={styles["forgot"]}>Forgot?</span>
                    </div>
                    <div className={styles["passwordWrapper"]}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            name="password" 
                            placeholder="••••••••" 
                        />
                        <button 
                            type="button"
                            className={styles["toggleBtn"]}
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                
                <button className={styles["loginBtn"]}>Login</button>
                
                <p className={styles["footerText"]}>
                    Don't have an account? <span>Sign up</span>
                </p>
            </div>
        </div>
    );
}

export default Form;