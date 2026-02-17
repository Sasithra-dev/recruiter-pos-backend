import { BaseRepository } from './base.repository';
import { TagColor, ITagColor } from '../entity/tag-color.model';

export class TagColorRepository extends BaseRepository<ITagColor> {
    constructor() {
        super(TagColor);
    }
}
