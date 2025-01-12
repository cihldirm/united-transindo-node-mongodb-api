const db = require('../models')
const Users = db.users


exports.showAll = (req, res) => {
	Users.find()
		.then(data => res.send(data))
		.catch(err => res.status(500).send({message: err.message}))
}

exports.detail = (req, res) => {
	const username = req.params.username
	Users.findOne({namaPengguna: username})
		.then(data => res.send(data))
		.catch(err => res.status(500).send({message: err.message}))
}

exports.create = (req, res) => {
	req.body.tanggalLahir = new Date(req.body.tanggalLahir)
	Users.create(req.body)
		.then(() => res.send({message: "Tersimpan"}))
		.catch(err => res.status(500).send({message: err.message}))
}

exports.update = (req, res) => {
	const id = req.params.id
	req.body.tanggalLahir = new Date(req.body.tanggalLahir)
	Users.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
		.then(data => {
			if (!data) res.status(404).send({message: "Update Gagal"})
			res.send({message: "Update Berhasil", data})
		})
		.catch(err => res.status(500).send({message: err.message}))
}

exports.delete = (req, res) => {
	const id = req.params.id
	req.body.tanggalLahir = new Date(req.body.tanggalLahir)
	Users.findByIdAndRemove(id)
		.then(data => {
			if (!data) res.status(404).send({message: "Delete Gagal"})
			res.send({message: "Delete Berhasil", data})
		})
		.catch(err => res.status(500).send({message: err.message}))
}
