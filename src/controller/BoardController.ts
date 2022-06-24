// board entity
import {Board} from "../entity/Board";
// user entity
import {User} from "../entity/User";
// image Entity
import {Image} from "../entity/Image";

import {getConnection} from "typeorm";

export class BoardController {
    static addBoard = async (req, res) => {

        // board 저장
        const {title, content, user_id} = req.body;
        const user = await getConnection().getRepository(User).findOne({id: user_id});
        const board = new Board();
        board.title = title;
        board.content = content;
        board.user = user;
        const result = await getConnection().getRepository(Board).save(board)

        // image 저장 one-to-one 관계인 board 저장
        let image: Image = new Image();
        image.data = req.file.buffer;
        image.original_name = req.file.originalname;
        image.mimetype = req.file.mimetype;
        image.board = result;
        await getConnection().getRepository(Image).save(image);

        res.send({"message": "success!"})
    }


    static findAllBoard = async (req, res) => {
        const {page_number, page_size} = req.query;

        const options = {};
        options['select'] = ["id", "title", "content", "created", "updated"];
        options['order'] = {id: 'DESC'};
        options['relations'] = ['user']

        // page_number와 page_size 둘 중하나라도 입력하지 않으면 전체 목록 리턴
        if (page_number && page_size) {
            options['skip'] = (page_number - 1) * page_size;
            options['take'] = page_size;
        }

        const boards = await getConnection().getRepository(Board).find(options);
        res.send(boards);
    }

    static findOneBoard = async (req, res) => {
        const {id} = req.params;
        const board = await getConnection().getRepository(Board).findOne({relations: ['user'], where: {id}});
        res.send(board);
    }

    static countBoard = async (req, res) => {
        const total = await getConnection().getRepository(Board).count();
        res.send({total});
    }
    // user가 등록한 board 가져오기
    static findAllUserBoard = async (req, res) => {
        const {user_id, page_number, page_size} = req.query;

        const options = {};
        options['select'] = ["id", "title", "content", "created", "updated"];
        options['order'] = {id: 'DESC'};
        options['relations'] = ['user'];
        options['where'] = {userId: user_id};

        // page_number와 page_size 둘 중하나라도 입력하지 않으면 전체 목록 리턴
        if (page_number && page_size) {
            options['skip'] = (page_number - 1) * page_size;
            options['take'] = page_size;
        }
        const boards = await getConnection().getRepository(Board).find(options);
        res.send(boards);
    }
    // user가 등록한 board 갯수
    static countUserBoard = async (req, res) => {
        const {user_id} = req.params;
        const total = await getConnection().getRepository(Board).find({
            where: {userId: user_id},
        })
        res.send({total: total.length});
    }

    static modifyBoard = async (req, res) => {
        // 수정할 board의 id, title, content
        const {id, title, content} = req.body;
        const updateOption = {
            "title": title,
            "content": content
        };
        // board 먼저 수정
        const result = await getConnection().createQueryBuilder().update(Board)
            .set(updateOption)
            .where("id = :id", {id})
            .execute();

        // formData에 파일이 있으면 파일 수정!
        if (req.file) {
            const imageUpdateOption = {
                data: req.file.buffer,
                original_name: req.file.originalname,
                mimetype: req.file.mimetype
            }
            const result = await getConnection().createQueryBuilder().update(Image)
                .set(imageUpdateOption)
                .where("board_id = :id", {id})
                .execute();
        }
        res.send({"message": "success!"});
    }

    static removeBoard = async (req, res) => {
        const {id} = req.params;

        const result = await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Board)
            .where("id = :id", {id})
            .execute();

        res.send(result);
    }
}