import { Result } from '../logic/Result';
import { Entity } from './Entity';
import { UniqueEntityID } from './UniqueEntityID';

export class MemberId extends Entity<any> {
    get id(): UniqueEntityID {
        return this._id;
    }

    private constructor(id?: UniqueEntityID) {
        super(null, id);
    }

    public static create(id?: UniqueEntityID): Result<MemberId> {
        return Result.ok<MemberId>(new MemberId(id));
    }
}
