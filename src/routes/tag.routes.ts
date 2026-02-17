import express from 'express';
import {
    createTag,
    getTags,
    updateTag,
    deleteTag,
    getTagColors,
    createTagColor,
    deleteTagColor
} from '../controller/tag.controller';

const router = express.Router();

// Tag Routes
router.post('/', createTag);
router.get('/', getTags);
router.patch('/:id', updateTag);
router.delete('/:id', deleteTag);

// Tag Color Routes
router.get('/colors', getTagColors);
router.post('/colors', createTagColor);
router.delete('/colors/:id', deleteTagColor);

export default router;
