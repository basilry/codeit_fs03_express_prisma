const express = require('express');
const router = express.Router();
const todoListController = require('../controllers/todoListController');

// GET /todoList/:user_id
router.get('/:user_id', todoListController.getTodoList);

module.exports = router;