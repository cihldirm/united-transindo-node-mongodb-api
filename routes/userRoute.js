module.exports = app => {
	const users = require('../controllers/userContoller')
	const r = require('express').Router()

	r.get('/', users.showAll)
	r.get('/:username', users.detail)
	r.post('/', users.create)
	r.put('/:id', users.update)
	r.delete('/:id', users.delete)

	app.use('/users', r)
}
