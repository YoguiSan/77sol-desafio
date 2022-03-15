import { backendUrl } from '../Config';

class Simulador {
  constructor() {
    this.consultar = async (
      cep,
      valorConta,
      tipoEstrutura,
    ) => fetch(`${
      backendUrl
    }/busca-cep?estrutura=${
      tipoEstrutura
    }&valor_conta=${
      valorConta
    }&cep=${cep}`)
      .then((res) => res.json())
      .then((data) => data)
      .catch((e) => e);
  }
}

const SimuladorService = new Simulador();

export default SimuladorService;
