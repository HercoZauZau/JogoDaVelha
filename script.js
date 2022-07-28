// 27.07.22
// zauzauherco@gmail.com

// FUNCOES DO MENU ==============================================================
let opcoes = document.querySelectorAll(`.opcoes`);
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
        opcoes[4].innerHTML = "<p>Iniciante (Computador)</p>";
      } else {
        tipo = "x";
        usuarioComeca = true;
        opcoes[4].innerHTML = "<p>Iniciante (Jogador)</p>";
      }
    } else {
      modo = i;
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
let novoJogo = document.querySelector(`#novoJogo`);
let patamar = document.querySelector(`#patamar`);
let pX = document.querySelector(`#pX`);
let pO = document.querySelector(`#pO`);
let pontosX = 0;
let pontosO = 0;
let pontosE = 0;

let terminado = false;
let jogadaEncontrada;

for (let i = 0; i < blocos.length; i++) {
  blocos[i].addEventListener(`click`, () => {
    processar(i);
  });
  blocos[i].innerHTML = `<div class="invisivel">${i}</div>`;
  // SIMPLES COMANDO DE DESIGN
}

novoJogo.addEventListener(`click`, resetar);

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
      }, 500);
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

    analisarEmpate();
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
let resultado = document.querySelector(`#resultado`);

function analisarVitoria(pos1, pos2, pos3) {
  if (
    !terminado &&
    blocos[pos1].getAttribute("tipo") != null &&
    blocos[pos1].getAttribute("tipo") == blocos[pos2].getAttribute("tipo") &&
    blocos[pos2].getAttribute("tipo") == blocos[pos3].getAttribute("tipo")
  ) {
    blocos[pos1].style.color = `#FF3AF3`;
    blocos[pos2].style.color = `#FF3AF3`;
    blocos[pos3].style.color = `#FF3AF3`;
    resultado.className = `destaca`;
    resultado.innerHTML = `${blocos[pos1]
      .getAttribute("tipo")
      .toUpperCase()} VENCEU!`;
    terminado = true;

    if (blocos[pos1].getAttribute("tipo") == "x") {
      pontosX++;
    } else if (blocos[pos1].getAttribute("tipo") == "o") {
      pontosO++;
    }

    pX.innerHTML = `X (${pontosX})`;
    pE.innerHTML = `E! (${pontosE})`;
    pO.innerHTML = `O (${pontosO})`;
  }
}

function analisarEmpate() {
  if (!terminado) {
    let fechado = true;

    for (let i = 0; i < blocos.length; i++) {
      if (!blocos[i].getAttribute("usado")) {
        fechado = false;
      }
    }

    if (fechado) {
      resultado.className = ``;
      resultado.innerHTML = "EMPATE!";

      pontosE++;
      pX.innerHTML = `X (${pontosX})`;
      pE.innerHTML = `E! (${pontosE})`;
      pO.innerHTML = `O (${pontosO})`;
    }
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

function resetar() {
  for (let i = 0; i < blocos.length; i++) {
    for (let i = 0; i < blocos.length; i++) {
      blocos[i].addEventListener(`click`, () => {
        processar(i);
      });
      blocos[i].innerHTML = `<div class="invisivel">${i}</div>`;
      // SIMPLES COMANDO DE DESIGN
    }

    blocos[i].removeAttribute("tipo");
    blocos[i].removeAttribute("usado");
    blocos[i].innerHTML = "";
    blocos[i].style.color = `#969696`;

    terminado = false;
    resultado.innerHTML = "";
  }

  if (usuarioComeca) {
    tipo = "x";
  } else {
    tipo = "o";

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
