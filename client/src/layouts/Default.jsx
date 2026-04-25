import React from "react";

function DefaultLayout({ headerContent, footerContent, children }) {
	return (
		<>
			{headerContent}
			<main className="px-2">{children}</main>
			{footerContent}
		</>
	);
}

export default DefaultLayout;