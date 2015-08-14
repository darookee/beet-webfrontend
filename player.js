var initPlayer = function(beetUrl, availableAlbums) {
    var durationUpdate;

    var list = document.getElementById('list');
    var albumTemplate = document.getElementById('template');
    list.removeChild(albumTemplate);
    albumTemplate.removeAttribute('id');
    albumTemplate.className = 'album';
    var wrap = document.createElement('div');
    wrap.appendChild(albumTemplate);
    var albumHTML = wrap.innerHTML;

    var audio = document.getElementById('player--audio');

    var playPause = document.getElementsByClassName('player--play')[0];
    var playPauseDisplay = playPause.childNodes[0];
    var playTitle = document.getElementsByClassName('player--title')[0];
    var playDuration = document.getElementsByClassName('player--duration')[0];
    var playDurationCurrentDisplay = document.getElementsByClassName('player--duration_current')[0];
    var playDurationTotalDisplay = document.getElementsByClassName('player--duration_total')[0];

    var getArt = function(id) {
        return beetUrl+'/item/'+id+'/art';
    }

    var play = function(file, name, el) {
        if(typeof file !== "undefined") {
            var currentSelectedAlbum = document.getElementsByClassName('album__playing')[0];
            if(typeof currentSelectedAlbum !== "undefined") {
                currentSelectedAlbum.classList.remove('album__playing');
            }
            el.classList.add('album__playing');
            audio.src = file;
        }
        if(typeof name !== "undefined") {
            playTitle.innerHTML = name;
        }
        audio.play();
        playPauseDisplay.classList.remove('fa-play');
        playPauseDisplay.classList.add('fa-pause');
        updateDuration();
    }

    var updateDuration = function() {
        playDurationCurrentDisplay.innerHTML = minLib.timeTo(audio.currentTime);
        playDurationTotalDisplay.innerHTML = minLib.timeTo(audio.duration);
        durationUpdate = setTimeout(updateDuration, 600);
    }

    var pause = function() {
        audio.pause();
        playPauseDisplay.classList.add('fa-play');
        playPauseDisplay.classList.remove('fa-pause');
        clearTimeout(durationUpdate);
    }

    var loadAlbums = function() {
        var queryString = '';
        var loadedAlbums = 0;
        var loadableAlbums = availableAlbums.length;
        for(ai=0;ai<availableAlbums.length;ai++) {
            minLib.ajax(beetUrl+'/item/query/album_id:'+availableAlbums[ai], function(res){
                result = JSON.parse(res);
                for(i=0; i<result.results.length; i++) {
                    var albumDiv = albumTemplate.innerHTML;
                    data = result.results[i];
                    data.image = getArt(data.id);
                    list.innerHTML = list.innerHTML + minLib.template(albumHTML, data);
                }
                loadedAlbums++;
                if(loadedAlbums === loadableAlbums) {
                    bindEvents();
                }
            });
        }
    }

    var bindEvents = function() {
        console.log('binding');
        var albums = document.getElementsByClassName('album');
        for(a=0;a<albums.length;a++) {
            minLib.on(albums[a], 'click', function(e){
                var cAlbum = e.srcElement.parentElement;
                var id = cAlbum.getAttribute('data-id');
                var name = cAlbum.getAttribute('data-artist') + ' - ' + cAlbum.getAttribute('data-title');
                var file = beetUrl+'/item/'+id+'/file';
                play(file, name, cAlbum);
            });
        }
    }

    minLib.on(playPause, 'click', function(e){
        e.preventDefault();
        if(audio.paused) {
            play();
        }
        else {
            pause();
        }
        return false;
    });

    loadAlbums();
}
