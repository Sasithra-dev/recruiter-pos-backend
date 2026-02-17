import { BaseRepository } from './base.repository';
import { Tag, ITag } from '../entity/tag.model';

export class TagRepository extends BaseRepository<ITag> {
    constructor() {
        super(Tag);
    }
}
