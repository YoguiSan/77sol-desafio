import React, { useContext, useState } from 'react';
import {
  Grid,
  Row,
  Column,
  Form,
  Title,
  Image,
  Accordion,
  Input,
  Card,
} from 'pure-ui-react';

import { environment } from '../Config';

import SimuladorService from '../services/simulador';

import Container from './Styles';
import AppContext from '../utils/Contexts';
import { Colors } from '../assets/json';
import { replaceSpecialCharacters } from 'formatadores';

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
  const [parcelamentoSelecionado, setParcelamentoSelecionado] = useState(0);
  const [valorTotal, setValorTotal] = useState();

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
    const equipamentos = [];

    const opcoesParcelas = [];

    setLoading(true);

    const result = await SimuladorService.consultar(cep, valorConta, tipoEstrutura);

    setLoading(false);

    if (environment !== 'production') {
      console.log(result);
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
    } else {
      const {
        kit,
        parcelamento,
        economia,
        potencial,
      } = result;

      kit.forEach(({
        // custo,
        garantia,
        titulo,
        qtde: quantidade,
        url: urlImagem,
      }) => {
        equipamentos.push(
          <Column
            extraSmall={12}
            medium={4}
            large={3}
          >
            <Image
              src={urlImagem}
              caption={`${quantidade}x ${titulo}`}
            />
            {
              garantia
                ? (
                  <Title
                    type="h4"
                    text={`Garantia: ${garantia} anos`}
                  />
                )
                : ''
            }
          </Column>,
        );
      });

      setValorTotal(`R$ ${(parcelamento[0].valor_minimo).toFixed(2).replace('.', ',')} a R$ ${(parcelamento[0].valor_maximo).toFixed(2).replace('.', ',')}`);

      opcoesParcelas.push(
        <Input
          type="dropdown"
          options={parcelamento.map(({
            parcelas: qtdeParcelas,
            taxa_maxima,
            taxa_minina,
            valor_maximo: valorMaximo,
            valor_minimo: valorMinimo,
          }) => ({
            value: JSON.stringify({
              parcelas: qtdeParcelas,
              valorMinimo,
              valorMaximo,
            }),
            text: `${qtdeParcelas} x de R$ ${valorMinimo.toFixed(2).replace('.', ',')} a R$ ${valorMaximo.toFixed(2).replace('.', ',')}`,
          }))}
          onChange={({ target: { value } }) => {
            const {
              parcelas: qtdeParcelas,
              valorMinimo,
              valorMaximo,
            } = JSON.parse(value);

            setParcelamentoSelecionado(qtdeParcelas);
            setValorTotal(`R$ ${((qtdeParcelas * valorMinimo).toFixed(2)).replace('.', ',')} a R$ ${((qtdeParcelas * valorMaximo).toFixed(2)).replace('.', ',')}`);
          }}
        />,
      );

      setResultados(
        <Grid>
          <Row>
            <Column extraSmall={12}>
              <Title
                type="h3"
                text={`Potencial: ${potencial}`}
                classes={[replaceSpecialCharacters(potencial).toLowerCase()]}
              />
            </Column>
          </Row>
          <Row>
            <Accordion
              title="Instalação e suporte"
            >
              Mão de obra de uma empresa parceira
            </Accordion>
          </Row>
          <Row>
            <Accordion
              title="Equipamentos com garantia"
            >
              {equipamentos}
            </Accordion>
          </Row>
          <Row>
            <Accordion
              title="Parcelamento"
            >
              {opcoesParcelas}
            </Accordion>
          </Row>
        </Grid>,
      );
    }
  };

  return (
    <Container>
      <Grid>
        <Row>
          <Column extraSmall={12}>
            <Title
              type="subtitle"
              text="Faça sua cotação"
              align="center"
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
        {
          resultados || ''
        }
        {
          resultados && valorTotal
            ? (
              <Row>
                <Column extraSmall={12}>
                  <Card
                    title={`Valor total do projeto: ${valorTotal}`}
                  />
                </Column>
              </Row>
            )
            : ''
        }
      </Grid>
    </Container>
  );
}

export default IndexPage;
