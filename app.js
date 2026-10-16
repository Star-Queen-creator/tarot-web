const cards=[
 ['愚者','0 · THE FOOL','✧','新的开始、自由与信任','先放下对结果的控制，允许自己迈出诚实的一步。'],
 ['魔术师','I · THE MAGICIAN','✦','意志、创造与行动力','你已经拥有需要的资源，关键是把想法转化为行动。'],
 ['女祭司','II · THE HIGH PRIESTESS','☾','直觉、沉静与未知','答案尚未完全显现，先倾听内在而不是急于判断。'],
 ['皇后','III · THE EMPRESS','❀','滋养、丰盛与创造','让事情生长需要耐心，也需要温柔地照顾自己。'],
 ['皇帝','IV · THE EMPEROR','♜','秩序、边界与担当','清晰的结构和边界会帮助你重新获得掌控感。'],
 ['教皇','V · THE HIEROPHANT','⌘','传统、学习与信念','既有经验值得参考，但仍需分辨什么真正属于你。'],
 ['恋人','VI · THE LOVERS','♥','连接、选择与一致','真正的选择来自价值观的一致，而不只是短暂吸引。'],
 ['战车','VII · THE CHARIOT','♞','方向、意志与前进','集中力量，明确方向，不要让相反的声音彼此消耗。'],
 ['力量','VIII · STRENGTH','∞','勇气、耐心与温柔','强大不等于压制，温柔而坚定更能带来改变。'],
 ['隐者','IX · THE HERMIT','✺','独处、寻找与智慧','暂时退后一步，属于你的答案会在安静中浮现。'],
 ['命运之轮','X · WHEEL OF FORTUNE','◉','周期、转折与机会','变化正在发生，留意那些超出原计划的新入口。'],
 ['正义','XI · JUSTICE','⚖','平衡、事实与责任','回到事实，诚实看见每个选择需要承担的代价。'],
 ['倒吊人','XII · THE HANGED MAN','◇','暂停、换位与放下','现在未必需要推进，改变视角可能比用力更有效。'],
 ['死神','XIII · DEATH','♱','结束、蜕变与更新','某个阶段需要结束，腾出的空间会容纳新的生命。'],
 ['节制','XIV · TEMPERANCE','⚗','调和、耐心与流动','不必走向极端，缓慢调配会产生更稳定的答案。'],
 ['恶魔','XV · THE DEVIL','♑','束缚、欲望与觉察','看见自己与某种模式的依附，便已经开始获得自由。'],
 ['高塔','XVI · THE TOWER','ϟ','震动、揭示与重建','不稳固的结构正在松动，真相会成为重建的起点。'],
 ['星星','XVII · THE STAR','☆','希望、疗愈与指引','保持真实而微小的希望，它会帮助你校准方向。'],
 ['月亮','XVIII · THE MOON','☽','潜意识、迷雾与感受','并非所有不安都是事实，允许迷雾慢慢散去。'],
 ['太阳','XIX · THE SUN','☀','清晰、活力与喜悦','坦率地表达自己，让简单、真实的快乐成为方向。'],
 ['审判','XX · JUDGEMENT','♬','召唤、复苏与回应','过去的经验正在召唤你作出一次更成熟的回应。'],
 ['世界','XXI · THE WORLD','◎','完成、整合与展开','一个周期趋于完整，承认自己的成长并准备进入下一程。']
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const escapeHTML=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const TAROT_SYSTEM_PROMPT=`你是一位专业、温和、具有心理洞察力的塔罗解读师。
你的任务不是断言未来，而是结合用户的问题、牌阵位置、牌面象征、正逆位和此前抽出的牌，帮助用户进行自我观察。

解读规则：
1. 先解释当前牌在对应牌位中的意义。
2. 从第二张牌开始，必须分析它与前面牌面的联系。
3. 指出牌面之间的延续、冲突、因果或转折。
4. 区分事实、可能性和象征性启发。
5. 不制造恐惧，不给出死亡、疾病、投资等确定预言。
6. 结尾提供一个反思问题和一项温和、可执行的建议。
7. 使用自然、有温度的中文，避免堆砌牌义关键词。`;

function buildTarotContext(){
  return {
    systemPrompt:TAROT_SYSTEM_PROMPT,
    question:$('#questionInput').value.trim(),
    spread:spread==='three'?'过去-现在-未来':'单张指引',
    currentPosition:drawn.at(-1)?.position||'',
    cards:drawn.map(d=>({name:cards[d.index][0],orientation:d.reversed?'逆位':'正位',position:d.position,keywords:cards[d.index][3],guidance:cards[d.index][4]}))
  };
}

const positionMeaning={
  '此刻的指引':'它回应的是你当下最需要看见的主题。',
  '过去':'它指向已经发生、但仍在影响现状的经验或模式。',
  '现在':'它映照当前的心理状态、现实张力与可用资源。',
  '未来':'它呈现的是沿着当前方向发展时更可能出现的趋势，而不是不可改变的结果。'
};

function relationshipText(current,previous){
  if(!previous)return '';
  const reversed=current.orientation==='逆位'||previous.orientation==='逆位';
  return reversed
    ? `${current.name}与前一张${previous.name}之间存在一股需要调和的张力：前一张揭示的主题并未消失，而是在当前牌位转向内在、延迟或受到阻力。`
    : `${current.name}延续并推进了前一张${previous.name}的线索：前一张所揭示的经验，正在当前牌位形成更明确的选择与行动方向。`;
}
let spread='single', shuffleScore=0, ringOffset=0, selectedIndex=0, drawn=[], soundOn=true, dragging=false, startX=0,startY=0,lastX=0,deckStart=0,currentReversed=false;
const positions={single:['此刻的指引'],three:['过去','现在','未来']};

function go(id){$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active')}
$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
$$('.chips button').forEach(b=>b.onclick=()=>{$('#questionInput').value=b.textContent});
$$('.spread').forEach(b=>b.onclick=()=>{$$('.spread').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');spread=b.dataset.spread});
$('#voiceBtn').onclick=()=>toast('网页原型暂用文字输入，正式版将接入语音识别');
$('#historyBtn').onclick=()=>toast(localStorage.getItem('tarot-last')?'最近一次回响已保存在这台设备':'还没有保存过占卜记录');
$('#historyCount').textContent=localStorage.getItem('tarot-last')?'1':'0';
$('#toShuffle').onclick=()=>{if(!$('#questionInput').value.trim()){$('#questionInput').value='我现在最需要关注和理解的是什么？'};resetShuffle();go('shuffle')};

const deck=$('#deck');
deck.addEventListener('click',()=>{if(dragging)return;deck.classList.remove('small-shuffle');void deck.offsetWidth;deck.classList.add('small-shuffle');$('#shuffleText').textContent='牌堆正在轻柔地自动洗牌…';setTimeout(()=>{deck.classList.remove('small-shuffle');addShuffle(18,'小洗牌完成，再次触碰或左右滑动')},1100)});
deck.addEventListener('pointerdown',e=>{dragging=false;startX=lastX=e.clientX;deckStart=Date.now();deck.setPointerCapture(e.pointerId)});
deck.addEventListener('pointermove',e=>{if(!deck.hasPointerCapture(e.pointerId))return;let dx=e.clientX-startX;if(Math.abs(dx)>8)dragging=true;lastX=e.clientX;deck.classList.add('big');deck.style.setProperty('--drag',Math.max(-115,Math.min(115,dx))+'px');deck.style.setProperty('--rot',(dx/11)+'deg')});
deck.addEventListener('pointerup',e=>{let dx=e.clientX-startX;deck.classList.remove('big');deck.style.setProperty('--drag','0px');if(Math.abs(dx)>35){deck.classList.remove('large-shuffle');void deck.offsetWidth;deck.classList.add('large-shuffle');$('#shuffleText').textContent='牌堆正在大幅交错洗牌…';setTimeout(()=>{deck.classList.remove('large-shuffle');addShuffle(Math.min(42,22+Math.abs(dx)/6),'大洗牌完成，牌面已经重新排列')},1450)}setTimeout(()=>dragging=false,30)});
function addShuffle(n,text){shuffleScore=Math.min(100,shuffleScore+n);$('#shuffleProgress').style.width=shuffleScore+'%';$('#shuffleText').textContent=shuffleScore>=75?'牌已经准备好了':text;$('#finishShuffle').disabled=shuffleScore<45}
function resetShuffle(){shuffleScore=0;$('#shuffleProgress').style.width='0';$('#finishShuffle').disabled=true;$('#shuffleText').textContent='牌正在等待你的触碰'}
$('#finishShuffle').onclick=()=>{drawn=[];buildRing();updateDrawTitle();go('circle')};

function buildRing(){const ring=$('#cardRing');ring.innerHTML='';cards.forEach((c,i)=>{let el=document.createElement('div');el.className='ring-card';el.dataset.i=i;el.innerHTML='<div class="card-back"><span>☽</span><i></i><b>✦</b></div>';ring.appendChild(el)});ringOffset=Math.floor(Math.random()*cards.length);renderRing()}
function circularDiff(i,center){let d=i-center,n=cards.length;if(d>n/2)d-=n;if(d<-n/2)d+=n;return d}
function renderRing(){selectedIndex=((Math.round(ringOffset)%cards.length)+cards.length)%cards.length;$$('.ring-card').forEach((el,i)=>{let d=circularDiff(i,ringOffset),ad=Math.abs(d),x=d*112,z=-ad*82,y=ad*10,ry=-d*12,scale=Math.max(.46,1-ad*.1);el.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateY(${ry}deg) scale(${scale})`;el.style.opacity=ad>5?0:Math.max(.14,1-ad*.15);el.style.zIndex=100-Math.round(ad*10)});}
const ring=$('#cardRing');let ringStart=0,ringBase=0,verticalDraw=false;
ring.addEventListener('pointerdown',e=>{ringStart=e.clientX;startY=e.clientY;ringBase=ringOffset;verticalDraw=false;ring.setPointerCapture(e.pointerId)});
ring.addEventListener('pointermove',e=>{if(!ring.hasPointerCapture(e.pointerId))return;let dx=e.clientX-ringStart,dy=e.clientY-startY;if(Math.abs(dy)>45&&Math.abs(dy)>Math.abs(dx)*1.15)verticalDraw=true;if(!verticalDraw){ringOffset=ringBase-dx/112;renderRing()}});
ring.addEventListener('pointerup',e=>{let dy=e.clientY-startY;if(verticalDraw&&Math.abs(dy)>65){drawSelected(dy)}else{ringOffset=Math.round(ringOffset);renderRing()}});
function drawSelected(dy){let el=$$(`.ring-card`)[selectedIndex];el.style.transition='transform .65s cubic-bezier(.2,.8,.2,1),opacity .5s';el.style.transform=`translate3d(0,${dy>0?480:-480}px,150px) scale(1.25)`;el.style.opacity='0';setTimeout(()=>reveal(selectedIndex),560)}
function updateDrawTitle(){let pos=positions[spread][drawn.length];$('#positionTitle').textContent=spread==='three'?`请选择代表「${pos}」的牌`:'选择一张回应你的牌';$('#drawStep').textContent=`03 · 抽牌 ${drawn.length+1}/${positions[spread].length}`}

function reveal(index){currentReversed=Math.random()<.5;let c=cards[index],pos=positions[spread][drawn.length];drawn.push({index,reversed:currentReversed,position:pos});$('#cardName').textContent=c[0]+(currentReversed?' · 逆位':' · 正位');$('#cardNumber').textContent=c[1];$('#cardSymbol').textContent=c[2];$('#revealPosition').textContent=pos;$('.front-face').classList.toggle('reversed',currentReversed);$('#revealCard').classList.remove('flipped');$('#flipHint').classList.remove('hidden');$('#reading').classList.add('hidden-reading');$('#reading').innerHTML='';$('#oracle').classList.add('hidden');$('#oracleChat').classList.add('hidden');$('#oracleMessages').innerHTML='';$('#nextCard').classList.add('hidden');$('#saveReading').classList.add('hidden');go('reveal')}
$('#revealCard').onclick=()=>{if($('#revealCard').classList.contains('flipped'))return;$('#revealCard').classList.add('flipped');$('#flipHint').classList.add('hidden');setTimeout(showReadingProfessional,950)};
function showReading(){let d=drawn.at(-1),c=cards[d.index],question=$('#questionInput').value.trim(),reverse=d.reversed?'逆位让这股能量更偏向内在，也提醒你留意阻力与过度。':'';let link='';if(drawn.length>1){let prev=cards[drawn.at(-2).index][0];link=`它并不是孤立出现的。前一张「${prev}」留下的线索，正在这里转化为「${c[0]}」所代表的课题。`}
let final=drawn.length===positions[spread].length&&spread==='three'?`<h3>牌阵的故事</h3><p>从「${cards[drawn[0].index][0]}」到「${cards[drawn[1].index][0]}」，再走向「${cards[drawn[2].index][0]}」，这组牌邀请你看见：过去塑造了当下，但未来仍会回应你现在的选择。</p>`:'';
$('#reading').innerHTML=`<h3>牌面讯息</h3><p>${c[3]}。${reverse}</p><h3>与你的问题</h3><p>面对“${question}”，这张牌提示：${c[4]} ${link}</p>${final}<h3>给自己的一个问题</h3><p>如果暂时不追求唯一正确的答案，你此刻最诚实的感受是什么？</p>`;$('#reading').classList.remove('hidden-reading');let done=drawn.length===positions[spread].length;if(done){$('#oracle').classList.remove('hidden');$('#saveReading').classList.remove('hidden')}else{$('#nextCard').classList.remove('hidden')}}
$('#nextCard').onclick=()=>{buildRing();updateDrawTitle();go('circle')};
$('#saveReading').onclick=()=>{localStorage.setItem('tarot-last',JSON.stringify({date:new Date().toISOString(),question:$('#questionInput').value,spread,drawn}));$('#historyCount').textContent='1';toast('这次回响已保存在你的设备中');setTimeout(()=>go('welcome'),900)};
$('#soundToggle').onclick=()=>{soundOn=!soundOn;$('#soundToggle').textContent=soundOn?'♪':'×';toast(soundOn?'音效已开启':'音效已关闭')};
function openOracle(){$('#oracleChat').classList.remove('hidden');$('#oraclePrompt').classList.add('hidden');$('#oracleInput').focus()}
$('#crystalBall').onclick=openOracle;$('#oraclePrompt').onclick=openOracle;
$('#oracleSend').onclick=()=>{let text=$('#oracleInput').value.trim();if(!text)return;let user=document.createElement('p');user.className='user-message';user.textContent=text;$('#oracleMessages').appendChild(user);$('#oracleInput').value='';let names=drawn.map(d=>'「'+cards[d.index][0]+'」').join('、');let reply=document.createElement('p');reply.className='oracle-message';reply.textContent=`水晶球仍记得 ${names}。结合你刚才说的“${text}”，这组牌更像是在提醒：先分辨这是内心真实的需要，还是对结果的焦虑。回到牌面共同指向的主题，再问自己此刻能够完成的最小行动是什么。`;setTimeout(()=>{$('#oracleMessages').appendChild(reply);reply.scrollIntoView({behavior:'smooth',block:'end'})},500)};
$('#oracleInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#oracleSend').click()}});
function showReadingProfessional(){
  const ctx=buildTarotContext();
  const current=ctx.cards.at(-1);
  const previous=ctx.cards.at(-2);
  const orientation=current.orientation==='逆位'
    ? '逆位提示这股能量可能被压抑、延迟或过度使用。它不是坏结果，而是邀请你看见尚未被承认的感受与阻力。'
    : '正位让这张牌的主题更容易被觉察和运用，但仍需要通过真实行动才能成为改变。';
  const relation=relationshipText(current,previous);
  const story=ctx.cards.length===3
    ? `<h3>牌阵的故事线</h3><p>从${ctx.cards[0].name}所代表的过去经验，到${ctx.cards[1].name}映照的当前状态，再走向${ctx.cards[2].name}呈现的未来趋势，这组三张牌说明：过去塑造了你的反应方式，但未来仍会回应你此刻的选择。重点不是等待结果，而是辨认自己准备改变哪一种模式。</p>`
    : '';
  const relationBlock=relation?`<h3>与前牌的联系</h3><p>${relation}</p>`:'';
  $('#reading').innerHTML=`
    <h3>${current.position} · ${current.name}${current.orientation}</h3>
    <p>${positionMeaning[current.position]||''}${current.keywords}。${orientation}</p>
    <h3>与你的问题</h3>
    <p>面对“${escapeHTML(ctx.question)}”，这张牌更像是一面镜子：${current.guidance}</p>
    ${relationBlock}${story}
    <h3>温和的行动建议</h3>
    <p>先写下一件你能够在二十四小时内完成的小事。它不需要立刻解决全部问题，只需要让你从被动等待走向一次有意识的回应。</p>
    <h3>留给自己的问题</h3>
    <p>如果暂时放下对唯一正确答案的追求，此刻你最真实的需要，以及最害怕承认的感受，分别是什么？</p>`;
  $('#reading').classList.remove('hidden-reading');
  const done=drawn.length===positions[spread].length;
  if(done){$('#oracle').classList.remove('hidden');$('#saveReading').classList.remove('hidden')}else{$('#nextCard').classList.remove('hidden')}
}

function sendOracleFollowUp(){
  const text=$('#oracleInput').value.trim();
  if(!text)return;
  const ctx=buildTarotContext();
  const user=document.createElement('p');
  user.className='user-message';user.textContent=text;
  $('#oracleMessages').appendChild(user);$('#oracleInput').value='';
  const names=ctx.cards.map(c=>`${c.name}${c.orientation}`).join('、');
  const last=ctx.cards.at(-1);
  const reply=document.createElement('p');reply.className='oracle-message';
  reply.textContent=`我会把你补充的内容继续放回这次牌阵中理解。${names}共同指向的不是一个确定预言，而是一条正在形成的心理线索。你提到“${text}”，它与${last.name}所提醒的“${last.guidance}”产生了呼应。先分辨这句话背后是事实、期待，还是焦虑；然后选择一个你能够控制的小行动。牌面提供的是观察角度，最终决定仍然属于你。`;
  setTimeout(()=>{$('#oracleMessages').appendChild(reply);reply.scrollIntoView({behavior:'smooth',block:'end'})},500);
}
$('#oracleSend').onclick=sendOracleFollowUp;
function toast(t){let el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1800)}
