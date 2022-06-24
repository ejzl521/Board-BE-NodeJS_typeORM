import express from 'express';
import {createConnection} from "typeorm";
import routes from "./router";

let app = express();
// x-www-form-urlencoded를 파싱
app.use(express.urlencoded({
    extended: true
}))

// body-parser는 내장되어있음. json 파싱하기 위해서 설정만 추가
app.use(express.json());
app.use('/api', routes);

createConnection().then(connection => {
    app.listen(8080, () => {
        console.log('server is listening 8080');
    });
});