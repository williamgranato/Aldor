class LocalResponse<T=any> {
  ok: boolean;
  status: number;
  #data: T;
  constructor(data: T, ok=true, status=200){
    this.#data = data; this.ok = ok; this.status = status;
  }
  async json(){ return this.#data; }
}

function getBridge(){
  if (typeof window === 'undefined') throw new Error('localApiFetch only in client');
  const bridge = (window as any).__aldor;
  if (!bridge?.actions) throw new Error('Aldor bridge not found. Ensure GameProviderClient is mounted.');
  return bridge;
}

export default async function localApiFetch(path: string, options?: RequestInit){
  const method = (options?.method || 'GET').toUpperCase();
  let body: any = undefined;
  if (options?.body && typeof options.body === 'string'){
    try { body = JSON.parse(options.body); } catch {}
  } else if (options?.body && typeof (options.body as any) === 'object') {
    body = options.body;
  }

  const { getState, actions } = getBridge();

  // MISSIONS
  if (path === '/api/missions/active' && method === 'GET'){
    const state = getState();
    return new LocalResponse({ active: state.guild.activeQuests });
  }
  if (path === '/api/missions/start' && method === 'POST'){
    const { missionId, rank } = body || {};
    // try to construct a quest from missionId
    try {
      const mod = await import('@/data/quests');
      const quest = mod.getQuestById(missionId) || mod.QUESTS[0];
      actions.startQuest(quest);
      return new LocalResponse({ progress: quest });
    } catch (e){
      return new LocalResponse({ error: 'Quest not found' }, false, 400);
    }
  }
  if (path === '/api/missions/finish' && method === 'POST'){
    const { missionId } = body || {};
    actions.completeQuest(missionId);
    return new LocalResponse({ ok: true });
  }

  // MARKET
  if (path === '/api/market/catalog' && method === 'GET'){
    const state = getState();
    return new LocalResponse({ items: state.market.catalog });
  }
  if (path === '/api/market/buy' && method === 'POST'){
    const { itemId, qty=1 } = body || {};
    const state = getState();
    const item = state.market.catalog.find((i:any) => i.id === itemId);
    if (!item) return new LocalResponse({ error: 'Item not found' }, false, 404);
    const ok = actions.buyItem(item, qty);
    return new LocalResponse({ ok });
  }
  if (path === '/api/market/sell' && method === 'POST'){
    const { itemId, qty=1 } = body || {};
    const ok = actions.sellItem(itemId, qty);
    return new LocalResponse({ ok });
  }

  // PLAYER
  if (path === '/api/player/state' && method === 'GET'){
    const state = getState();
    return new LocalResponse({ player: state.player });
  }
  if (path === '/api/player/xp' && method === 'POST'){
    const { amount=0 } = body || {};
    actions.addXP(amount);
    return new LocalResponse({ ok: true });
  }
  if (path === '/api/player/attrib' && method === 'POST'){
    const { attr, delta=1 } = body || {};
    actions.bumpAttribute(attr, delta);
    return new LocalResponse({ ok: true });
  }

  // AUTH (no-op; always ok)
  if (path.startsWith('/api/auth/')){
    if (method === 'POST'){
      const { name, origin, role } = body || {};
      if (name) actions.createCharacter({ name, origin, role });
    }
    return new LocalResponse({ ok: true });
  }

  // Fallback
  return new LocalResponse({ ok: false, path, method }, false, 404);
}
