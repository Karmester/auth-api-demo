const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());

const users = require("./users.json");

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/api/signup", (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res.sendStatus(400);
	}

	for (let user of users) {
		if (user.username === req.body.username) {
			return res.sendStatus(409);
		}
	}

	const newUser = {
		username: req.body.username,
		password: req.body.password,
		todoList: [],
	};

	users.push(newUser);
	fs.writeFileSync("./users.json", JSON.stringify(users, null, 4));
	res.sendStatus(200);
});

app.get("/api/todo", (req, res) => {
	const authHeader = req.header("Authorization");
	if (!authHeader) return res.sendStatus(401);

	const credentials = authHeader.split("&&&");
	const username = credentials[0];
	const password = credentials[1];
	const user = users.find(
		(user) => username === user.username && password === user.password
	);
	if (!user) return res.sendStatus(401);

	return res.json(user.todoList);
});

app.post("/api/todo", (req, res) => {
	const authHeader = req.header("Authorization");
	if (!authHeader) return res.sendStatus(401);

	const credentials = authHeader.split("&&&");
	const username = credentials[0];
	const password = credentials[1];
	const user = users.find(
		(user) => username === user.username && password === user.password
	);
	if (!user) return res.sendStatus(401);

	if (!req.body.msg) return res.sendStatus(400);
	user.todoList.push(req.body.msg);
	fs.writeFileSync("./users.json", JSON.stringify(users, null, 4));
	res.sendStatus(200);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
