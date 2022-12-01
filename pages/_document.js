import { Html, Head, Main, NextScript } from 'next/document'

export default function Document({}) {
	return (
		<Html>
			<Head>
				<link rel="icon" href="/logo128.png" type="image/png" sizes='any'/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}