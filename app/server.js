const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = 3080;

app.use(cors({
    origin: 'http://localhost:3000', // 허용할 도메인
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
    credentials: true, // 쿠키 및 인증 정보 포함 허용
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(
    session({
        secret: "mySecret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        },
    })
);


// todoList 라우터 기능 추가
const todoListRouter = require('./routes/todoListRouter');
const todoDetailRouter = require('./routes/todoDetailRouter');
const authRouter = require('./routes/authRouter');

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.use('/todo_list', todoListRouter);
app.use('/todo_detail', todoDetailRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
