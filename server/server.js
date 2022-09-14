const express    = require('express');
const dbconfig   = require('./database.js')();
const connection = dbconfig.init(); // DB 연결
const app = express(); // express 모듈 불러오기
const cors = require('cors'); // cors 사용
const bodyParser = require('body-parser'); // bady-parser 사용

// configuration 
// React 클라이언트의 포트는 5000이므로 포트 분리
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(bodyParser.json());

// routing (매핑)

// 유저 정보 가지오기 (get방식, response)
app.get('/call', (req, res) => {                  
  connection.query('SELECT * FROM user', (error, rows) => {  //쿼리문 
    if (error){
        console.log(error);
    }
    res.send(rows);
    });
});

// 유저 회원가입 처리 (post방식, request)
app.post('/signup-action', (req, res) => {
    const query = `INSERT INTO USER(user_name, user_email, user_password, created_date) VALUES ( '${req.body.user.userName}','${req.body.user.userEmail}','${req.body.user.userPassword}',NOW())`;
    connection.query(query, (error) => {
        // 쿼리 날릴 때 에러 발생하면
        if(error){
            console.log("회원가입 처리 에러", error);
        }else{
            // 성공 시
            console.log("회원가입 성공");
        }
    })
})

// 유저 정보 보내기 (post방식, request)
app.post('/login-action', (req, res) => {
    const email = req.body.email;
    const password = req.body.pwd;
    let query = `INSERT INTO USER(user_email, user_password, created_date) VALUES ('${email}','${password}', NOW())`;
    connection.query(query, (error) =>{
        if(error){
            console.log(error);
        }else{
            console.log("성공적으로 처리되었습니다.");
        }
    });
});


app.listen(app.get('port'), () => {
    console.log('포트 넘버 : ' + app.get('port') + "에서 실행 중");
});