// 처음 화면 로드 시 전체 비디오 리스트 가져오기

getVideoList().then(loadVideo);

/* 비디오 리스트 가져오기 */
async function getVideoList() {
    try {
        let response = await fetch('https://oreumi.appspot.com/video/getVideoList');
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getVideoList()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}

/* 입력받은 video_id로 영상정보 가져오기 */
async function getVideoInfo(video_id) {
    try {
        let URL = `https://oreumi.appspot.com/video/getVideoInfo?video_id=${video_id}`;
        let response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getVideoInfo()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}

/* 입력받는 채널의 정보 가져오기 */
async function getChannelInfo(channer_name) {
    try {
        let URL = `https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channer_name}`;
        let response = await fetch(URL, { method: "POST" });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getChannelInfo()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}

// 검색 버튼 클릭 이벤트 처리
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const searchKeyword = searchInput.value;
    if (searchKeyword.trim() !== '') {
        filterVideoList(searchKeyword); // 검색 결과 가져오기
    }
});

// 엔터 키 감지 이벤트 처리
searchInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        const searchKeyword = searchInput.value;
        if (searchKeyword.trim() !== '') {
            filterVideoList(searchKeyword); // 검색 결과 가져오기
        }
        event.preventDefault(); // 기본 엔터키 동작 방지
    }
});

// 검색 필터링 함수 수정
async function filterVideoList(searchKeyword) {
    try {
        let videoList = await getVideoList();
        let filteredVideoList = videoList.filter((video) => {
            const videoTitle = video.video_title.toLowerCase();
            const channelName = video.video_channel.toLowerCase();
            return videoTitle.includes(searchKeyword.toLowerCase()) || channelName.includes(searchKeyword.toLowerCase());
        });
        loadFilteredVideo(filteredVideoList); // 검색 결과를 화면에 표시
    } catch (error) {
        console.error("검색 중 오류가 발생했습니다.", error);
    }
}

/* home.html에 검색 인풋값으로 필터링 된 비디오 리스트 띄우기 */
async function loadFilteredVideo(filteredVideoList) {
    // getVideoList 함수 호출해서 영상 리스트 가져오기
    let videoList = filteredVideoList;

    // 가져온 정보를 저장할 videoContainer 생성
    let videoContainer = document.getElementById('videoList');
    let innerHtml = "";
    videoContainer.innerHTML = innerHtml;

    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    const channelInfoPromises = videoList.map((video) => getChannelInfo(video.video_channel));
    const channelInfoList = await Promise.all(channelInfoPromises);

    // videoList의 값만큼 데이터 불러오기
    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;

        // getVideoInfo에 입력받은 videoId로 정보 가져오기
        let videoInfo = videoInfoList[i];

        let views = Math.floor(videoInfo.views / 1000);
        let dayBefore = asOfToday(videoInfo.upload_date);

        let channelInfo = channelInfoList[i];

        innerHtml += `
            <div class="load-video-info">
                <img src="${videoInfo.image_link}" class="thumbnail-img" onclick='location.href="Html/video.html?id=${videoId}&channel_name=${channelInfo.channel_name}"' >
                <div>
                    <div style="display: flex;">
                        <a href="Html/channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}"><img src="${channelInfo.channel_profile}" style="border-radius: 50%; width: 40px; height: 40px;"></a>
                        <div>
                        <p class="thumbnail-title"><a class="thumbnail-title-link" href="Html/video.html?id=${videoId}&channel_name=${channelInfo.channel_name}">${videoInfo.video_title}</a></p>
                            <div>
                                <p class="thumbnail-channel"><a class="thumbnail-text-link" href="Html/channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}">${videoInfo.video_channel}</a></p>
                                <p class="thumbnail-channel">${views}K Views, ${dayBefore}일전</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // console.log(innerHtml);
        // 데이터를 div에 삽입
        videoContainer.innerHTML = innerHtml;
    }
}

/* home.html에 비디오 리스트 띄우기 */
async function loadVideo() {
    // getVideoList 함수 호출해서 영상 리스트 가져오기
    let videoList = await getVideoList();

    // 가져온 정보를 저장할 videoContainer 생성
    let videoContainer = document.getElementById('videoList');
    let innerHtml = "";

    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    const channelInfoPromises = videoList.map((video) => getChannelInfo(video.video_channel));
    const channelInfoList = await Promise.all(channelInfoPromises);

    // videoList의 값만큼 데이터 불러오기
    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;

        // getVideoInfo에 입력받은 videoId로 정보 가져오기
        let videoInfo = videoInfoList[i];

        let views = Math.floor(videoInfo.views / 1000);
        let dayBefore = asOfToday(videoInfo.upload_date);

        let channelInfo = channelInfoList[i];

        innerHtml += `
            <div class="load-video-info">
                <img src="${videoInfo.image_link}" class="thumbnail-img" onclick='location.href="Html/video.html?id=${videoId}&channel_name=${channelInfo.channel_name}"' >
                <div>
                    <div style="display: flex;">
                        <a href="Html/channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}"><img src="${channelInfo.channel_profile}" style="border-radius: 50%; width: 40px; height: 40px;"></a>
                        <div>
                        <p class="thumbnail-title"><a class="thumbnail-title-link" href="./video.html?id=${videoId}&channel_name=${channelInfo.channel_name}">${videoInfo.video_title}</a></p>
                            <div>
                                <p class="thumbnail-channel"><a class="thumbnail-text-link" href="./channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}">${videoInfo.video_channel}</a></p>
                                <p class="thumbnail-channel">${views}K Views, ${dayBefore}일전</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // console.log(innerHtml);
        // 데이터를 div에 삽입
        videoContainer.innerHTML = innerHtml;
    }
}

