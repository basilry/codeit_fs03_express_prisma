const express = require('express');
const router = express.Router();
const todoDetailController = require('../controllers/todoDetailController');

// POST /todo_detail/:user_id
router.post('/:user_id', todoDetailController.createTodo);

// PUT /todo_detail/:user_id/:todo_id
router.put('/:user_id/:todo_id', todoDetailController.updateTodo);

// PUT /todo_detail/:user_id/:todo_id/ok
router.put('/:user_id/:todo_id/ok', todoDetailController.completeTodo);

// DELETE /todo_detail/:user_id/:todo_id
router.delete('/:user_id/:todo_id', todoDetailController.deleteTodo);


module.exports = router;