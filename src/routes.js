const express = require('express');
const { userRegister, userDetail, userUpdate} = require('./controllers/users');
const tokenVerify = require('./auth/tokenVerify');
const { login } = require('./controllers/login');
const { 
    associadoRegister, 
    associadoDetail, 
    updateassociado, 
    listassociados, 
    associadoDelete } = require('./controllers/associados');
const { 
    cadastrarCobranca,
    listarCobrancas,
    editarCobrancas,
    listarCobrancasPorAssociado,
    detalharCobranca,
    excluirCobranca,
    listarCobrancasPorStatus,
    listarCobrancasPorUser
} = require('./controllers/cobrancas');


const routes = express();

routes.post('/register', userRegister);
routes.post('/login', login);
routes.get('/', (req, res)=>{
    res.status(200).json({message: "servidor ok"})
});

routes.use(tokenVerify);
routes.get('/user', userDetail);
routes.put('/user', userUpdate);

routes.post('/associado', associadoRegister);
routes.delete('/associado/:id', associadoDelete);
routes.get('/associado/:id', associadoDetail);
routes.put('/associado/:id', updateassociado);
routes.get('/associados', listassociados);

routes.post('/cobranca', cadastrarCobranca);
routes.put('/cobrancas/:id', editarCobrancas)
routes.delete('/cobranca/:id', excluirCobranca)
routes.get('/cobrancas', listarCobrancas);
routes.get('/cobrancasUser', listarCobrancasPorUser);
routes.get('/cobrancas-iniciais', listarCobrancasPorStatus);
routes.get('/cobrancas/:id', listarCobrancasPorAssociado)
routes.get('/detalharcobranca/:id', detalharCobranca)

module.exports = routes;