function asOfToday(upload_date) {
    let uploadDate = new Date(upload_date);
    let currentDate = new Date();

    let minusdate = currentDate - uploadDate
    let dayBefore = minusdate / (1000 * 60 * 60 * 24);
    return Math.floor(dayBefore);
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
    try {
        // getVideoList 함수를 호출하여 영상 리스트를 가져옵니다.
        let videoList = await getVideoList();

        // 가져온 정보를 저장할 videoContainer를 생성합니다.
        let videoContainer = document.getElementById('displayVideoList');

        // videoList의 값만큼 데이터를 불러옵니다.
        for (let i = 0; i < videoList.length; i++) {
            let videoId = videoList[i].video_id;

            // getVideoInfo에 입력받은 videoId로 정보를 가져옵니다.
            let videoInfo = await getVideoInfo(videoId);

            let views = Math.floor(videoInfo.views / 1000);

            let innerHtml = `
            <div>
                <div class="aside-video">
                <img src="${videoInfo.image_link}" onclick='location.href="./video.html?id=${videoId}&channel_name=${videoInfo.video_channel}"' class="aside-thumbnail">
                    <div style=" width: 204px; flex-direction: column;">
                        <p class="aside-title">${videoInfo.video_title}</p>
                        <p class="aside-text">${videoInfo.video_channel}</p>
                        <p class="aside-text">${views}K 조회수, ${videoInfo.upload_date}</p>
                    </div>
                </div>
            </div>
            `;

            // 데이터를 div에 삽입합니다.
            videoContainer.innerHTML += innerHtml;
        }
    } catch (error) {
        // 비동기 작업 중 발생한 오류를 처리합니다.
        console.error("비디오 목록을 표시하는 동안 오류가 발생했습니다:", error);
    }
}

// 사이드바 스크롤
window.addEventListener('scroll', function () {
    // 현재 스크롤 위치를 계산
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    // 스크롤 위치를 표시할 요소 가져오기
    const scrollIndicator = document.getElementById('scrollIndicator');

    // 표시할 텍스트를 업데이트
    scrollIndicator.textContent = `스크롤 위치: ${scrollPercentage.toFixed(2)}%`;

    // 표시 여부를 결정
    if (scrollTop > 10) {
        scrollIndicator.style.display = 'block';
    } else {
        scrollIndicator.style.display = 'none';
    }
});