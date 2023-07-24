function loadVideoInfo() {
    let vidoeTitle = document.getElementById("videoTitle").value; // 영화 제목 가져옴
    if (vidoeTitle === '') {
        alert('영상 제목을 입력해주세요.');
        return;
    }
    /////ddddddddddsdas
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // 데이터가 잘 받아와 졌을 때 처리
                let data = JSON.parse(xhr.responseText)
                if (data.Response === 'False') {
                    alert('영화 정보를 가져오는데 실패했습니다.');
                } else {
                    let videoInfo = '';
                    videoInfo += '<h2>' + data.Title + '</h2>';
                    videoInfo += '<p><strong>장르:</strong>' + data.Genre + '</p>';
                    videoInfo += '<p><strong>감독:</strong>' + data.Director + '</p>';
                    videoInfo += '<p><strong>배우:</strong>' + data.Actors + '</p>';
                    document.getElementById('videoInfo').innerHTML = videoInfo;
                }
            } else {
                alert('영상 정보를 가져오는데 실패했습니다.');
            }
        }
    };
    xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoList&t=' + encodeURIComponent(vidoeTitle), true);
    xhr.send();
}