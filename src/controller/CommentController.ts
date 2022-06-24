import {getConnection} from "typeorm";
import {Comment} from "../entity/Comment";
import {Board} from "../entity/Board";
import {User} from "../entity/User";

export class CommentController {
    static addComment = async (req, res) => {
        const {board_id, content, user_id} = req.body;
        const board = await getConnection().getRepository(Board).findOne({id: board_id});
        const user = await getConnection().getRepository(User).findOne({id: user_id});

        const comment = new Comment();
        comment.content = content;
        comment.board = board;
        comment.user = user;
        await getConnection().getRepository(Comment).save(comment);

        res.send(comment);
    }

    // board의 id에 해당하는 comment 페이지네이션
    static findAllComment = async (req, res) => {
        const {board_id, page_number, page_size} = req.query;

        const options = {};
        options['select'] = ["id", "content", "created", "updated"];
        options['order'] = {id: 'DESC'};
        options['relations'] = ['user', 'board']
        options['where'] = [{boardId: board_id}]
        // page_number와 page_size 둘 중하나라도 입력하지 않으면 전체 목록 리턴
        if (page_number && page_size) {
            options['skip'] = (page_number - 1) * page_size;
            options['take'] = page_size;
        }

        const comments = await getConnection().getRepository(Comment).find(options);
        res.send(comments);
    }
    // board의 id에 해당하는 모든 comment 갯수
    static countBoardComment = async (req, res) => {
        const {board_id} = req.query;
        const total = await getConnection().getRepository(Comment).find({
            where: {boardId: board_id},
        })
        res.send({total: total.length});
    }

    static findOneComment = async (req, res) => {
        const {id} = req.query;

        const comment = await getConnection().getRepository(Comment).findOne({id});
        console.log(comment);
        res.send(comment);
    }

    static modifyComment = async (req, res) => {
        const {id, content} = req.body;

        const result = await getConnection().createQueryBuilder().update(Comment)
            .set({content})
            .where("id = :id", {id})
            .execute();

        res.send(result);
    }

    static removeComment = async (req, res) => {
        const {id} = req.query;

        const result = await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Comment)
            .where("id = :id", {id})
            .execute();

        res.send(result);
    }
}