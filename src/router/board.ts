import {Router} from "express";
import {BoardController} from "../controller/BoardController";
// 인증 미들웨어
import {AuthMiddleware} from "../middleware/AuthMiddleware";
// multer
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()})

const routes = Router();
routes.post('', AuthMiddleware.verifyToken, upload.single('file'), BoardController.addBoard);
routes.get('/list', BoardController.findAllBoard);
routes.get('/count', BoardController.countBoard);
routes.get('/:id', BoardController.findOneBoard);
// user가 등록한 board 전체 갯수
routes.get('/user/count/:user_id', AuthMiddleware.verifyToken, BoardController.countUserBoard);
// user가 등록한 board 가져오기
routes.get('/user/list/', AuthMiddleware.verifyToken, BoardController.findAllUserBoard);
routes.put('', AuthMiddleware.verifyToken, upload.single('file'), BoardController.modifyBoard);
routes.delete('/:id', AuthMiddleware.verifyToken, BoardController.removeBoard);

export default routes;