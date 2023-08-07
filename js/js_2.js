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
async function getChannelInfo(channel_name) {
    try {
        let URL = `https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channel_name}`;
        let response = await fetch(URL, { method: "POST" });
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
    let innerHtml = "";

    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);
    // console.log(videoList.length);

    // videoList의 값만큼 데이터 불러오기
    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;

        // getVideoInfo에 입력받은 videoId로 정보 가져오기
        let videoInfo = videoInfoList[i];

        let views = Math.floor(videoInfo.views / 1000);

        innerHtml += `
            <div class="load-video-info">
                <img src="${videoInfo.image_link}" class="thumbnail-img" onclick='location.href="./video.html?id=${videoId}&channel_name=${channelInfo.channel_name}"' >
                <div>
                    <p class="thumbnail-title"><a class="thumbnail-text-link" href="./video.html?id=${videoId}&channel_name=${channelInfo.channel_name}">${videoInfo.video_title}</a></p>
                    <div style="display: flex;">
                        <a href="./channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}"><img src="${channelInfo.channel_profile}" style="border-radius: 50%; width: 40px; height: 40px;"></a>
                        <div>
                            <p class="thumbnail-channel"><a class="thumbnail-text-link" href="./channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}">${videoInfo.video_channel}</a></p>
                            <p class="thumbnail-channel">${views}K Views, ${videoInfo.upload_date}</p>
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


async function displayVideoTitle(video_id) {
    let videoInfo = await getVideoInfo(video_id);
    let infoContainer = document.getElementById('displayVideoTitle');
    let infoContainer2 = document.getElementById('infoText');
    let views = Math.floor(videoInfo.views / 1000);
    let dayBefore = asOfToday(videoInfo.upload_date);

    let innerHtml = `
        <div>
            <p class="video-title">${videoInfo.video_title}</p>
        </div>
        `;

    let innerHtml2 = `
        <div>
            <p class="video-detail">${views}K Views, ${dayBefore}개월 전</p>
        </div>
    `;

    infoContainer.innerHTML += innerHtml;
    infoContainer2.innerHTML = innerHtml2;
}

/* home.html에서 원하는 영상 클릭시 video_id로 해당 영상 정보 가져와서 video.html에 정보출력 */
async function displayVideoInfo(video_id) {
    let videoInfo = await getVideoInfo(video_id);
    let infoContainer = document.getElementById('displayVideoInfo');
    let detailContainer = document.getElementById('channel-info-detail');
    let channelInfo = await getChannelInfo(videoInfo.video_channel);

    // 구독자수 계산
    subscribers = parseInt(channelInfo.subscribers);
    sub = ""
    if (subscribers < 1000) {
        sub = subscribers + "";
    }
    else if (subscribers < 1000000) {
        sub = Math.round(subscribers / 1000) + "K";
    }
    else if (subscribers < 100000000000) {
        sub = Math.round(subscribers / 1000000) + "M";
    }
    else {
        sub = Math.round(subscribers / 1000000000) + "B";
    }


    let innerHtml = `
            <div class="channel-info-box" style="display: flex; flex-direction: row;">
                <a href="./channel.html?channel_name=${channelInfo.channel_name}&id=${video_id}"><img src="${channelInfo.channel_profile}" class="channel-img"></a>
                    <div class="channel-info-text">
                        <p id="${videoInfo.video_channel}"><a class="channel-link" href="./channel.html?channel_name=${channelInfo.channel_name}&id=${video_id}">${videoInfo.video_channel}</a></p>
                        <p>${sub} Subscribers</p>
                    </div>
            </div>
        `;

    let innerDetail = `
        <p>${videoInfo.video_detail}</p>
    `;
    infoContainer.innerHTML += innerHtml;
    detailContainer.innerHTML += innerDetail;
}


/* video.html 우측 영상 리스트 출력하는 함수 */
async function displayVideoList() {
    // getVideoList 함수 호출해서 영상 리스트 가져오기
    let videoList = await getVideoList();

    // 가져온 정보를 저장할 videoContainer 생성
    let videoContainer = document.getElementById('displayVideoList');

    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);



    // videoList의 값만큼 데이터 불러오기
    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;

        // getVideoInfo에 입력받은 videoId로 정보 가져오기
        let videoInfo = videoInfoList[i];
        let dayBefore = asOfToday(videoInfo.upload_date);
        let views = Math.floor(videoInfo.views / 1000);

        let innerHtml = `
            <div class="aside-video">
                <img src="${videoInfo.image_link}" onclick='location.href="./video.html?id=${videoId}&channel_name=${videoInfo.video_channel}"' class="aside-thumbnail">
                <div class="aside-text-content">
                    <p class="aside-title"><a class="thumbnail-title-link" href="./video.html?id=${videoId}&channel_name=${videoInfo.video_channel}">${videoInfo.video_title}</a></p>
                    <p class="aside-text"><a class="thumbnail-channel-link" href="./channel.html?channel_name=${videoInfo.video_channel}&id=${videoId}">${videoInfo.video_channel}</p>
                    <p class="aside-text">${views}K Views, ${dayBefore}개월 전</p>
                </div>
            </div>
        `;

        // 데이터를 div에 삽입
        videoContainer.innerHTML += innerHtml;
    }
}

/* 댓글창 작성, 취소버튼 노출 이벤트 */
let input = document.querySelector("#commentInput");
let buttons = document.getElementById("comment-buttons");

input.onfocus = function (e) {
    buttons.style.display = "flex";
}
input.onblur = function (e) {
    buttons.style.display = "none";
    input.value = "";
}

/* 구독 버튼 이벤트 */
let flag1 = 1;
function subscribeChannel() {
    subscribes = document.getElementById("channel-subscribes");
    if (flag1 == 1) {
        flag1 = 0;
        subscribes.style.backgroundColor = "#dbdbdb";
        subscribes.value = "SUBSCRIBED";
        subscribes.style.color = "black";
    }
    else {
        flag1 = 1;
        subscribes.style.backgroundColor = "#C00";
        subscribes.value = "SUBSCRIBES";
    }
}

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
                <p>${videoInfo.video_detail}</p>
            </div>
        </div>
    `;

    // console.log(innerHtml);
    infoContainer.innerHTML += innerHtml;

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

        videoListHTML1 += `
            <div class="small-video-item" onclick="playVideo('${videoId}')">
                <img src="${videoInfo.image_link}" class="small-video-thumbnail" onclick="goToVideoPage('${videoId}', '${channel_name}')">
                <div class="small-video-info">
                    <p class="small-video-title" onclick="goToVideoPage('${videoId}', '${channel_name}')">${videoInfo.video_title}</p>
                    <p class="small-video-channel">${views}K 조회수, ${videoInfo.upload_date}</p>
                </div>
            </div>
        `;
    }

    // 두 번째 플레이리스트에 영상 추가
    for (let i = half; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;
        let videoInfo = await getVideoInfo(videoId);
        let views = Math.floor(videoInfo.views / 1000);

        videoListHTML2 += `
            <div class="small-video-item" onclick="playVideo('${videoId}')">
                <img src="${videoInfo.image_link}" class="small-video-thumbnail" onclick="goToVideoPage('${videoId}', '${channel_name}')">
                <div class="small-video-info">
                    <p class="small-video-title" onclick="goToVideoPage('${videoId}', '${channel_name}')">${videoInfo.video_title}</p>
                    <p class="small-video-channel">${views}K 조회수, ${videoInfo.upload_date}</p>
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

// 페이지 로드 시 채널 정보 로드
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URL(location.href).searchParams;
    const channel_name = urlParams.get('channel_name');
    loadChannel(channel_name);
});

/* 현재 날짜가 영상 업로드일로 부터 몇일이 지났는지 계산 */
function asOfToday(upload_date) {
    let uploadDate = new Date(upload_date);
    let currentDate = new Date();

    let minusdate = currentDate - uploadDate
    let dayBefore = minusdate / (1000 * 60 * 60 * 24) / 30;
    if (Math.floor(dayBefore) < 1) {
        dayBefore = 1;
    }
    return Math.floor(dayBefore);
}

const sideMenu = document.querySelector('.side-menu');

// 스크롤 바를 커스터마이징하기 위한 스타일 추가
const scrollbarStyle = `
::-webkit-scrollbar {
    width: 6px; /* 스크롤 바 너비 조절 */
}
  
::-webkit-scrollbar-thumb {
    background-color: #555; /* 스크롤 바 색상 조절 */
    border-radius: 3px; /* 스크롤 바 모서리 둥글게 처리 */
}
  
::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* 스크롤 바에 호버 효과 적용 */
}
`;

// 스크롤 바 스타일 추가
sideMenu.style.cssText += scrollbarStyle;