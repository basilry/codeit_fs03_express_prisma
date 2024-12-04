const prisma = require('../../prisma/prismaClient');

// GET /todo_list - 모든 Todo 조회
exports.getTodoList = async (req, res) => {
    try {
        const todos = await prisma.todo.findMany(); // 모든 Todo 조회
        res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};
