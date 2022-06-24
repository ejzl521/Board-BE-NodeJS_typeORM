import {Image} from "../entity/Image";
import {getConnection} from "typeorm";

export class ImageController {
    static viewImage = async (req, res) => {
        const {board_id} = req.params;
        const db = getConnection()
            .getRepository(Image)
            .createQueryBuilder('image')
            .where('board_id = :board_id', {board_id})
        const image = await db.getOne();

        res.writeHead(200, {
            'Content-Type': image.mimetype,
            'Content-Length': image.data.length
        });

        res.end(image.data);
    }
}