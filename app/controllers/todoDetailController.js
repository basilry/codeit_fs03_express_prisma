const prisma = require('../../prisma/prismaClient');

// POST /todo_detail/:id - 새로운 Todo 생성
exports.createTodo = async (req, res) => {
    const { user_id } = req.params;
    const { title, description } = req.body;

    // 필수 데이터 검증
    if (!title || !description || !user_id) {
        return res.status(400).json({ error: 'Title and description and id are required' });
    }

    try {
        const newTodo = await prisma.todo.create({
            data: { title, description, user_id, completed: false },
        });
        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
};

// PUT /todo_detail/:user_id/:todo_id'- 특정 Todo 업데이트
exports.updateTodo = async (req, res) => {
    const { user_id, todo_id } = req.params;
    const { title, description, completed } = req.body;

    try {
        const updatedTodo = await prisma.todo.update({
            where: { user_id, todo_id: Number(todo_id) },
            data: { title, description, completed },
        });

        res.status(200).json(updatedTodo);
    } catch (error) {
        if (error.code === '404') {
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

// PUT /todo_detail/:user_id/:todo_id/ok' - 특정 Todo 완료
exports.completeTodo = async (req, res) => {
    const { user_id, todo_id } = req.params;

    try {
        const todo_detail = await prisma.todo.findUnique({
            where: {
                todo_id: Number(todo_id), user_id: user_id,
            },
        });

        if (!todo_detail) {
            return res.status(404).json({ error: 'Todo not found or unauthorized' });
        }

        const updatedTodo = await prisma.todo.update({
            where: { user_id, todo_id: Number(todo_id) },
            data: { completed: !todo_detail.completed },
        });

        res.status(200).json(updatedTodo);
    } catch (error) {
        if (error.code === '404') {
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to complete todo' });
    }
};

// DELETE /todoList/:user_id/:todo_id' - 특정 Todo 삭제
exports.deleteTodo = async (req, res) => {
    const { user_id, todo_id } = req.params;

    try {
        const deletedTodo = await prisma.todo.delete({
            where: { user_id, todo_id: Number(todo_id) },
        });

        res.status(200).json({ message: 'Todo deleted successfully', deletedTodo });
    } catch (error) {
        if (error.code === '404') {
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
};