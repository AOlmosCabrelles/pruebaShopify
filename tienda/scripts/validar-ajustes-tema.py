# Comprueba que los valores de configuración del tema (templates/*.json, sections/*.json y
# config/settings_data.json) son válidos según los schemas. Shopify rechaza al sincronizar
# desde GitHub los archivos con valores no válidos, sin avisar en la tienda.
# Uso: python3 tienda/scripts/validar-ajustes-tema.py <carpeta-del-tema>
import json, re, glob, os, sys
os.chdir(sys.argv[1])
def schema_de(path):
    s=open(path).read()
    m=re.search(r'\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}', s, re.S)
    return json.loads(m.group(1)) if m else None
sec={os.path.basename(p)[:-7]:schema_de(p) for p in glob.glob('sections/*.liquid')}
blk={os.path.basename(p)[:-7]:schema_de(p) for p in glob.glob('blocks/*.liquid')}
def cargar(p):
    t=open(p).read()
    if t.lstrip().startswith('/*'): t=t[t.index('*/')+2:]
    return json.loads(t)
problemas=[]
def check(settings_def, valores, donde):
    defs={d['id']:d for d in settings_def if 'id' in d}
    for k,v in (valores or {}).items():
        d=defs.get(k)
        if not d: problemas.append(f"{donde}: ajuste '{k}' no existe en el schema"); continue
        t=d['type']
        if isinstance(v,str) and '{{' in v: continue
        if t in ('select','radio','text_alignment'):
            ops=[o['value'] for o in d.get('options',[])]
            if ops and v not in ops: problemas.append(f"{donde}: '{k}'='{v}' no es una opción válida {ops[:8]}")
        if t=='range':
            if not isinstance(v,(int,float)): problemas.append(f"{donde}: '{k}' debe ser número ({v!r})")
            else:
                if v<d['min'] or v>d['max']: problemas.append(f"{donde}: '{k}'={v} fuera de rango [{d['min']},{d['max']}]")
                elif d.get('step') and abs(((v-d['min'])/d['step'])-round((v-d['min'])/d['step']))>1e-6: problemas.append(f"{donde}: '{k}'={v} no cuadra con step {d['step']} desde {d['min']}")
        if t=='color' and isinstance(v,str) and v and not re.match(r'^(#[0-9a-fA-F]{3,8}|rgba?\(.*\))$',v): problemas.append(f"{donde}: color '{k}'={v!r}")
        if t=='checkbox' and not isinstance(v,bool): problemas.append(f"{donde}: checkbox '{k}'={v!r}")
def bloques(defs_tipos, bloques_json, donde):
    for bid,b in (bloques_json or {}).items():
        t=b.get('type')
        if t in ('@app',): continue
        sch=blk.get(t)
        local=None
        for bd in defs_tipos or []:
            if bd.get('type')==t and 'settings' in bd: local=bd
        if local: check(local.get('settings',[]), b.get('settings'), f"{donde} › bloque {bid} ({t})"); continue
        if sch is None: problemas.append(f"{donde}: tipo de bloque '{t}' no existe"); continue
        check(sch.get('settings',[]), b.get('settings'), f"{donde} › bloque {bid} ({t})")
        bloques(sch.get('blocks',[]), b.get('blocks'), f"{donde} › {bid}")
for p in sorted(glob.glob('templates/*.json')+glob.glob('sections/*.json')):
    d=cargar(p)
    for sid,s in d.get('sections',{}).items():
        sch=sec.get(s['type'])
        if sch is None: problemas.append(f"{p}: sección '{s['type']}' no existe"); continue
        check(sch.get('settings',[]), s.get('settings'), f"{p} › {sid}")
        bloques(sch.get('blocks',[]), s.get('blocks'), f"{p} › {sid}")
        for bid in s.get('block_order',[]):
            if bid not in s.get('blocks',{}): problemas.append(f"{p} › {sid}: block_order '{bid}' sin bloque")
# settings_data
ss=json.load(open('config/settings_schema.json'))
defs=[st for g in ss for st in g.get('settings',[])]
sd=cargar('config/settings_data.json')
check(defs, {k:v for k,v in sd['current'].items() if k!='content_for_index'}, 'settings_data › current')
print('\n'.join(problemas) if problemas else 'Sin problemas')
print(len(problemas),'problemas')
