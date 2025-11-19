const pontosDeColeta = [];
const ocorrencias = [];

const formPonto = document.getElementById("form-ponto");
const tabelaPontos = document.getElementById("tabela-pontos");
const filtroBairro = document.getElementById("filtro-bairro");
const filtroDia = document.getElementById("filtro-dia");

const cardTotalPontos = document.getElementById("card-total-pontos");
const cardPontosAtivos = document.getElementById("card-pontos-ativos");
const cardBairros = document.getElementById("card-bairros");

const formOcorrencia = document.getElementById("form-ocorrencia");
const selectPontoOcorrencia = document.getElementById("ocorrencia-ponto");
const tabelaOcorrencias = document.getElementById("tabela-ocorrencias");
const ocorrenciaTipo = document.getElementById("ocorrencia-tipo");
const ocorrenciaDescricao = document.getElementById("ocorrencia-descricao");
const ocorrenciaContato = document.getElementById("ocorrencia-contato");

const formRota = document.getElementById("form-rota");
const rotaBairro = document.getElementById("rota-bairro");
const rotaDia = document.getElementById("rota-dia");
const listaRotas = document.getElementById("lista-rotas");

function atualizarDashboard() {
  cardTotalPontos.textContent = pontosDeColeta.length;

  const ativos = pontosDeColeta.filter((p) => p.status === "Ativo").length;
  cardPontosAtivos.textContent = ativos;

  const bairrosUnicos = new Set(
    pontosDeColeta
      .map((p) => p.bairro.trim().toLowerCase())
      .filter((b) => b !== "")
  );
  cardBairros.textContent = bairrosUnicos.size;
}

