const express = require('express')
const fs = require('fs')
const jsonwebtoken = require('jsonwebtoken')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const util = require('util')

const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const usersRouter = require('./routes/users')
const genericRouter = require('./routes/genericRouter')
const pricesRouter = require('./routes/prices')

const error = require('./error')

mongoose.connect('mongodb://localhost/server', {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
})

const readFile = util.promisify(fs.readFile)
const verify = util.promisify(jsonwebtoken.verify)

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    if (req.query.format === 'xml')
        next(new error.BadRequestError('xml is not supported'))
    else
        next()
})

app.use((req, res, next) => {
    if (req.originalUrl.split('/').length > 3) {
        req.endpoint = req.originalUrl.split('/')[3].split('?')[0]
        req.schema = req.endpoint.replace(req.endpoint[0], req.endpoint[0].toUpperCase()).slice(0, req.endpoint.lastIndexOf('s'))
    }
    next()
})

app.get(/.*/, queryCleanser)
app.post(/\/logout/, authenticatedUser)
app.post(/\/users/, bodyCleanser)
app.post(/\/products|\/shops|\/prices/, [authenticatedUser, bodyCleanser])
app.put(/.*/, [authenticatedUser, bodyCleanser])
app.patch(/.*/, [authenticatedUser, patchBodyChecker, bodyCleanser])
app.delete(/.*/, authenticatedUser)

app.use('/observatory/api/login', loginRouter)
app.use('/observatory/api/logout', logoutRouter)
app.use('/observatory/api/users', usersRouter)
app.use('/observatory/api/products', genericRouter)
app.use('/observatory/api/shops', genericRouter)
app.use('/observatory/api/prices', pricesRouter)

app.use((err, req, res, next) => {
    console.error(err.stack)
    if (!('status' in err))
        err.status = 400
    if (err.status === 500)
        err.message = undefined
    res.status(err.status).json({
        name: err.name,
        message: err.message
    })
})

async function authenticatedUser(req, res, next) {
    try {
        const token = req.get('x-observatory-auth')
        const data = await readFile(path.resolve(__dirname, 'controllers/secret'))
        await verify(token, data)
        next()
    } catch (err) {
        next(new error.UnauthorizedError(err))
    }
}

function bodyCleanser(req, res, next) {
    delete req.body.withdrawn
    delete req.body._id
    next()
}

function queryCleanser(req, res, next) {
    req.query.start = Number(req.query.start) || 0
    req.query.count = Number(req.query.count) || 20;
    [req.query.sortKey, req.query.sortValue] = 'sort' in req.query ?
        req.query.sort.replace(/id/, '_id').split(/\|/) :
        (req.endpoint === 'prices' ? ['price', 'ASC'] : ['_id', 'DESC'])
    next()
}

function patchBodyChecker(req, res, next) {
    if (Object.keys(req.body).length > 1)
        next(new error.BadRequestError('patch allows updates on one field only'))
    else
        next()
}

module.exports = app