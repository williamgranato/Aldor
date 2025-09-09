# Dica visual para os cards de missão
# Use `quest.icon` (injetado pelo gerador) como miniatura no canto esquerdo do card
# e a badge de rank colorida no canto superior direito.

# Exemplo em JSX:
#
# <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
#   <img src={q.icon} alt={q.monster} className="w-8 h-8 absolute -left-3 -top-3 rounded-full border border-zinc-700" />
#   <span className={`absolute right-2 top-2 text-xs px-1.5 py-0.5 rounded ${rankColors[q.requiredRank].bg} ${rankColors[q.requiredRank].text}`}>
#     {q.requiredRank}
#   </span>
#   <div className="font-semibold">{q.title}</div>
#   <div className="text-xs opacity-80">{q.description}</div>
# </div>
