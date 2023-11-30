
function redirectToAnotherPage() {
    window.location.href = "../home";
}
// Ensure the DOM is ready before executing the script
$(document).ready(function () {
    'use strict';

    var supportsAudio = !!document.createElement('audio').canPlayType;

    if (supportsAudio) {
        // Initialize Plyr
        var player = new Plyr('#audio1', {
            controls: [
                'restart',
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume',
                'download'
            ]
        });

        // Initialize playlist and controls
        var index = 0,
            playing = false,
            mediaPath = 'https://archive.org/download/mythium/',
            extension = '',
            tracks = [
                // Your track data here
            ];

        // Build playlist
        $.each(tracks, function (key, value) {
            var trackNumber = value.track,
                trackName = value.name,
                trackDuration = value.duration;

            if (trackNumber.toString().length === 1) {
                trackNumber = '0' + trackNumber;
            }

            $('#plList').append(`
            <li>
                <div class="plItem">
                    <span class="plNum">${trackNumber}.</span>
                    <span class="plTitle">${trackName}</span>
                    <span class="plLength">${trackDuration}</span>
                </div>
            </li>
        `);
        });

        var trackCount = tracks.length,
            npAction = $('#npAction'),
            npTitle = $('#npTitle'),
            audio = $('#audio1').on('play', function () {
                playing = true;
                npAction.text('Now Playing...');
            }).on('pause', function () {
                playing = false;
                npAction.text('Paused...');
            }).on('ended', function () {
                npAction.text('Paused...');

                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    audio.play();
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }).get(0);

            $('#btnPrev').on('click', function () {    
            if ((index - 1) > -1) {
                index--;
                loadTrack(index);
                if (playing) {
                    audio.play();
                }
            } else {
                audio.pause();
                index = 0;
                loadTrack(index);
            }
        });

        $('#btnNext').on('click', function () {
            if ((index + 1) < trackCount) {
                index++;
                loadTrack(index);
                if (playing) {
                    audio.play();
                }
            } else {
                audio.pause();
                index = 0;
                loadTrack(index);
            }
        });

        $('#plList li').on('click', function () {
            var id = parseInt($(this).index());
            if (id !== index) {
                playTrack(id);
            }
        });

        var loadTrack = function (id) {
            $('.plSel').removeClass('plSel');
            $('#plList li:eq(' + id + ')').addClass('plSel');
            npTitle.text(tracks[id].name);
            index = id;
            audio.src = mediaPath + tracks[id].file + extension;
            updateDownload(id, audio.src);
        };

        var updateDownload = function (id, source) {
            player.on('loadedmetadata', function () {
                $('a[data-plyr="download"]').attr('href', source);
            });
        };

        var playTrack = function (id) {
            loadTrack(id);
            audio.play();
        };

        let extension = '';
if (audio.canPlayType('audio/mpeg')) {
  extension = '.mp3';
} else if (audio.canPlayType('audio/ogg')) {
  extension = '.ogg';
}


        loadTrack(index);
    } else {
        // No audio support
        $('.column').addClass('hidden');
        var noSupport = $('#audio1').text();
        $('.container').append('<p class="no-support">' + noSupport + '</p>');
    }
});
