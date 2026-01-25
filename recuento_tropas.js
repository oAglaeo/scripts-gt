javascript:
if (window.location.href.indexOf('&screen=ally&mode=members') < 0 || window.location.href.indexOf('&screen=ally&mode=members_members_troops') > -1) {
    window.location.assign(game_data.link_base_pure + "ally&mode=members");
}

var CONFIG = { full: 18000, threeQuarter: 13500, half: 9000, quarter: 4500 };
var baseURL = `game.php?screen=ally&mode=members_troops&player_id=`;
var playerURLs = [];
var players = [];
var playerData = {};

$('input:radio[name=player]').each(function () {
    playerURLs.push(baseURL + $(this).attr("value"));
    players.push($(this).parent().text().trim());
});

var css = `
<style>
    .soph-wrapper { 
        position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        z-index: 10000; width: 920px; max-height: 85vh; overflow-y: auto;
        background: #2b1b3d !important; color: #f0e6ff; font-family: Verdana,Arial; 
        border: 2px solid #7d4dbb; border-radius: 15px; padding: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    }
    .script-titulo {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #d1b3ff;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 10px rgba(125, 77, 187, 0.6);
    }
    .nick-firma { 
        position: absolute; top: 8px; left: 15px; font-size: 11px; 
        color: #d1b3ff; font-style: italic; font-weight: bold;
        text-shadow: 0 0 5px rgba(255,255,255,0.6);
    }
    .btn-cerrar-x { position: absolute; top: 5px; right: 15px; color: #ff4d4d; cursor: pointer; font-weight: bold; font-size: 24px; line-height: 1; }
    
    .soph-header { background: #4a2c72; border: 1px solid #7d4dbb; padding: 12px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-top: 15px; margin-bottom: 15px; }
    .soph-config-area { display: none; background: #3a235a; border: 1px solid #7d4dbb; padding: 12px; border-radius: 10px; margin-bottom: 15px; }
    .soph-filter-area { background: #3a235a; border: 1px solid #7d4dbb; padding: 15px; margin-bottom: 25px; border-radius: 10px; }
    
    .player-row-main { 
        background: #422a63; border: 1px solid #7d4dbb; padding: 8px 12px; 
        display: flex; align-items: center; justify-content: space-between; 
        margin-top: 5px; border-radius: 8px; 
        transition: all 0.2s ease;
    }
    .player-row-main:hover { transform: translateX(10px); background: #52357a; box-shadow: 0 0 10px rgba(125,77,187,0.5); }
    
    .nuke-counts { display: flex; align-items: center; gap: 12px; font-weight: bold; font-size: 11px; }
    .detail-btn { color: #bb8eff; text-decoration: underline; cursor: pointer; font-size: 11px; margin-left: 15px; font-weight: bold; }
    
    .detail-box { display: none; background: #1f1231; border: 1px solid #7d4dbb; padding: 10px; border-radius: 8px; margin-top: 2px; }
    .tbl-tribal { width: 100%; border-collapse: collapse; font-size: 11px; }
    .tbl-tribal th { background: #4a2c72 !important; color: #e0b0ff !important; border: 1px solid #7d4dbb !important; padding: 6px; text-align: center; }
    .tbl-tribal td { border: 1px solid #7d4dbb !important; padding: 5px; background: #2b1b3d !important; text-align: center; color: #ffffff !important;}
    
    .btn-tribal { background: #7d4dbb; color: white; border: 1px solid #000; padding: 5px 12px; cursor: pointer; font-weight: bold; font-size: 11px; border-radius: 5px; }
    .btn-excel { background: #000000 !important; color: #ffffff !important; border: 1px solid #7d4dbb !important; padding: 7px 18px; cursor: pointer; font-weight: bold; font-size: 11px; border-radius: 6px; margin-top: 4px; }

    .bb-box, .search-res { display: none !important; background: #2b1b3d; border: 2px solid #7d4dbb; padding: 20px; margin-top: 10px; position: relative; border-radius: 10px;}
    #bbArea { width: 98%; height: 120px; background: #1f1231; color: #fff; border: 1px solid #7d4dbb; border-radius: 5px; padding: 5px; font-size: 10px;}
    
    .btn-copiar { background: #4a2c72; color: #e0b0ff; border: 1px solid #7d4dbb; padding: 3px 10px; cursor: pointer; font-size: 10px; border-radius: 4px; margin-top: 8px; font-weight: bold; transition: 0.3s; }
    .btn-copiar:hover { background: #7d4dbb; color: white; }

    #progressbar { position: fixed; top: 40px; left: 50%; transform: translateX(-50%); width: 800px; background: #2b1b3d !important; z-index: 10001; border: 2px solid #7d4dbb; border-radius: 15px; padding: 3px; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
    #progress { height: 35px; background: #7d4dbb !important; text-align: center; color: white !important; line-height: 35px; font-weight: bold; border-radius: 10px; transition: width 0.2s; font-size: 13px; }
    .u-ico { vertical-align: middle; width: 16px; height: 16px; margin-right: 2px; }
</style>`;
$("head").append(css);

