const knex = require('../db/connection');
const { associadoRegisterUpdateSchema } = require('../schemas/schemas');

const associadoRegister = async (req, res) => {
  const { nome, email, telefone, posicao } = req.body;
  const { id } = req.user;

  try {
    await associadoRegisterUpdateSchema.validate(req.body);
    const verificarEmailExiste = await knex('associados').where({email}).first();
    const verificarTelefoneExiste = await knex('associados').where({telefone}).first();

    if(verificarEmailExiste || verificarTelefoneExiste) {
      return res.status(400).json({status: 400, message: "Já existe um Associado com estes dados!"})
    }

    const { rowCount } = await knex('associados').insert({
      nome,
      email,
      usuario_id: id,
      telefone,
      posicao
    });

    if (rowCount === 0) {
      return res.status(404).json({ status: 404, message: "Ocorreu um erro ao cadastrar o Associado!" })
    }

    return res.status(201).json({ status: 201, message: "Associado cadastrado com sucesso!" });
  } catch (error) {
    return res.json(error.message);
  }
};

const associadoDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const associadoDetalhado = await knex('associados').where({ id })

    if (associadoDetalhado.length === 0) {
      return res.status(400).json({ status: 400, message: "Falha ao encontrar o associado!" })
    }

    return res.status(200).json({ status: 200, associadoDetalhado })
  } catch (error) {
    return res.json(error.message)
  }
};

const updateassociado = async (req, res) => {
  const { id: associadoId } = req.params;
  const { nome, email, telefone, posicao} = req.body;
 
  try {
    await associadoRegisterUpdateSchema.validate(req.body);
    
    const existeEmail = await knex('associados').where({email});
    const existeTelefone = await knex('associados').where({telefone});
    
    if( existeEmail[0] && existeEmail[0].id === associadoId ){
      return res.status(400).json(
        {
          status: 400,
          mensagem: "Já existe usuário cadastrado com o e-mail informado."
        });
    }
    if( existeTelefone[0] && existeTelefone[0].id === associadoId ){
      return res.status(400).json(
        {
          status: 400,
          mensagem: "Já existe usuário cadastrado com o telefone informado."
        });
    }
  

    const associadoAtual = await knex('associados').where('id', associadoId);
    const { nome: nomeAtual, email: emailAtual, cpf: cpfAtual, telefone: telefoneAtual, logradouro: logradouroAtual, complemento: complementoAtual, cep: cepAtual, bairro: bairroAtual, cidade: cidadeAtual, uf: ufAtual } = associadoAtual[0];

    const associadoAtualizado = await knex('associados').update({
      nome,
      email,
      telefone,
      posicao
      // uf: uf || ufAtual
    }).where('id', associadoId);

    if (associadoAtualizado.length === 0) {
      return res.status(400).json({ status: 400, message: "Falha ao encontrar o associado!" })
    }

    return res.status(201).json({status: 201, message: "Associado atualizado com sucesso!"})

  } catch (error) {
    return res.json(error.message)
  }
};

const listassociados = async (req, res) => {
  try {
    const associadosListados = await knex('associados').returning('*')
    const associadosEmDia = await knex('associados').where('status_associado', 'EM DIA').returning('*')
    const associadosInadimplentes = await knex('associados').where('status_associado', 'INADIMPLENTE').returning('*')


    if(associadosListados.length === 0) {
      return res.status(400).json({status: 400, message: "Nenhum associado encontrado"})
    }

    return res.status(200).json({status: 200, associados: associadosListados, associadosEmDia, associadosInadimplentes});
  } catch (error) {
    return res.json(error.message)
  }
}

const associadoDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const associado = await knex('associados').where({ id })

    if (associado.length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'Não existe este associado.'
      })
    }

      const { rowCount } = await knex('associados').delete().where({ id });
      if (rowCount === 0) {
        return res.status(404).json({
          status: 404,
          message: 'Falha ao excluir o associado.'
        });
      }
    
    return res.status(200).json({
      status: 200,
      message: 'Associado excluído com sucesso.',
      associado: associado[0]
    });

  } catch (error) {
    return res.status(400).json({
      status: 400,
      erro: error.message
    });
  }
}

module.exports = {
  associadoRegister, 
  associadoDetail, 
  updateassociado, 
  listassociados,
  associadoDelete
}