function atualizarSelectPontosOcorrencias() {
  selectPontoOcorrencia.innerHTML = "";
  const optionInicial = document.createElement("option");
  optionInicial.value = "";
  optionInicial.textContent = "Selecione...";
  selectPontoOcorrencia.appendChild(optionInicial);

  if (pontosDeColeta.length === 0) {
    const opt = document.createElement("option");
    opt.disabled = true;
    opt.textContent = "Nenhum ponto cadastrado";
    selectPontoOcorrencia.appendChild(opt);
    return;
  }

  pontosDeColeta.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nomePonto} - ${p.bairro}`;
    selectPontoOcorrencia.appendChild(option);
  });
}

function renderizarTabela() {
  const bairroFiltro = filtroBairro.value.trim().toLowerCase();
  const diaFiltro = filtroDia.value;

  tabelaPontos.innerHTML = "";

  const pontosFiltrados = pontosDeColeta.filter((p) => {
    const bairroOk =
      bairroFiltro === "" || p.bairro.toLowerCase().includes(bairroFiltro);
    const diaOk = diaFiltro === "" || p.diaSemana === diaFiltro;
    return bairroOk && diaOk;
  });

  if (pontosFiltrados.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.className = "text-muted text-center";
    td.textContent = "Nenhum ponto encontrado com os filtros atuais.";
    tr.appendChild(td);
    tabelaPontos.appendChild(tr);
    return;
  }

  pontosFiltrados.forEach((ponto) => {
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = ponto.nomePonto;
    tr.appendChild(tdNome);

    const tdBairro = document.createElement("td");
    tdBairro.textContent = ponto.bairro;
    tr.appendChild(tdBairro);

    const tdTipo = document.createElement("td");
    tdTipo.textContent = ponto.tipoResiduo;
    tr.appendChild(tdTipo);

    const tdDia = document.createElement("td");
    tdDia.textContent = ponto.diaSemana;
    tr.appendChild(tdDia);

    const tdHorario = document.createElement("td");
    tdHorario.textContent = ponto.horario;
    tr.appendChild(tdHorario);

    const tdStatus = document.createElement("td");
    const spanStatus = document.createElement("span");
    spanStatus.classList.add("badge");

    if (ponto.status === "Ativo") {
      spanStatus.classList.add("badge-status-ativo");
    } else {
      spanStatus.classList.add("badge-status-inativo");
    }

    spanStatus.textContent = ponto.status;
    tdStatus.appendChild(spanStatus);
    tr.appendChild(tdStatus);

    tabelaPontos.appendChild(tr);
  });
}

function renderizarOcorrencias() {
  tabelaOcorrencias.innerHTML = "";

  if (ocorrencias.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.className = "text-muted text-center";
    td.textContent = "Nenhuma ocorrência registrada até o momento.";
    tr.appendChild(td);
    tabelaOcorrencias.appendChild(tr);
    return;
  }

  ocorrencias.forEach((oc) => {
    const tr = document.createElement("tr");

    const tdData = document.createElement("td");
    tdData.textContent = oc.data;
    tr.appendChild(tdData);

    const tdPonto = document.createElement("td");
    tdPonto.innerHTML = `<strong>${oc.pontoNome}</strong><br /><span class="text-muted small">${oc.bairro}</span>`;
    tr.appendChild(tdPonto);

    const tdTipo = document.createElement("td");
    tdTipo.textContent = oc.tipo;
    tr.appendChild(tdTipo);

    const tdDescricao = document.createElement("td");
    tdDescricao.textContent = oc.descricao;
    tr.appendChild(tdDescricao);

    const tdStatus = document.createElement("td");
    const badge = document.createElement("span");
    badge.classList.add("badge", "bg-warning", "text-dark");
    badge.textContent = oc.status;
    tdStatus.appendChild(badge);
    tr.appendChild(tdStatus);

    tabelaOcorrencias.appendChild(tr);
  });
}

formPonto.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!formPonto.checkValidity()) {
    event.stopPropagation();
    formPonto.classList.add("was-validated");
    return;
  }

  const novoPonto = {
    id: Date.now(),
    nomePonto: document.getElementById("nomePonto").value.trim(),
    bairro: document.getElementById("bairro").value.trim(),
    tipoResiduo: document.getElementById("tipoResiduo").value,
    diaSemana: document.getElementById("diaSemana").value,
    horario: document.getElementById("horario").value,
    status: document.getElementById("status").value,
  };

  pontosDeColeta.push(novoPonto);

  formPonto.reset();
  formPonto.classList.remove("was-validated");

  atualizarDashboard();
  renderizarTabela();
  atualizarSelectPontosOcorrencias();
});

filtroBairro.addEventListener("input", renderizarTabela);
filtroDia.addEventListener("change", renderizarTabela);

formOcorrencia.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!formOcorrencia.checkValidity()) {
    event.stopPropagation();
    formOcorrencia.classList.add("was-validated");
    return;
  }

  const pontoId = parseInt(selectPontoOcorrencia.value, 10);
  const pontoRelacionado = pontosDeColeta.find((p) => p.id === pontoId);

  const novaOcorrencia = {
    id: Date.now(),
    pontoId: pontoId,
    pontoNome: pontoRelacionado
      ? pontoRelacionado.nomePonto
      : "Ponto não identificado",
    bairro: pontoRelacionado ? pontoRelacionado.bairro : "",
    tipo: ocorrenciaTipo.value,
    descricao: ocorrenciaDescricao.value.trim(),
    contato: ocorrenciaContato.value.trim(),
    status: "Aberta",
    data: new Date().toLocaleString("pt-BR"),
  };

  ocorrencias.push(novaOcorrencia);

  formOcorrencia.reset();
  formOcorrencia.classList.remove("was-validated");

  renderizarOcorrencias();
});

formRota.addEventListener("submit", (event) => {
  event.preventDefault();

  const bairro = rotaBairro.value.trim().toLowerCase();
  const dia = rotaDia.value;

  listaRotas.innerHTML = "";

  let pontosFiltrados = pontosDeColeta.filter((p) => p.status === "Ativo");

  if (bairro !== "") {
    pontosFiltrados = pontosFiltrados.filter((p) =>
      p.bairro.toLowerCase().includes(bairro)
    );
  }

  if (dia !== "") {
    pontosFiltrados = pontosFiltrados.filter((p) => p.diaSemana === dia);
  }

  pontosFiltrados.sort((a, b) => {
    if (a.diaSemana === b.diaSemana) {
      return a.horario.localeCompare(b.horario);
    }
    return a.diaSemana.localeCompare(b.diaSemana);
  });

  if (pontosFiltrados.length === 0) {
    const li = document.createElement("li");
    li.className = "list-group-item text-muted";
    li.textContent = "Nenhum ponto encontrado para os filtros informados.";
    listaRotas.appendChild(li);
    return;
  }

  pontosFiltrados.forEach((ponto, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    li.innerHTML = `
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <strong>Parada ${index + 1}:</strong> ${ponto.nomePonto}<br />
        <span class="text-muted small">
          Bairro: ${ponto.bairro} • Dia: ${ponto.diaSemana} • Horário: ${
      ponto.horario
    }
        </span><br />
        <span class="small">Tipo de resíduo: ${ponto.tipoResiduo}</span>
      </div>
    </div>
  `;

    listaRotas.appendChild(li);
  });
});

atualizarDashboard();
renderizarTabela();
atualizarSelectPontosOcorrencias();
renderizarOcorrencias();
