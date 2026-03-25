import React from "react";

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