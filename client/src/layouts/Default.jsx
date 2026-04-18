import React from "react";

import styles from "./styles/Default.module.css";

function DefaultLayout({ headerContent, footerContent, children }) {
	return (
		<>
			{headerContent}
			<main>{children}</main>
			{footerContent}
		</>
	);
}

export default DefaultLayout;