window.runFilter = function() {
    var attr = $("#fAttr").val();
    var comp = $("#fComp").val();
    var val = parseInt($("#fVal").val()) || 0;
    var res = [];
    $.each(playerData, function(pName, data) {
        data.offVillages.forEach(v => {
            var check = v[attr];
            if (attr === "cX") check = parseInt(v.coord.split("|")[0]);
            if (attr === "cY") check = parseInt(v.coord.split("|")[1]);
            var match = (comp === ">") ? check > val : (comp === "<") ? check < val : check === val;
            if (match) res.push({ p: pName, v: v });
        });
    });
    var h = `<span onclick="$('#searchRes').hide()" style="float:right; cursor:pointer; color:red; font-weight:bold;">X</span><strong>Resultados:</strong><br><table class="tbl-tribal"><thead><tr><th>Jugador</th><th>Coord</th><th>Hacha</th><th>Lija</th><th>Ariete</th><th>Catas</th></tr></thead><tbody>`;
    res.forEach(r => { h += `<tr><td>${r.p}</td><td><a href="${r.v.url}" style="color:#bb8eff;">${r.v.coord}</a></td><td>${r.v.axe}</td><td>${r.v.light}</td><td>${r.v.ram}</td><td>${r.v.catapult}</td></tr>`; });
    h += `</tbody></table>`;
    $("#searchRes").html(h).attr('style', 'display: block !important;');
};

window.copyBB = function() {
    var copyText = document.getElementById("bbArea");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    var btn = $(".btn-copiar");
    btn.text("¡Copiado!").css("background", "#28a745");
    setTimeout(function(){ btn.text("Copiar").css("background", "#4a2c72"); }, 2000);
};

window.genBB = function() {
    var selected = $("#bbFilter").val();
    var bb = (selected === "all") ? "[b]RECUENTO OFENSIVO TRIBU[/b]\n[table][**]Jugador[||]Full[||]3/4[||]1/2[||]1/4[/**]\n" : `[b]RECUENTO: [player]${selected}[/player][/b]\n[table][**]Pueblo[||]Hacha[||]Lija[||]Ariete[||]Catas[/**]\n`;
    if (selected === "all") $.each(playerData, function(n, d) { bb += `[*] [player]${n}[/player] [|] ${d.nukes.f} [|] ${d.nukes.tq} [|] ${d.nukes.h} [|] ${d.nukes.q}\n`; });
    else playerData[selected].offVillages.forEach(v => { bb += `[*] ${v.coord} [|] ${v.axe} [|] ${v.light} [|] ${v.ram} [|] ${v.catapult}\n`; });
    bb += "[/table]";
    $("#bbArea").val(bb); $(".bb-box").attr('style', 'display: block !important;');
};

window.exportExcel = function() {
    var csv = "Jugador;Pueblo;Hachas;Ligeras;Arietes;Catas\n";
    $.each(playerData, function(n, d) { d.offVillages.forEach(v => { csv += `${n};${v.coord};${v.axe};${v.light};${v.ram};${v.catapult}\n`; }); });
    var link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], {type: 'text/csv'})); link.download = "informe_ofensivo.csv"; link.click();
};

