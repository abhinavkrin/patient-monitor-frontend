/* eslint-disable react/no-unknown-property */
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document({}) {
	return (
		<Html>
			<Head>
				<link rel="icon" href="/logo128.png" type="image/png" sizes='any'/>
				<meta charset="utf-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
				<meta name="description" content="description of your project" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/apple-icon.png"></link>
				<meta name="theme-color" content="#00897b"></meta>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}