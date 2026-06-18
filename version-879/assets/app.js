(function(){
  var menu=document.querySelector('[data-menu-toggle]');
  var mobile=document.querySelector('[data-mobile-nav]');
  if(menu&&mobile){menu.addEventListener('click',function(){mobile.classList.toggle('open')})}
  var slides=[].slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots=[].slice.call(document.querySelectorAll('[data-hero-dot]'));
  if(slides.length){
    var current=0;
    function show(i){current=(i+slides.length)%slides.length;slides.forEach(function(s,n){s.classList.toggle('active',n===current)});dots.forEach(function(d,n){d.classList.toggle('active',n===current)})}
    dots.forEach(function(d,i){d.addEventListener('click',function(){show(i)})});
    setInterval(function(){show(current+1)},5200);
  }
  function normalize(s){return (s||'').toString().toLowerCase().trim()}
  function applyFilter(){
    var input=document.querySelector('[data-search-input]');
    var select=document.querySelector('[data-category-filter]');
    var scope=document.querySelector('[data-filter-scope]')||document;
    var cards=[].slice.call(scope.querySelectorAll('.movie-card'));
    if(!cards.length||!input)return;
    var q=normalize(input.value);
    var cat=select?select.value:'';
    var shown=0;
    cards.forEach(function(card){
      var text=normalize([card.dataset.title,card.dataset.year,card.dataset.region,card.dataset.tags].join(' '));
      var ok=(!q||text.indexOf(q)>-1)&&(!cat||card.dataset.category===cat);
      card.style.display=ok?'':'none';
      if(ok)shown++;
    });
    var note=document.querySelector('[data-filter-note]');
    if(note){note.textContent=q||cat?'已筛选出相关影片':'输入关键词开始筛选片库'}
  }
  var params=new URLSearchParams(location.search);
  var q=params.get('q');
  var searchInput=document.querySelector('[data-search-input]');
  if(searchInput&&q){searchInput.value=q}
  document.querySelectorAll('[data-search-input],[data-category-filter]').forEach(function(el){el.addEventListener('input',applyFilter);el.addEventListener('change',applyFilter)});
  var form=document.querySelector('[data-search-form]');
  if(form){form.addEventListener('submit',function(evt){var input=form.querySelector('[data-search-input]');if(input&&form.getAttribute('action').indexOf('search.html')>-1&&location.pathname.endsWith('/search.html')){evt.preventDefault();history.replaceState(null,'','search.html?q='+encodeURIComponent(input.value));applyFilter()}})}
  applyFilter();
  var video=document.querySelector('video[data-src]');
  var playButton=document.querySelector('[data-play-button]');
  var status=document.querySelector('[data-player-status]');
  function setStatus(t){if(status){status.textContent=t||''}}
  function loadHls(cb){
    if(window.Hls){cb();return}
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
    s.onload=cb;
    s.onerror=function(){setStatus('播放组件加载失败')};
    document.head.appendChild(s);
  }
  function startPlayer(){
    if(!video)return;
    var src=video.getAttribute('data-src');
    if(!src)return;
    setStatus('正在加载播放源');
    if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src;video.play().catch(function(){setStatus('点击视频区域继续播放')})}
    else{loadHls(function(){if(window.Hls&&window.Hls.isSupported()){var hls=new Hls({enableWorker:true});hls.loadSource(src);hls.attachMedia(video);hls.on(Hls.Events.MANIFEST_PARSED,function(){video.play().catch(function(){setStatus('点击视频区域继续播放')})});hls.on(Hls.Events.ERROR,function(e,data){if(data&&data.fatal){setStatus('播放源加载失败，请刷新后重试')}})}else{video.src=src;video.play().catch(function(){setStatus('当前浏览器需要支持 HLS 播放')})}})}
    if(playButton){playButton.classList.add('hidden')}
  }
  if(playButton){playButton.addEventListener('click',startPlayer)}
  if(video){video.addEventListener('click',function(){if(video.paused){startPlayer()}});video.addEventListener('playing',function(){setStatus('')});video.addEventListener('error',function(){setStatus('播放源加载失败，请稍后再试')})}
})();