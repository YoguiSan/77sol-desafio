import React, { useContext, useState } from 'react';
import {
  Grid,
  Row,
  Column,
  Form,
  Title,
} from 'pure-ui-react';

import { environment } from '../Config';

import SimuladorService from '../services/simulador';

import Container from './Styles';
import AppContext from '../utils/Contexts';

function IndexPage() {
  const {
    setMessageText,
    setMessageType,
    setMessageTimeout,
    setLoading,
  } = useContext(AppContext);

  const [cep, setCep] = useState();
  const [tipoEstrutura, setTipoEstrutura] = useState(null);
  const [valorConta, setValorConta] = useState();
  const [resultados, setResultados] = useState();

  const inputs = [{
    name: 'cep',
    type: 'string',
    label: 'CEP',
    value: cep,
    onChange: ({ target: { value } }) => setCep(value),
    required: true,
    errorMessage: 'Favor informar o CEP',
  }, {
    name: 'tipoEstrutura',
    type: 'select',
    options: [{
      value: null,
      text: 'Selecione',
      disabled: true,
    }, {
      text: 'Fibrocimento madeira',
      value: 'fibrocimento-madeira',
    }, {
      text: 'Fibrocimento metálico',
      value: 'fibrocimento-metalico',
    }, {
      text: 'Cerâmico',
      value: 'ceramico',
    }, {
      text: 'Metálico',
      value: 'metalico',
    }, {
      text: 'Laje',
      value: 'laje',
    }, {
      text: 'Solo',
      value: 'solo',
    }],
    label: 'Tipo de Estrutura',
    value: tipoEstrutura,
    onChange: ({ target: { value } }) => setTipoEstrutura(value),
    required: true,
    errorMessage: 'Favor selecionar um tipo de estrutura',
  }, {
    name: 'valorConta',
    type: 'number',
    label: 'Valor médio da conta',
    value: valorConta,
    onChange: ({ target: { value } }) => setValorConta(value),
    required: true,
    errorMessage: 'Favor informar o valor médio da conta',
  }];

  const submit = async () => {
    setLoading(true);

    const result = await SimuladorService.consultar(cep, valorConta, tipoEstrutura);

    setLoading(false);

    if (environment !== 'production') {
      console.log(result);
      console.log(result.name);
    }

    if (
      !result
      || (
        result.name
        && result.name === 'TypeError'
      )
    ) {
      setMessageText('Ocorreu um erro ao realizar a cotação');
      setMessageType('error');
      setMessageTimeout(1000);
    }
  };

  return (
    <Container>
      <Grid>
        <Row>
          <Column extraSmall={12}>
            <Title
              type="title"
              text="Faça sua cotação"
            />
          </Column>
        </Row>
        <Row>
          <Column
            extraSmall={12}
          >
            <Form
              inputs={inputs}
              onSubmit={submit}
              submitButtonText="Calcular"
              submitButtonColor="green"
            />
          </Column>
        </Row>
      </Grid>
    </Container>
  );
}

export default IndexPage;
