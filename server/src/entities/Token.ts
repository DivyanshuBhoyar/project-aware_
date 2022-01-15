import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { v4 as uuid } from 'uuid'

@Entity()
export class VerifictationToken extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    _token: string;

    @Column()
    _userId: string;

    @Column()
    expiresAt: Date

    @BeforeInsert()
    createToken() {
        this._token = uuid()
    }
}
