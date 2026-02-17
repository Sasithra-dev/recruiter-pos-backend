import { BaseRepository } from './BaseRepository';
import { TagColor, ITagColor } from '../entities/TagColorModel';

export class TagColorRepository extends BaseRepository<ITagColor> {
    constructor() {
        super(TagColor);
    }
}
