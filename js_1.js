// getVideoInfo API 가져오기
function getVideoInfo() {
    // 비동기 작업 수행을 위해 Promise 객체 사용
    return new Promise(function (resolve, reject) {
        let url = 'http://oreumi.appspot.com/video/getVideoInfo?video_id=1&t=';

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // 성공적으로 처리 했을 때 resolv하여 반환
                    let data = JSON.parse(xhr.responseText);
                    resolve(data);
                } else {
                    // 실패했을 때, reject를 통해 실패 원인 반환
                    reject(xhr.status);
                }
            }
        };

        xhr.open('GET', url);
        xhr.send();

    });
}

// getVideoList 가져오기
function getVideoList() {
    // 비동기 작업 수행을 위한 Promise 객체 사용
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        let url = 'http://oreumi.appspot.com/video/getVideoList';

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // 성공적으로 처리 했을 때 resolv하여 반환
                    let data = JSON.parse(xhr.responseText);
                    resolve(data);
                } else {
                    // 실패했을 때, reject를 통해 실패 원인 반환
                    reject(xhr.status);
                }
            }
        };

        xhr.open('GET', url);
        xhr.send();
    });
}

// 동영상 목록 가져와서 화면에 표시
// 비동기 함수 async 사용
async function playVideoList() {
    try {
        // !! videoListContainer 변수임으로 나중에 바뀐다면 여기도 바꿔주세요!
        // !! getElementById('videoList') html에서 정의한 이름으로 통일해야 함!
        // videoListContainer 변수 사용해 html <body> 부분에 있는 videoList라는 요소를 가져옴
        let videoListContainer = document.getElementById('videoList');

        // for문을 사용해 영상 정보 순회
        for (let i = 0; i < videoList.length; videoId++) {
            let video = videoList[i];
            // 각 영상 정보마다 <div> 요소 생성 및 
            // 그 안에 이미지, 제목, 업로드, 채널, 상세 설명, ID, 태그, 조회수 요소 추가
            let videoItem = document.createElement('div');
            videoItem.classList.add('video-item');

            // 동영상 썸네일 이미지
            let Image = document.createElement('img');
            Image.src = video.image_link;
            videoItem.appendChild(Image);

            // 동영상 제목
            let title = doctument.reateElement('h2');
            title.textContent = video.video_title;
            videoItem.appendChild(title);

            // 업로드
            let uploadDate = document.createElement('p');
            uploadDate.textContent = '업로드: ${video.upload_date}';
            videoItem.appendChild(uploadDate);

            // 채널
            let channel = document.createElement('p');
            channel.textContent = '채널: &{video.video_channel}';
            videoItem.appendChild(channel);

            // 동영상 상세 설명
            let videoDetail = document.createElement('p');
            videoDetail.textContent = `상세 설명: ${video.video_detail}`;
            videoItem.appendChild(videoDetail);

            // ID
            let videoId = document.createElement('p');
            videoId.textContent = `ID: ${video.video_id}`;
            videoItem.appendChild(videoId);

            // 태그
            let tags = document.createElement('p');
            tags.textContent = `태그: ${video.video_tag.join(', ')}`;
            videoItem.appendChild(tags);

            // 조회수
            let views = document.createElement('p');
            views.textContent = `조회수: ${video.views}`;
            videoItem.appendChild(views);

            // 생성한 정보 요소를 videoListContainer에 추가해 화면에 표시
            videoListContainer.appendChild(videoItem);
        }
    } catch (error) {
        // 데이터를 가져오지 못한 경우 출력
        console.error('해당하는 영상을 찾을 수 없습니다.', error);
    }
}
playVideoList();