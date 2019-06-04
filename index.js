const express = require('express')

const db = require('./data/db')

const port = 4000

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.send('Welcome to the server')
})

server.get('/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({
                error: 'The users information could not be retrieved.'
            })
        })
})

server.get('/users/:id', (req, res) => {
    const {id} = req.params
    db.findById(id)
        .then(user => {
            if(user) {
                res.status(200).json({user})
            } else {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist.',
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'The user information could not be retrieved.'
            })
        })
})

server.post('/users', (req, res) => {
    const user = req.body
    db.insert(user)
        .then(newUser => {
            if(req.body.name && req.body.bio) {
                res.status(201).json({newUser})
            } else {
                res.status(400).json({ 
                    success: false,
                    errorMessage: 'Please provide name and bio for user',
                    newUser
                })
            }
        })  
        .catch(err => {
            res.status(500).json({
                error: 'There was an error while saving the user to the database'
            })
        })
})

server.delete('/users/:id', (req, res) => {
    const {id} = req.params
    db.remove(id)
        .then(deleted => {
            if(deleted) {
                res.status(204).end()
            } else {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'The user could no be removed'
            })
        })
})

server.put('/users/:id', (req, res) => {
    const {id} = req.params
    const user = req.body

    if(user.name && user.bio){
        db.update(id, user)
            .then(updated => {
                if(updated) {
                    res.status(200).json({updated})
                } else {
                    res.status(404).json({
                        errorMessage: 'The user with the specified ID does not exist'
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'The user information could not be modified'
                })
            })
    } else {
        res.status(400).json({
            message: 'Please provide name and bio for the user'
        })
    }

    // db.update(id, user)
    //     .then(updated => {
    //         if(updated) {
    //             if(user.name && user.bio) {
    //                 return res.status(200).json({updated})
    //             } else {
    //                 return res.status(400).json({
    //                     errorMessage: 'Please provide name and bio for the user.'
    //                 })
    //             }
    //         } else {
    //             return res.status(404).json({
    //                 message: 'The user with the specified ID does not exist'
    //             })
    //         }
    //     })
    //     .catch(err => {
    //         return res.status(500).json({
    //             error: 'The user information could not be modified'
    //         })
    //     })
})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})