function renderUI() {
    $(".soph-wrapper").remove();
    var h = `
    <div class="soph-wrapper">
        <div class="nick-firma">aaglaee 💜</div>
        <div class="btn-cerrar-x" onclick="$('.soph-wrapper').remove()">✘</div>
        <div class="script-titulo">Recuento Ofensivo</div>
        <div class="soph-header">
            <div>
                <span onclick="$('.soph-config-area').slideToggle(200)" style="cursor:pointer; font-size: 20px;">⚙️</span>
                <span style="margin-left:15px; font-weight:bold;">Exportar:</span>
                <select id="bbFilter" style="background:#2b1b3d; color:white; border-radius:4px;"><option value="all">-- TODA LA TRIBU --</option></select>
                <button class="btn-tribal" onclick="genBB()">BBCode</button>
            </div>
            <button class="btn-excel" onclick="exportExcel()">Exportar Excel</button>
        </div>
        <div class="soph-config-area">
            <b>Configuración:</b><br><br>
            F: <input id="vFull" type="number" value="${CONFIG.full}" style="width:55px; background:#2b1b3d; color:white;"> | 
            3/4: <input id="v34" type="number" value="${CONFIG.threeQuarter}" style="width:55px; background:#2b1b3d; color:white;"> | 
            1/2: <input id="v12" type="number" value="${CONFIG.half}" style="width:55px; background:#2b1b3d; color:white;"> | 
            1/4: <input id="v14" type="number" value="${CONFIG.quarter}" style="width:55px; background:#2b1b3d; color:white;">
            <button class="btn-tribal" onclick="applyConfig()">Actualizar</button>
        </div>
        <div class="soph-filter-area">
            <b>Filtro:</b><br><br>
            <select id="fAttr" style="background:#2b1b3d; color:white;">
                <option value="axe">Hachas</option><option value="light">Ligeras</option>
                <option value="ram">Arietes</option><option value="catapult">Catas</option>
                <option value="cX">Coordenada X</option><option value="cY">Coordenada Y</option>
            </select>
            <select id="fComp" style="background:#2b1b3d; color:white;"><option value=">">></option><option value="<"><</option><option value="=">=</option></select>
            <input type="number" id="fVal" value="0" style="width:65px; background:#2b1b3d; color:white;">
            <button class="btn-tribal" onclick="runFilter()">Filtrar</button>
            <div id="searchRes" class="search-res"></div>
        </div>
        <div class="bb-box">
            <span onclick="$('.bb-box').hide()" style="cursor:pointer; color:red; float:right; font-weight:bold;">X</span>
            <textarea id="bbArea" readonly></textarea>
            <button class="btn-copiar" onclick="copyBB()">Copiar</button>
        </div>
        <div id="pCont"></div>
    </div>`;
    $("body").append(h);

    $.each(playerData, function(name, data) {
        $("#bbFilter").append(`<option value="${name}">${name}</option>`);
        var pid = name.replace(/\s/g,'_').replace(/['"]/g, '');
        var row = `
        <div class="player-row-main">
            <div style="width:180px"><b>${name}</b></div>
            <div class="nuke-counts">
                <span><img src="https://dses.innogamescdn.com/asset/809c991e/graphic/unit/unit_ram.png" class="u-ico"> F: ${data.nukes.f}</span>
                <span><img src="https://dses.innogamescdn.com/asset/809c991e/graphic/unit/unit_axe.png" class="u-ico"> 3/4: ${data.nukes.tq}</span>
                <span>🤔 1/2: ${data.nukes.h}</span>
                <span>😢 1/4: ${data.nukes.q}</span>
                <span class="detail-btn" onclick="$('#det-${pid}').slideToggle(150)">+ detalles</span>
            </div>
        </div>
        <div id="det-${pid}" class="detail-box">
            <table class="tbl-tribal">
                <thead><tr><th>Coord</th><th>Hacha</th><th>Lija</th><th>Ariete</th><th>Catas</th><th>Snob</th></tr></thead>
                <tbody>${data.offVillages.map(v => `<tr><td><a href="${v.url}" style="color:#bb8eff;">${v.coord}</a></td><td>${v.axe}</td><td>${v.light}</td><td>${v.ram}</td><td>${v.catapult}</td><td>${v.snob}</td></tr>`).join('')}</tbody>
            </table>
        </div>`;
        $("#pCont").append(row);
    });
}

function startAnalysis() {
    $(".soph-wrapper, #progressbar").remove();
    playerData = {};
    $("body").append(`<div id="progressbar"><div id="progress" style="width: 0%;">Prepárate para la alegría o el susto...</div></div>`);
    var index = 0;
    function loadNext() {
        if (index >= players.length) { $("#progressbar").remove(); renderUI(); return; }
        $("#progress").css("width", ((index + 1) / players.length * 100) + "%").text("Prepárate para la alegría o el susto... (" + Math.round(((index + 1) / players.length * 100)) + "%)");
        $.get(playerURLs[index], function(data) {
            var pData = { nukes: { f: 0, tq: 0, h: 0, q: 0 }, offVillages: [] };
            $(data).find(".vis.w100 tr").not(':first').each(function() {
                var c = $(this).children();
                var link = c.find("a[href*='screen=info_village']").first();
                if (link.length === 0) return;
                var co = link.text().match(/\d{1,3}\|\d{1,3}/);
                if (!co) return;
                var v = {
                    url: link.attr("href"), coord: co[0],
                    axe: parseInt(c.eq(4).text()) || 0, spy: parseInt(c.eq(6).text()) || 0,
                    light: parseInt(c.eq(7).text()) || 0, marcher: parseInt(c.eq(8).text()) || 0,
                    ram: parseInt(c.eq(10).text()) || 0, catapult: parseInt(c.eq(11).text()) || 0,
                    snob: parseInt(c.eq(13).text()) || 0
                };
                var pop = v.axe + (v.spy*2) + (v.light*4) + (v.marcher*5) + (v.ram*5) + (v.catapult*8);
                if (pop >= CONFIG.quarter) {
                    if (pop >= CONFIG.full) pData.nukes.f++; 
                    else if (pop >= CONFIG.threeQuarter) pData.nukes.tq++; 
                    else if (pop >= CONFIG.half) pData.nukes.h++; 
                    else pData.nukes.q++;
                    pData.offVillages.push(v);
                }
            });
            playerData[players[index]] = pData;
            index++; setTimeout(loadNext, 250);
        });
    }
    loadNext();
}

window.applyConfig = function() {
    CONFIG.full = parseInt($("#vFull").val()) || 18000;
    CONFIG.threeQuarter = parseInt($("#v34").val()) || 13500;
    CONFIG.half = parseInt($("#v12").val()) || 9000;
    CONFIG.quarter = parseInt($("#v14").val()) || 4500;
    startAnalysis();
};

startAnalysis();
