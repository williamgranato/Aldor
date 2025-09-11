/* PATCH: data/missions.ts – amplia missões por rank (12+ por tier) e fornece gerador */
export type Tier = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';

const TIER_SECONDS: Record<Tier, number> = { F:3000,E:4000,D:5000,C:6000,B:7000,A:10000,S:12000,SS:15000,SSS:18000 };

type Seed = { title:string; desc:string };
type MissionDef = { id:string; tier:Tier; title:string; desc:string; durationMs:number; reward:{ xp:number; coinsCopper:number; drops:Array<{id:string, qty:number, chance:number}> } };

const pool: Record<Tier, Seed[]> = {
  F: [
    {title:'Varredura da Praça',desc:'Limpe a praça principal antes do pôr-do-sol.'},
    {title:'Carregar Barris',desc:'Ajude o taverneiro com os barris de hidromel.'},
    {title:'Correio Local',desc:'Entregue bilhetes entre artesãos.'},
    {title:'Pastorear Gansos',desc:'Leve os gansos de volta ao cercado.'},
    {title:'Afiar Ferramentas',desc:'Auxilie o ferreiro com a afiação básica.'},
    {title:'Varrer Estábulos',desc:'Limpe o estábulo e alimente os pôneis.'},
    {title:'Recolher Lixo',desc:'Organize a coleta de lixo da rua leste.'},
    {title:'Vigiar Ponte',desc:'Fique de olho na ponte até o anoitecer.'},
    {title:'Apoiar Feira',desc:'Ajude a montar as barracas da feira.'},
    {title:'Entregar Lenha',desc:'Distribua lenha para as casas pobres.'},
    {title:'Cuidar da Fonte',desc:'Remova algas e limpe a fonte central.'},
    {title:'Organizar Biblioteca',desc:'Reordene os tomos do scriptorium.'},
  ],
  E: [
    {title:'Correio da Aldeia',desc:'Entregue cartas entre comerciantes.'},
    {title:'Patrulha Leve',desc:'Ronda breve ao redor das muralhas.'},
    {title:'Entrega de Suprimentos',desc:'Leve remédios ao curandeiro.'},
    {title:'Coleta de Ervas',desc:'Junte ervas simples na orla da floresta.'},
    {title:'Mensageiro Rápido',desc:'Leve selo do prefeito à guarnição.'},
    {title:'Vigília no Portão',desc:'Turno curto no portão oeste.'},
    {title:'Sinalizadores',desc:'Verifique os faróis do leste.'},
    {title:'Mapear Trilha',desc:'Atualize o mapa da trilha norte.'},
    {title:'Escolta de Camponês',desc:'Acompanhe colheita até o celeiro.'},
    {title:'Inspeção de Mercado',desc:'Ajude o intendente com pesagens.'},
    {title:'Pesquisa de Preços',desc:'Conheça valores para o mestre mercador.'},
    {title:'Mensagem para o Templo',desc:'Leve recado ao sumo-sacerdote.'},
  ],
  D: [
    {title:'Patrulha da Estrada',desc:'Acompanhe comboio pequeno.'},
    {title:'Afugentar Lobos',desc:'Proteger fazendas próximas.'},
    {title:'Coleta de Minério',desc:'Ajude mineiros na entrada da caverna.'},
    {title:'Reparo de Empalizada',desc:'Substitua estacas quebradas.'},
    {title:'Caça a Bandidos',desc:'Espante ladrões da estrada.'},
    {title:'Entrega Urgente',desc:'Carregamento delicado ao monastério.'},
    {title:'Sondar Caverna',desc:'Mapear primeira seção segura.'},
    {title:'Guardar Caravana',desc:'Revezamento na traseira do comboio.'},
    {title:'Rastreamento Simples',desc:'Procure sinais de urso pardo.'},
    {title:'Defesa do Moinho',desc:'Proteja moinho de vândalos.'},
    {title:'Remos no Rio',desc:'Transporte pescadores contra a corrente.'},
    {title:'Zelador da Torre',desc:'Manutenção nos degraus da torre.'},
  ],
  C: [
    {title:'Caçada Local',desc:'Eliminar bestas nos campos.'},
    {title:'Proteger Caravana',desc:'Escolta média até a próxima cidade.'},
    {title:'Explorar Caverna',desc:'Ir além do corredor seguro.'},
    {title:'Rastreamento de Besta',desc:'Seguir pegadas desconhecidas.'},
    {title:'Limpar Asseclas',desc:'Expulsar capangas da ponte.'},
    {title:'Resgatar Herbário',desc:'Recuperar livros tomados por goblins.'},
    {title:'Investigar Ruínas',desc:'Localizar câmara lacrada.'},
    {title:'Ajuda ao Alquimista',desc:'Buscar reagentes nocivos.'},
    {title:'Proteção de Celeiro',desc:'Noite inteira contra saqueadores.'},
    {title:'Sondar Catacumbas',desc:'Marcar rotas e armadilhas.'},
    {title:'Ronda de Fronteira',desc:'Turno frio nas colinas.'},
    {title:'Reconhecer Pântano',desc:'Evitar poças tóxicas e brumas.'},
  ],
  B: [
    {title:'Exploração de Ruínas',desc:'Mapeie corredores instáveis.'},
    {title:'Escolta de Mercadores',desc:'Proteja acordo importante.'},
    {title:'Sondar Pântano',desc:'Averiguar criatura lamacenta.'},
    {title:'Recuperar Relíquia',desc:'Artefato caiu em mãos erradas.'},
    {title:'Investigar Culto',desc:'Seguir rituais suspeitos.'},
    {title:'Quebra-Código',desc:'Decifrar inscrições antigas.'},
    {title:'Pista do Traficante',desc:'Rastrear caravanas ilegais.'},
    {title:'Resgate Discreto',desc:'Retirar refém sem alarde.'},
    {title:'Purificar Poço',desc:'Água amarga, possível veneno.'},
    {title:'Matar Ogro',desc:'Criatura forte ao sul.'},
    {title:'Recensear Guarnição',desc:'Contar e registrar baixas.'},
    {title:'Interdição de Passo',desc:'Fechar gargalo da serra.'},
  ],
  A: [
    {title:'Escolta Nobre',desc:'Sem arranhar a carruagem.'},
    {title:'Investigar Culto',desc:'Base subterrânea suspeita.'},
    {title:'Relíquia Perdida',desc:'Artefato atrai ladrões experientes.'},
    {title:'Contrabando Arcano',desc:'Interceptar carga perigosa.'},
    {title:'Fera do Abismo',desc:'Rugidos ouvidos à noite.'},
    {title:'Cerco Breve',desc:'Ajudar a romper paliçadas.'},
    {title:'Guarda da Torre',desc:'Sino não deve parar.'},
    {title:'Rota Interditada',desc:'Reabrir via de comércio.'},
    {title:'Espionagem',desc:'Infiltrar-se em banquete.'},
    {title:'Expurgo da Cripta',desc:'Osso sobre osso.'},
    {title:'Besta Lacustre',desc:'Surgiu no lago profundo.'},
    {title:'Visita Real',desc:'Garantir protocolo perfeito.'},
  ],
  S: [
    {title:'Behemoth Menor',desc:'Afastar criatura antiga.'},
    {title:'Purificar Cripta',desc:'Silenciar mortos inquietos.'},
    {title:'Ataque a Bandidos',desc:'Acabar com o covil.'},
    {title:'Fenda Breve',desc:'Fechar rasgos menores.'},
    {title:'Arauto Sombrio',desc:'Descobrir origem do presságio.'},
    {title:'Vigia do Vale',desc:'Repelir invasores noturnos.'},
    {title:'Fera das Neves',desc:'Cortes que não estancam.'},
    {title:'Poço Profano',desc:'Sussurros no fundo.'},
    {title:'Guarda-Mago',desc:'Proteger conjurador em ritual.'},
    {title:'Assalto ao Forte',desc:'Abrir portões do lado de dentro.'},
    {title:'Cortejo Fúnebre',desc:'Evitar interrupções profanas.'},
    {title:'Armadura Viva',desc:'Desativar golem defeituoso.'},
  ],
  SS: [
    {title:'Fenda Arcana',desc:'Rasgo instável crescendo.'},
    {title:'Cerco à Fortaleza',desc:'Longo e caro.'},
    {title:'Queda do Basilisco',desc:'Cegueira verde.'},
    {title:'Coração do Vulcão',desc:'Calor impossível.'},
    {title:'Cisma de Magos',desc:'Duelos ilegais.'},
    {title:'Lorde Vampiro',desc:'Noite sem fim.'},
    {title:'Arca Perdida',desc:'Atrai cobiça do reino.'},
    {title:'Titã de Pedra',desc:'Tremer de montanhas.'},
    {title:'Dilúvio Espelhado',desc:'Águas que imitam.'},
    {title:'Conclave Roubado',desc:'Nomes sussurrados.'},
    {title:'Gema Faminta',desc:'Brilho que drena.'},
    {title:'Colosso da Muralha',desc:'Punhos do tamanho de torres.'},
  ],
  SSS: [
    {title:'Dragão Antigo',desc:'Escamas como muralhas.'},
    {title:'Golem Colossal',desc:'Coração alquímico perdido.'},
    {title:'Guardião da Fenda',desc:'Olho que não pisca.'},
    {title:'Deus Menor',desc:'Acordou faminto.'},
    {title:'Fratura do Mundo',desc:'Linha de falha arcana.'},
    {title:'Abismo de Vidro',desc:'Estilhaços infinitos.'},
    {title:'Trono Vazio',desc:'Rei sem nome retorna.'},
    {title:'Coroa Dividida',desc:'Insígnias caóticas.'},
    {title:'Sopro da Origem',desc:'Primeiro vento volta.'},
    {title:'Última Sentinela',desc:'O relógio do fim.'},
    {title:'Rito Mortal',desc:'Feitiço que consome.'},
    {title:'Lua Partida',desc:'Luz em cacos no céu.'},
  ]
};

function rngInt(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min; }

export function getGuildMissions(): MissionDef[] {
  const out: MissionDef[] = [];
  (Object.keys(pool) as Tier[]).forEach((t)=>{
    pool[t].forEach((seed, idx)=>{
      const baseXp = {F:6,E:12,D:20,C:28,B:40,A:60,S:85,SS:120,SSS:180}[t];
      const baseCopper = {F:60,E:120,D:220,C:330,B:520,A:800,S:1100,SS:1600,SSS:2400}[t];
      const drops = (t==='F'||t==='E'||t==='D')
        ? [{ id:'herb', qty:1, chance:0.35 }]
        : [{ id:'core', qty:1, chance:0.2 }, { id:'fang', qty:1, chance:0.15 }];
      out.push({
        id:`guild:${t}:${idx}:${seed.title}`,
        tier:t,
        title:seed.title,
        desc:seed.desc,
        durationMs:TIER_SECONDS[t],
        reward:{ xp: baseXp + rngInt(0, 6), coinsCopper: baseCopper + rngInt(0, 60), drops }
      });
    });
  });
  return out;
}
