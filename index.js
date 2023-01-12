
function main(){
	const express = require('express');
	const app = express();
	require('dotenv').config();
	const port = process.env.PORT || 3000;

	app.listen(port, () => console.log(`app listening at ${port}`));
	app.use(express.static('public'));
	app.use(express.json({limit: '100mb'}));
}

main();