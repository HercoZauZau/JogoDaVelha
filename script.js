  // FUNCOES DO MENU ==============================================================
  let opcoes = document.querySelectorAll(`.opcoes`);
  // let sair = document.querySelector(`#sair`);
  let modo;
  let tipo = "x";
  let usuarioComeca = true;

  document.querySelector(`#sair`).addEventListener(`click`, () => {
    location.reload();
  });

  for (let i = 0; i < opcoes.length; i++) {
    opcoes[i].addEventListener(`click`, () => {
      if (i == 4) {
        if (tipo == "x") {
          tipo = "o";
          usuarioComeca = false;
          opcoes[4].innerHTML = "<p>Iniciante (Sistema)</p>";
        } else {
          tipo = "x";
          usuarioComeca = true;
          opcoes[4].innerHTML = "<p>Iniciante (Usuario)</p>";
        }
      } else {
        modo = i;
        // document.querySelector(`table`).style.display = "inherit";
        document.querySelector(`section`).style.display = "inherit";
        document.querySelector(`#sair`).style.display = "inherit";
        document.querySelector(`main`).style.display = "none";
        if (!usuarioComeca && modo != 0) {
          setTimeout(() => {
            nivel_III();
          }, 300);
        }
      }
    });
  }

  // FUNCOES DO JOGO ==============================================================
  let blocos = document.querySelectorAll(`td`);

  let terminado = false;
  let jogadaEncontrada;

  for (let i = 0; i < blocos.length; i++) {
    blocos[i].addEventListener(`click`, () => {
      processar(i);
    });
    blocos[i].innerHTML = `<div class="invisivel">${i}</div>`;
    // SIMPLES COMANDO DE DESIGN
  }

  function processar(nrBloco) {
    if (!blocos[nrBloco].getAttribute("usado")) {
      jogar(nrBloco);

      if (tipo == "o") {
        setTimeout(() => {
          switch (modo) {
            case 1:
              nivel_I();
              break;
            case 2:
              jogadaEncontrada = false;
              nivel_II();
              break;
            case 3:
              jogadaEncontrada = false;
              nivel_III();
              break;
          }
        }, 250);
      }
    }
  }

  function jogar(nrBloco) {
    if (!terminado && typeof nrBloco == "number") {
      if (!blocos[nrBloco].getAttribute("usado")) {
        if (tipo == "x") {
          blocos[nrBloco].innerHTML = `<div class="x">X</div>`;
          blocos[nrBloco].setAttribute("usado", true);
          blocos[nrBloco].setAttribute("tipo", "x");
          tipo = "o";
        } else {
          blocos[nrBloco].innerHTML = `<div class="o">O</div>`;
          blocos[nrBloco].setAttribute("usado", true);
          blocos[nrBloco].setAttribute("tipo", "o");
          tipo = "x";
        }
      }
      // ANALISAR SE ALGUEM GANHOU E ENCERRAR O JOGO
      analisarVitoria(0, 1, 2);
      analisarVitoria(3, 4, 5);
      analisarVitoria(6, 7, 8);
      analisarVitoria(0, 3, 6);
      analisarVitoria(1, 4, 7);
      analisarVitoria(2, 5, 8);
      analisarVitoria(0, 4, 8);
      analisarVitoria(2, 4, 6);
    }
  }

  // FUNCOES `NIVEIS` DO JOGO ==============================================================

  function nivel_I() {
    let nrGerado;

    for (let i = 0; i < blocos.length; i++) {
      //VERIFICAR SE ALGUM BLOCO ESTA LIVRE PRA SER JOGADO
      if (!blocos[i].getAttribute("usado")) {
        do {
          nrGerado = Math.round(Math.random() * 8);
        } while (blocos[nrGerado].getAttribute("usado"));
      }
    }

    jogar(nrGerado);
  }

  function nivel_II() {
    // ANALISAR TODAS AS JOGADAS ABERTAS COM DEFESA COMO PRIORIDADE
    analisarTodasJogadas("defesa");
    analisarTodasJogadas("ataque");
    if (!jogadaEncontrada) {
      // SE NAO HOUVER NENHUMA ABERTURA PODE JOGAR NO ALEATORIO (NIVEL_I)
      nivel_I();
    }
  }

  function nivel_III() {
    analisarTodasJogadas("ataque");
    analisarTodasJogadas("defesa");
    if (!jogadaEncontrada) {
      let pontoLivre = false;
      // TENTAR JOGAR EM PONTOS ESTRATEGICOS SE DISPONIVEIS (0,2,4,6,8)
      for (let i = 0; i < blocos.length; i += 2) {
        if (!blocos[i].getAttribute("usado")) {
          pontoLivre = true;
          do {
            nrGerado = Math.round(Math.random() * 4) * 2;
          } while (blocos[nrGerado].getAttribute("usado"));
        }
      }
      if (pontoLivre) {
        jogar(nrGerado);
      } else {
        nivel_I();
      }
    }
  }

  // FUNCOES DE ANALISE DO JOGO ==============================================================

  function analisarVitoria(pos1, pos2, pos3) {
    if (
      !terminado &&
      blocos[pos1].getAttribute("tipo") != null &&
      blocos[pos1].getAttribute("tipo") == blocos[pos2].getAttribute("tipo") &&
      blocos[pos2].getAttribute("tipo") == blocos[pos3].getAttribute("tipo")
    ) {
      blocos[pos1].style.textShadow = `5px 0px 0px #f200ff`;
      blocos[pos2].style.textShadow = `5px 0px 0px #f200ff`;
      blocos[pos3].style.textShadow = `5px 0px 0px #f200ff`;
      document.querySelector(`#resultado`).innerHTML = `'${blocos[pos1]
        .getAttribute("tipo")
        .toUpperCase()}' venceu!`;
      terminado = true;
    }
  }

  function analisarJogadas(pos1, pos2, pos3, tipo) {
    if (tipo == "ataque" && !jogadaEncontrada) {
      analisarLinha(pos1, pos2, pos3, "o");
      analisarLinha(pos2, pos3, pos1, "o");
      analisarLinha(pos3, pos1, pos2, "o");
    }
    if (tipo == "defesa" && !jogadaEncontrada) {
      analisarLinha(pos1, pos2, pos3, "x");
      analisarLinha(pos2, pos3, pos1, "x");
      analisarLinha(pos3, pos1, pos2, "x");
    }
  }

  function analisarLinha(pos1, pos2, pos3, tipo) {
    if (
      blocos[pos1].getAttribute("tipo") == tipo &&
      blocos[pos2].getAttribute("tipo") == tipo &&
      blocos[pos3].getAttribute("tipo") == null
    ) {
      jogar(pos3);
      jogadaEncontrada = true;
    }
  }

  function analisarTodasJogadas(tipo) {
    analisarJogadas(0, 1, 2, tipo);
    analisarJogadas(3, 4, 5, tipo);
    analisarJogadas(6, 7, 8, tipo);
    analisarJogadas(0, 3, 6, tipo);
    analisarJogadas(1, 4, 7, tipo);
    analisarJogadas(2, 5, 8, tipo);
    analisarJogadas(0, 4, 8, tipo);
    analisarJogadas(2, 4, 6, tipo);
  }
