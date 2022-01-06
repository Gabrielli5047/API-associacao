const knex = require('../db/connection');

async function verificarSituacaoAssociado(associado_id) {
  const verificarSituacaoassociado = await knex('cobrancas').join('associados', 'cobrancas.associado_id', '=', 'associados.id').where('associados.id', associado_id).where('cobrancas.status_cobranca', 'ilike', 'Vencida').select('associados.nome', 'cobrancas.*');

    if (verificarSituacaoassociado.length >= 1) {
      await knex('associados').update({
        status_associado: 'INADIMPLENTE'
      }).where('id', associado_id)
    } else {
      await knex('associados').update({
        status_associado: 'EM DIA'
      }).where('id', associado_id)
    }

}

module.exports = verificarSituacaoAssociado