import {Router} from "express";
import {CommentController} from "../controller/CommentController";
// 인증 미들웨어
import {AuthMiddleware} from "../middleware/AuthMiddleware";

const routes = Router();

routes.post('', AuthMiddleware.verifyToken, CommentController.addComment);
routes.get('/list',CommentController.findAllComment);
// 쿼리 파라미터로 board의 id를 받아서 해당하는 id의 board의 전체 comment 갯수
routes.get('/count', CommentController.countBoardComment);
routes.get('', CommentController.findOneComment);
routes.put('', AuthMiddleware.verifyToken, CommentController.modifyComment);
routes.delete('', AuthMiddleware.verifyToken, CommentController.removeComment);

export default routes;