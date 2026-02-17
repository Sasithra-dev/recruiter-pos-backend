import { BaseRepository } from './BaseRepository';
import { Tag, ITag } from '../entities/TagModel';

export class TagRepository extends BaseRepository<ITag> {
    constructor() {
        super(Tag);
    }
}
