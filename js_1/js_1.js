/* 비디오 리스트 가져오기 */
async function getVideoList() {
    try {
        let response = await fetch('http://oreumi.appspot.com/video/getVideoList');
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getVideoList()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}

/* 입력받은 video_id로 영상정보 가져오기 */
async function getVideoInfo(video_id) {
    try {
        let URL = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${video_id}`;
        let response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getVideoInfo()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}

/* home.html에 비디오 리스트 띄우기 */
async function loadVideo() {
    // getVideoList 함수 호출해서 영상 리스트 가져오기
    let videoList = await getVideoList();

    // 가져온 정보를 저장할 videoContainer 생성
    let videoContainer = document.getElementById('videoList');


    // videoList의 값만큼 데이터 불러오기
    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;

        // getVideoInfo에 입력받은 videoId로 정보 가져오기
        let videoInfo = await getVideoInfo(videoId);

        let views = Math.floor(videoInfo.views / 1000);


        let innerHtml = `
            <div>
                <img src="${videoInfo.image_link}" onclick='location.href="./video.html?id=${videoId}"' >
                <div style="display: flex; flex-direction: column;">
                    <p>${videoInfo.video_title}</p>
                    <div style=" width: 204px; ">
                        <p style="color: #AAA; font-family: Roboto; font-size: 12px; font-style: normal; font-weight: 400;">${videoInfo.video_channel}</p>
                        <p style="color: #AAA; font-family: Roboto; font-size: 12px; font-style: normal; font-weight: 400;">${views}K Views, ${videoInfo.upload_date}</p>
                    </div>
                </div>
            </div>
        `;

        // 데이터를 div에 삽입
        videoContainer.innerHTML += innerHtml;
    }
}


/* test.html에서 원하는 영상 클릭시 video_id로 해당 영상 가져와서 video.html에서 재생 */
async function viewVideo(video_id) {
    let videoInfo = await getVideoInfo(video_id);
    let videoContainer = document.getElementById('playVideo');

    let innerHtml = `
        <video class="video" src="${videoInfo.video_link}"
        poster="${videoInfo.image_link}" controls autoplay style="width: 50vw; height: 40vh;" ></video>
    `;

    videoContainer.innerHTML += innerHtml;
}

/* test.html에서 원하는 영상 클릭시 video_id로 해당 영상 정보 가져와서 video.html에 정보출력 */
async function displayVideoInfo(video_id) {
    let videoInfo = await getVideoInfo(video_id);
    let infoContainer = document.getElementById('displayVideoInfo');
    let views = Math.floor(videoInfo.views / 1000);

    let innerHtml = `
            <div
                <div style="display: flex; flex-direction: column;">
                    <div style=" width: 50vw;">
                        <p><h1>${videoInfo.video_title}</h1></p>
                        <p style="color: #AAA; font-family: Roboto; font-size: 12px; font-style: normal; font-weight: 400;">${videoInfo.video_channel}</p>
                        <p style="color: #AAA; font-family: Roboto; font-size: 12px; font-style: normal; font-weight: 400;">${views}K Views, ${videoInfo.upload_date}</p>
                    </div>

                    <div style="display: flex;">
                        <img src="oreumi.jpg" style="border-radius: 50%; width: 4vw; height: 6vh;">
                        <div>
                            <p>${videoInfo.video_channel}</p>
                            <p>${videoInfo.video_detail}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

    infoContainer.innerHTML += innerHtml;
}

/* video.html 우측 영상 리스트 출력하는 함수 */
async function displayVideoList() {
    // getVideoList 함수 호출해서 영상 리스트 가져오기
    let videoList = await getVideoList();

    // 가져온 정보를 저장할 videoContainer 생성
    let videoContainer = document.getElementById('displayVideoList');


    // videoList의 값만큼 데이터 불러오기
    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;

        // getVideoInfo에 입력받은 videoId로 정보 가져오기
        let videoInfo = await getVideoInfo(videoId);

        let views = Math.floor(videoInfo.views / 1000);


        let innerHtml = `
            <div>
                <div style="display: flex; flex-direction: row;">
                    <img src="${videoInfo.image_link}" onclick='location.href="./video.html?id=${videoId}"' style="width: 190px; height: 90px;" >
                    <div style=" width: 204px; flex-direction: column;">
                        <p>${videoInfo.video_title}</p>
                        <p style="color: #AAA; font-family: Roboto; font-size: 12px; font-style: normal; font-weight: 400;">${videoInfo.video_channel}</p>
                        <p style="color: #AAA; font-family: Roboto; font-size: 12px; font-style: normal; font-weight: 400;">${views}K Views, ${videoInfo.upload_date}</p>
                    </div>
                </div>
            </div>
        `;

        // 데이터를 div에 삽입
        videoContainer.innerHTML += innerHtml;
    }
}