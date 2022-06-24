import {Router} from "express";
import {ImageController} from "../controller/ImageController";

const routes = Router();
routes.get('/view/:board_id', ImageController.viewImage);
export default routes;
