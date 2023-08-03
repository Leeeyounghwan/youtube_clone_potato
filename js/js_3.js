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

/* 입력받는 채널의 정보 가져오기 */
async function getChannelInfo(channel_name) {
    try {
        let URL = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channel_name}`;
        let response = await fetch(URL, { method: "POST" });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getVideoInfo()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}


/* 채널부분 배너 영상 및 하단 플레이리스트 작성부분 시작 */
async function loadChannel(name, id) {
    let videoInfo = await getVideoInfo(id);
    let infoContainer = document.getElementById('channel-title');

    let channel_name = name;
    let channelInfo = await getChannelInfo(channel_name);
    // console.log(videoInfo.video_detail)

    let innerHtml = `
        <div style="display: flex;">
        <img class="channel-profile" src="${channelInfo.channel_profile}" style="border-radius: 50%; width: 40px; height: 40px;">
            <div>
                <p class="channel-profile" id="${channelInfo.channel_name}">${channelInfo.channel_name}</p>
                <p id="${channelInfo.subscribers}">${channelInfo.subscribers}</p>
                <p>${channelInfo.channel_name}</p>
            </div>
        </div>
    `;

    // console.log(innerHtml);
    infoContainer.innerHTML += innerHtml;

    // 채널 배너, 비디오 로드
    loadChannelBanner(channel_name);
    loadPlaylistVideos(channel_name);
    loadChannelMainVideo(channel_name);


}

/* 현재 날짜가 영상 업로드일로 부터 몇일이 지났는지 계산 */
function asOfToday(upload_date) {
    let uploadDate = new Date(upload_date);
    let currentDate = new Date();

    let minusdate = currentDate - uploadDate
    let dayBefore = minusdate / (1000 * 60 * 60 * 24);
    return Math.floor(dayBefore);
}

/* 채널 배너 로드 */
async function loadChannelBanner(channel_name) {
    let bannerContainer = document.getElementById("channel-cover");

    let channelInfo = await getChannelInfo(channel_name);

    innerHtml = `
        <img src="${channelInfo.channel_banner}">
    `
    bannerContainer.innerHTML = innerHtml;
}

/* 해당 채널 최고 조회수 영상 및 영상정보 로드 */
async function loadChannelMainVideo(channel_name) {
    let mainVideoContainer = document.getElementById("channel-video");
    let videoList = await getVideoList();

    mostView = 0;
    videoId = 0;
    // 해당 채널의 비디오만 필터링
    videoList = videoList.filter((video) => video.video_channel === channel_name);

    for (let i = 0; i < videoList.length; i++) {
        if (mostView < videoList[i].views) {
            videoId = videoList[i].video_id;
            mostView = videoList[i].views;
        }
    }

    let videoInfo = await getVideoInfo(videoId);
    let dayBefore = asOfToday(videoInfo.upload_date);
    let views = Math.floor(videoInfo.views / 1000);

    let innerHtml = `
        <video class="most-view-video" src="${videoInfo.video_link}"
        poster="${videoInfo.image_link}" controls autoplay style="width: 35vw; height: 25vh;"></video>

        <div class="most-view-info">
            <p class="most-view-title" onclick="goToVideoPage('${videoId}', '${channel_name}')">${videoInfo.video_title}</p>
            <p class="most-view-upload">${views}K views, ${dayBefore}일전</p>
            <p class="most-view-detail">Chris Fisher, also known as the Blind Woodturner, learned his craft by listening to hundreds of hours of YouTube videos and experimenting in his workshop. Now he’s a YouTube creator himself, sells his products worldwide, and does demonstrations all around the country.</p>
        </div>
    `

    mainVideoContainer.innerHTML += innerHtml;
}

/* 플레이리스트 비디오 로드 */
async function loadPlaylistVideos(channel_name) {
    let videoList = await getVideoList();

    // 해당 채널의 비디오만 필터링
    videoList = videoList.filter((video) => video.video_channel === channel_name);

    // 플레이리스트를 절반씩 나누기 위한 변수
    const half = Math.ceil(videoList.length / 2);

    let videoListContainer1 = document.querySelector('.small-video-list-1'); // 첫 번째 플레이리스트 컨테이너
    let videoListContainer2 = document.querySelector('.small-video-list-2'); // 두 번째 플레이리스트 컨테이너

    let videoListHTML1 = ''; // 첫 번째 플레이리스트의 비디오 목록 HTML
    let videoListHTML2 = ''; // 두 번째 플레이리스트의 비디오 목록 HTML

    // 첫 번째 플레이리스트에 영상 추가
    for (let i = 0; i < half; i++) {
        let videoId = videoList[i].video_id;
        let videoInfo = await getVideoInfo(videoId);
        let views = Math.floor(videoInfo.views / 1000);
        let dayBefore = asOfToday(videoInfo.upload_date);

        videoListHTML1 += `
            <div class="small-video-item" onclick="playVideo('${videoId}')">
                <img src="${videoInfo.image_link}" class="small-video-thumbnail" onclick="goToVideoPage('${videoId}', '${channel_name}')">
                <div class="small-video-info">
                    <p class="small-video-title" onclick="goToVideoPage('${videoId}', '${channel_name}')">${videoInfo.video_title}</p>
                    <p class="small-video-channel">${views}K views, ${dayBefore}일전</p>
                </div>
            </div>
        `;
    }

    // 두 번째 플레이리스트에 영상 추가
    for (let i = half; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;
        let videoInfo = await getVideoInfo(videoId);
        let views = Math.floor(videoInfo.views / 1000);
        let dayBefore = asOfToday(videoInfo.upload_date);

        videoListHTML2 += `
            <div class="small-video-item" onclick="playVideo('${videoId}')">
                <img src="${videoInfo.image_link}" class="small-video-thumbnail" onclick="goToVideoPage('${videoId}', '${channel_name}')">
                <div class="small-video-info">
                    <p class="small-video-title" onclick="goToVideoPage('${videoId}', '${channel_name}')">${videoInfo.video_title}</p>
                    <p class="small-video-channel">${views}K 조회수, ${dayBefore}일전</p>
                </div>
            </div>
        `;
    }

    // 각각의 플레이리스트 div에 비디오 목록 HTML을 삽입
    videoListContainer1.innerHTML = videoListHTML1;
    videoListContainer2.innerHTML = videoListHTML2;
}

// 영상 페이지로 이동하는 함수
function goToVideoPage(videoId, channelName) {
    window.location.href = `./video.html?id=${videoId}&channel_name=${channelName}`;
}

// 구독 상태를 토글하는 함수
function toggleSubscription(channel_name) {
    const subscribeButton = document.querySelector('.subscribe-button');
    const unsubscribeButton = document.querySelector('.unsubscribe-button');

    if (subscribeButton.style.display === 'none') {
        // 구독 상태인 경우
        // 구독 취소 처리 로직 추가
        // ...

        subscribeButton.style.display = 'inline';
        unsubscribeButton.style.display = 'none';
    } else {
        // 구독하지 않은 상태인 경우
        // 구독 처리 로직 추가
        // ...

        subscribeButton.style.display = 'none';
        unsubscribeButton.style.display = 'inline';
    }
}


