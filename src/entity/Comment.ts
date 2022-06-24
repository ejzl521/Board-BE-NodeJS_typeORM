import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Board} from "./Board";
import {User} from "./User";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    content: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @ManyToOne(type => Board, board => board.comments, {onDelete: 'CASCADE', onUpdate: "CASCADE"})
    board: Board;

    @ManyToOne(type => User, user => user.comments)
    user: User;

    @Column()
    boardId: string
}