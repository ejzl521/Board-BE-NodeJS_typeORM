import {compareSync, hashSync} from "bcryptjs";
import {User} from "../entity/User";
import {Role} from "../entity/Role";
import {getConnection} from "typeorm";
import jwt from 'jsonwebtoken';

export class AuthController {
    static signUp = async (req, res) => {
        const {email, password, username, roles} = req.body;

        const user = new User();
        user.email = email;
        // 패스워드 복호화
        user.password = hashSync(password, 8);
        user.username = username;

        // 이메일 중복 체크
        const existUser = await getConnection().getRepository(User)
            .findOne({where: {email}});

        if (existUser) {
            return res.status(400).send({ message: "이미 존재하는 이메일입니다" });
        }
        // 닉네임 중복 체크
        const existUsername = await getConnection().getRepository(User)
            .findOne({where:{username}});
        if (existUsername) {
            return res.status(400).send({message: "이미 존재하는 닉네임입니다"});
        }

        user.roles = [];

        // body에 role을 넣으면 설정해주고 그렇지 않으면 디폴트로 'ROLE-USER'로 설정
        if (roles && roles.length > 0) {
            // where a 혹은 b or 조건 [{ name: 'a'}, {name: 'b'}]
            const res = await getConnection().getRepository(Role).find({
                where: roles.map(name => ({name}))
            })
            user.roles = res;
        } else {
            // 기본 role은 USER
            const res = await getConnection().getRepository(Role).find({
                where: {name: 'ROLE_USER'}
            })
            user.roles = res;
        }

        const result = await getConnection().getRepository(User).save(user);

        res.send(result);
    }

    static signIn = async (req, res) => {
        const {email, password} = req.body;

        const user = await getConnection().getRepository(User)
            .findOne({relations: ["roles"], where: {email}});

        if (!user) {
            return res.status(400).send({ message: "존재하지 않는 이메일입니다" });
        }

        if (!compareSync(password, user.password)) {
            return res.status(400).send({ message: "비밀번호가 일지하지 않습니다" });
        }

        // token 생성
        const token = jwt.sign({ jti: user.id, email: user.email, roles: user.roles.map(role => role.name) },
            process.env.secret, {
                subject: user.username,
                algorithm: 'HS512',
                expiresIn: process.env.expirationSecondMs
            });

        res.send({jwt: token});
    }
}