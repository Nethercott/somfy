const request = require('request-promise');
const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;


const { consumerKey, consumerSecret, redirect} = require('./auth.json');

app.get('/', (req, res) => {
	res.redirect(
		`https://accounts.somfy.com/oauth/oauth/v2/auth?response_type=code&client_id=${consumerKey}&redirect_uri=${encodeURIComponent(redirect)}&state=${generateID()}&grant_type=authorization_code`
	);
});

app.get('/auth', (req, res) => {
	const state = req.query.state;
	const code = req.query.code;
	console.log(state);
	console.log(code);
	console.log(req.body);
	const url = `https://accounts.somfy.com/oauth/oauth/v2/token?client_id=${consumerKey}&client_secret=${consumerSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirect)}&state=${state}`;
	request({
		method: 'get',
		url: url,
		json: true,
		simple: true,
	}).then(tokenRES => {
		console.log(tokenRES);

	}).catch(err => {
		// console.error(err);
		// get new key.
		res.redirect(
			`https://accounts.somfy.com/oauth/oauth/v2/auth?response_type=code&client_id=${consumerKey}&redirect_uri=${encodeURIComponent(redirect)}&state=${generateID()}&grant_type=authorization_code`
		);
	});
	res.send(`Your State: ${state} and Code: ${code}`);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function generateID() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < 16; i++) {text += possible.charAt(Math.floor(Math.random() * possible.length));}

	return text;
}
